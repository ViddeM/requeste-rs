use serde::Serialize;

use super::{request::Request, response::Response};

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RequestTrace {
    pub request: Request,
    pub response: Response,
}
