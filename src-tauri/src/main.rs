// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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

#[derive(Serialize, Deserialize, Debug, Clone)]
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

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct Request {
    url: String,
    method: Method,
    headers: Vec<Header>,
}

#[derive(Deserialize, Serialize)]
struct Header {
    name: String,
    value: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct RequestTrace {
    request: Request,
    response: Response,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Response {
    status: u16,
    headers: Vec<Header>,
    body_string: String,
}

#[tauri::command]
async fn send_request(request: Request) -> Result<RequestTrace, String> {
    let client = Client::new();

    let header_map: HeaderMap = request
        .headers
        .iter()
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
        .request(request.method.clone().into(), request.url.clone())
        .headers(header_map)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let response_status = response.status().as_u16();
    let headers = response
        .headers()
        .iter()
        .map(map_header)
        .collect::<Result<Vec<Header>, String>>()?;
    let response_body = response.text().await.map_err(|e| e.to_string())?;

    let response = Response {
        status: response_status,
        headers,
        body_string: response_body,
    };

    Ok(RequestTrace { request, response })
}

fn map_header((name, val): (&HeaderName, &HeaderValue)) -> Result<Header, String> {
    let value = val
        .to_str()
        .map_err(|err| format!("Failed to convert header value to string, err: {err:?}"))?;

    Ok(Header {
        name: name.to_string(),
        value: value.to_string(),
    })
}
