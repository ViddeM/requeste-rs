use http::{HeaderName, HeaderValue};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Header {
    pub name: String,
    pub value: String,
}

impl TryFrom<(&HeaderName, &HeaderValue)> for Header {
    type Error = eyre::Report;

    fn try_from((name, value): (&HeaderName, &HeaderValue)) -> Result<Self, Self::Error> {
        Ok(Self {
            name: name.to_string(),
            value: value.to_str()?.to_string(),
        })
    }
}
