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
    pub version: Option<HttpVersion>,
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
            version: Some(value.version().try_into()?),
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum HttpVersion {
    Http09,
    Http10,
    Http11,
    Http2,
    Http3,
}

impl TryFrom<hyper::Version> for HttpVersion {
    type Error = eyre::Report;

    fn try_from(value: hyper::Version) -> Result<Self, Self::Error> {
        Ok(match value {
            hyper::Version::HTTP_09 => HttpVersion::Http09,
            hyper::Version::HTTP_10 => HttpVersion::Http10,
            hyper::Version::HTTP_11 => HttpVersion::Http11,
            hyper::Version::HTTP_2 => HttpVersion::Http2,
            hyper::Version::HTTP_3 => HttpVersion::Http3,
            other => eyre::bail!("Unknown http version {other:?}"),
        })
    }
}
