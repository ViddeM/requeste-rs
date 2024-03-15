use serde::Serialize;

use super::header::Header;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Response {
    pub status: u16,
    pub headers: Vec<Header>,
    pub body_string: String,
}
