import { Header } from "./request";

export interface Response {
  status: number;
  headers: Header[];
  bodyString: string;
}
