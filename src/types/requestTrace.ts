import { Request } from "./request";
import { Response } from "./response";

export interface RequestTrace {
  events: TraceEvent[];
}

export type TraceEvent =
  | ({ type: "Request" } & Request)
  | ({ type: "Response" } & Response)
  | { type: "Error"; errors: string[] };
