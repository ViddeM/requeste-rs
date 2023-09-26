#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reqwest::Client;
use serde::{Deserialize, Serialize};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Deserialize)]
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
struct Response {
    status: Status,
}

#[derive(Serialize)]
struct Status {
    code: u8,
    text: String,
}

#[tauri::command]
async fn send_request(request: Request) -> Result<Response, String> {
    let client = Client::new();
    let response = client
        .request(request.method.into(), request.url)
        .send()
        .await
        .map_err(String::from)?;

    Ok(Response {
        status: Status {
            code: 200,
            text: "OK".into(),
        },
    })
}
