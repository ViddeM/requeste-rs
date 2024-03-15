export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  OPTION = "OPTION",
  HEAD = "HEAD",
}

export interface Header {
  name: string;
  value: string;
}

export enum BodyTypes {
  Json = "Json",
  XML = "XML",
  Text = "Text",
}

export interface Request {
  url: string;
  method: Method;
  body: string;
  headers: Header[];
}
