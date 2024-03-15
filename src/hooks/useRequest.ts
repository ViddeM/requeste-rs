import React, { useContext } from "react";
import { Header, Method, Request } from "@/types/request";

export interface RequestContextData {
  request: Request;
  setUrl: (url: string) => void;
  setMethod: (method: Method) => void;
  setBody: (body: string) => void;
  setHeaders: (headers: Header[]) => void;
  sendRequest: () => void;
}

export const RequestContext = React.createContext<RequestContextData>({
  request: {
    url: "",
    method: Method.GET,
    headers: [],
    body: "",
  },
  setUrl: () => {
    console.error("setUrl called default function, this should not happend");
  },
  setMethod: () => {
    console.error("setMethod called default function, this should not happend");
  },
  setBody: () => {
    console.error("setBody called default function, this should not happend");
  },
  setHeaders: () => {
    console.error(
      "setHeaders called default function, this should not happend"
    );
  },
  sendRequest: () => {
    console.error("Send request called default function!");
  },
});

export const useRequest = (): RequestContextData => {
  const ctx = useContext(RequestContext);
  return ctx;
};
