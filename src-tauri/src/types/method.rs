use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "UPPERCASE")]
pub enum Method {
    Get,
    Post,
    Put,
    Delete,
    Options,
    Head,
    Trace,
    Connect,
    Patch,
}

impl Into<reqwest::Method> for Method {
    fn into(self) -> reqwest::Method {
        match self {
            Method::Get => reqwest::Method::GET,
            Method::Post => reqwest::Method::POST,
            Method::Put => reqwest::Method::PUT,
            Method::Delete => reqwest::Method::DELETE,
            Method::Options => reqwest::Method::OPTIONS,
            Method::Head => reqwest::Method::HEAD,
            Method::Trace => reqwest::Method::TRACE,
            Method::Connect => reqwest::Method::CONNECT,
            Method::Patch => reqwest::Method::PATCH,
        }
    }
}

impl Into<Method> for reqwest::Method {
    fn into(self) -> Method {
        match self {
            reqwest::Method::GET => Method::Get,
            reqwest::Method::POST => Method::Post,
            reqwest::Method::PUT => Method::Put,
            reqwest::Method::DELETE => Method::Delete,
            reqwest::Method::OPTIONS => Method::Options,
            reqwest::Method::HEAD => Method::Head,
            reqwest::Method::TRACE => Method::Trace,
            reqwest::Method::CONNECT => Method::Connect,
            reqwest::Method::PATCH => Method::Patch,
            method => panic!("Got unexpected reqwest method {method:?}"),
        }
    }
}
