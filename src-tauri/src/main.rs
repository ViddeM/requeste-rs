// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;

use reqwest::{
    header::{HeaderMap, HeaderName, HeaderValue},
    Client,
};
use serde::{Deserialize, Serialize};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Deserialize)]
#[serde(rename_all = "UPPERCASE")]
enum Method {
    Get,
    Post,
    Put,
    Delete,
    Options,
    Head,
}

impl From<Method> for reqwest::Method {
    fn from(m: Method) -> Self {
        match m {
            Method::Get => reqwest::Method::GET,
            Method::Post => reqwest::Method::POST,
            Method::Put => reqwest::Method::PUT,
            Method::Delete => reqwest::Method::DELETE,
            Method::Options => reqwest::Method::OPTIONS,
            Method::Head => reqwest::Method::HEAD,
        }
    }
}

#[derive(Deserialize)]
struct Request {
    url: String,
    method: Method,
    headers: Vec<Header>,
}

#[derive(Deserialize)]
struct Header {
    name: String,
    value: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Response {
    status: u16,
    headers: HashMap<String, String>,
    body_string: String,
}

#[tauri::command]
async fn send_request(request: Request) -> Result<Response, String> {
    let client = Client::new();

    let header_map: HeaderMap = request
        .headers
        .into_iter()
        .map(|h| {
            (
                HeaderName::from_lowercase(h.name.to_lowercase().as_bytes())
                    .map_err(|e| format!("Invalid header name, err: {e:?}")),
                HeaderValue::from_str(h.value.as_str())
                    .map_err(|e| format!("Invalid header value, err: {e:?}")),
            )
        })
        .map(|h| match h {
            (Ok(n), Ok(v)) => Ok((n, v)),
            (Err(e), _) => Err(e),
            (_, Err(e)) => Err(e),
        })
        .collect::<Result<HeaderMap, String>>()?;

    let response = client
        .request(request.method.into(), request.url)
        .headers(header_map)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let response_status = response.status().as_u16();
    let headers = response
        .headers()
        .iter()
        .map(map_header)
        .collect::<Result<HashMap<String, String>, String>>()?;
    let response_body = response.text().await.map_err(|e| e.to_string())?;

    Ok(Response {
        status: response_status,
        headers,
        body_string: response_body,
    })
}

fn map_header((name, val): (&HeaderName, &HeaderValue)) -> Result<(String, String), String> {
    match val.to_str() {
        Ok(v) => Ok((name.as_str().into(), v.into())),
        Err(e) => Err(format!(
            "Failed to convert header value to string, err: {e:?}"
        )),
    }
}
