use hyper::body::Incoming;
use serde::Serialize;

use super::header::Header;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Response {
    pub status: u16,
    pub headers: Vec<Header>,
    pub body_string: String,
}

impl Response {
    pub fn base_from_response(response: &hyper::Response<Incoming>) -> eyre::Result<Self> {
        Ok(Self {
            status: response.status().as_u16(),
            headers: response
                .headers()
                .iter()
                .map(|h| h.try_into())
                .collect::<eyre::Result<Vec<Header>>>()?,
            body_string: String::new(),
        })
    }

    pub fn with_body(&mut self, body: String) {
        self.body_string = body;
    }
}
