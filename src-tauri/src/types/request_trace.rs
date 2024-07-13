use serde::Serialize;

use super::{request::Request, response::Response};

#[derive(Serialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct RequestTrace {
    events: Vec<TraceEvent>,
}

impl RequestTrace {
    pub fn add_request(&mut self, event: Request) {
        self.events.push(TraceEvent::Request(event));
    }

    pub fn add_response(&mut self, event: Response) {
        self.events.push(TraceEvent::Response(event));
    }

    pub fn add_error(&mut self, err: eyre::Report) {
        self.events.push(TraceEvent::from(err))
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(tag = "type")]
pub enum TraceEvent {
    Request(Request),
    Response(Response),
    Error { errors: Vec<String> },
}

impl From<eyre::Report> for TraceEvent {
    fn from(value: eyre::Report) -> Self {
        Self::Error {
            errors: value.chain().map(|err| err.to_string()).collect(),
        }
    }
}
