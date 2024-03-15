import React, { useContext } from "react";
import { ResponseContextData } from "./useResponse";
import { Header, Method } from "@/types/request";

export interface RequestContextData {
  request: RequestInfo;
  setUrl: (url: string) => void;
  setMethod: (method: Method) => void;
  setHeaders: (headers: Header[]) => void;
  sendRequest: () => void;
}

export interface RequestInfo {
  url: string;
  method: Method;
  headers: Header[];
}

export const RequestContext = React.createContext<RequestContextData>({
  request: {
    url: "",
    method: Method.GET,
    headers: [],
  },
  setUrl: () => {
    console.error("setUrl called default function, this should not happend");
  },
  setMethod: () => {
    console.error("setMethod called default function, this should not happend");
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
