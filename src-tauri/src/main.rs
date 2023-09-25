#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

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
    Option,
    Head,
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
    text: String
}

#[tauri::command]
fn send_request(request: Request) -> Result<Response, String> {
    let client = Client::builder().
}
 