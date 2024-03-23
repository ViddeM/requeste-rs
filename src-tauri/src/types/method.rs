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
    Patch,
}

impl From<Method> for String {
    fn from(value: Method) -> Self {
        match value {
            Method::Get => "GET",
            Method::Post => "POST",
            Method::Put => "PUT",
            Method::Delete => "DELETE",
            Method::Options => "OPTIONS",
            Method::Head => "HEAD",
            Method::Trace => "TRACE",
            Method::Patch => "PATCH",
        }
        .to_string()
    }
}

impl TryFrom<String> for Method {
    type Error = eyre::Report;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        Ok(match value.as_str() {
            "GET" => Method::Get,
            "POST" => Method::Post,
            "PUT" => Method::Put,
            "DELETE" => Method::Delete,
            "OPTIONS" => Method::Options,
            "HEAD" => Method::Head,
            "TRACE" => Method::Trace,
            "PATCH" => Method::Patch,
            method => eyre::bail!("Unsupported method {method}"),
        })
    }
}

impl TryFrom<http::Method> for Method {
    type Error = eyre::Report;

    fn try_from(value: http::Method) -> Result<Self, Self::Error> {
        value.to_string().try_into()
    }
}

impl From<Method> for http::Method {
    fn from(value: Method) -> Self {
        match value {
            Method::Get => http::Method::GET,
            Method::Post => http::Method::POST,
            Method::Put => http::Method::PUT,
            Method::Delete => http::Method::DELETE,
            Method::Options => http::Method::OPTIONS,
            Method::Head => http::Method::HEAD,
            Method::Trace => http::Method::TRACE,
            Method::Patch => http::Method::PATCH,
        }
    }
}
