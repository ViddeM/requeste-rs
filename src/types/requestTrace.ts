import { Request } from "./request";
import { Response } from "./response";

export interface RequestTrace {
  request: Request;
  response: Response;
}
