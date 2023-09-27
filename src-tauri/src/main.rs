// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client;
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
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Response {
    status: u16,
    body_string: String,
}

#[tauri::command]
async fn send_request(request: Request) -> Result<Response, String> {
    let client = Client::new();
    let response = client
        .request(request.method.into(), request.url)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let response_status = response.status().as_u16();
    let response_body = response.text().await.map_err(|e| e.to_string())?;

    Ok(Response {
        status: response_status,
        body_string: response_body,
    })
}
