// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use eyre::{Context, OptionExt};
use http_body_util::{BodyExt, Empty};
use hyper::body::Bytes;
use hyper_util::{client::legacy::Client, rt::TokioExecutor};
use types::{request::Request, request_trace::RequestTrace, response::Response};

pub mod types;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn send_request(request: Request) -> Result<RequestTrace, String> {
    match make_request(request).await {
        Ok(trace) => Ok(trace),
        Err(err) => Err(format!("Failed to make request, err: {err:?}")),
    }
}

async fn make_request(request: Request) -> eyre::Result<RequestTrace> {
    let url = request.url.parse::<hyper::Uri>()?;

    let authority = url.authority().ok_or_eyre("Missing authority?")?.clone();

    let mut req = hyper::Request::builder()
        .uri(url)
        .method(request.method)
        // TODO: Handle default headers. (request-size, accept, host, user-agent)
        .header(hyper::header::HOST, authority.as_str());

    for header in request.headers.into_iter() {
        req = req.header(header.name, header.value);
    }

    let req = if let Some(_body) = request.body {
        // TODO: Support request body
        req.body(Empty::<Bytes>::new())?
    } else {
        req.body(Empty::<Bytes>::new())?
    };

    let https = hyper_rustls::HttpsConnectorBuilder::new()
        .with_native_roots()
        .wrap_err("Failed to read local certificates store for TLS")?
        .https_or_http()
        .enable_http1()
        .enable_http2()
        .build();

    let client: Client<_, Empty<Bytes>> = Client::builder(TokioExecutor::new()).build(https);

    let response = client
        .request(req.clone())
        .await
        .wrap_err("Failed to send request")?;

    let mut resp = Response::base_from_response(&response)?;

    let body = String::from_utf8_lossy(
        &response
            .into_body()
            .collect()
            .await
            .wrap_err("Could not get body")?
            .to_bytes(),
    )
    .to_string();

    resp.with_body(body);

    Ok(RequestTrace {
        request: req.try_into().wrap_err("Failed to parse sent request")?,
        response: resp,
    })
}
