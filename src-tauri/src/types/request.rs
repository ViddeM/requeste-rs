use serde::{Deserialize, Serialize};

use super::{header::Header, method::Method};

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Request {
    pub url: String,
    pub method: Method,
    pub body: String,
    pub headers: Vec<Header>,
}

impl TryFrom<reqwest::Request> for Request {
    type Error = String;

    fn try_from(value: reqwest::Request) -> Result<Self, Self::Error> {
        let headers = value
            .headers()
            .iter()
            .map(|h| h.try_into())
            .collect::<Result<Vec<Header>, Self::Error>>()?;
        let body = match value.body() {
            Some(s) => {
                let bytes = s.as_bytes().ok_or("Failed to read bytes from body")?;
                String::from_utf8(bytes.to_vec())
                    .map_err(|err| format!("Failed to map body to utf8, err: {err:?}"))?
            }
            None => "".to_string(),
        };

        Ok(Self {
            url: value.url().to_string(),
            method: value.method().clone().into(),
            body,
            headers,
        })
    }
}
