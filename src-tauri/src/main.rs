// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::{
    header::{HeaderMap, HeaderName, HeaderValue},
    Client,
};
use types::{header::Header, request::Request, request_trace::RequestTrace, response::Response};

pub mod types;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
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

    let mut request_builder = client
        .request(request.method.clone().into(), request.url.clone())
        .headers(header_map);
    println!("__{request_builder:?}");

    if !request.body.is_empty() {
        // TODO:
        request_builder = request_builder.body(request.body);
        println!("<>{request_builder:?}");
    }

    let request = request_builder
        .build()
        .map_err(|err| format!("Failed to build request, err: {err:?}"))?;

    println!("REQUEST : {request:?}");

    let response = client
        .execute(
            request
                .try_clone()
                .ok_or(format!("Failed to clone actual_request"))?,
        )
        .await
        .map_err(|e| e.to_string())?;

    let response_status = response.status().as_u16();
    let headers = response
        .headers()
        .iter()
        .map(|h| h.try_into())
        .collect::<Result<Vec<Header>, String>>()?;
    let response_body = response.text().await.map_err(|e| e.to_string())?;

    let request = request.try_into()?;

    let response = Response {
        status: response_status,
        headers,
        body_string: response_body,
    };

    Ok(RequestTrace { request, response })
}
