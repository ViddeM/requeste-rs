use http_body_util::Empty;
use hyper::body::Bytes;
use serde::{Deserialize, Serialize};

use super::{header::Header, method::Method};

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Request {
    pub url: String,
    pub method: Method,
    pub body: Option<String>,
    pub headers: Vec<Header>,
}

impl TryFrom<hyper::Request<Empty<Bytes>>> for Request {
    type Error = eyre::Report;

    fn try_from(value: hyper::Request<Empty<Bytes>>) -> Result<Self, Self::Error> {
        Ok(Self {
            url: value.uri().to_string(),
            method: value.method().clone().try_into()?,
            body: None,
            headers: value
                .headers()
                .into_iter()
                .map(|h| h.try_into())
                .collect::<eyre::Result<Vec<Header>>>()?,
        })
    }
}
