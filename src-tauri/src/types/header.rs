use reqwest::header::{HeaderName, HeaderValue};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Header {
    pub name: String,
    pub value: String,
}

impl TryInto<Header> for (&HeaderName, &HeaderValue) {
    type Error = String;

    fn try_into(self) -> Result<Header, Self::Error> {
        let (name, val) = self;
        let value = val
            .to_str()
            .map_err(|err| format!("Failed to convert header value to string, err: {err:?}"))?;

        Ok(Header {
            name: name.to_string(),
            value: value.to_string(),
        })
    }
}
