import React, { useContext } from "react";

export interface RequestContextData {
  request: RequestInfo | null;
  setRequest: (request: RequestInfo | null) => void;
}

export interface RequestInfo {
  url: string;
}

export const RequestContext = React.createContext<RequestContextData>({
  request: null,
  setRequest: () => {
    console.error(
      "Set request called default function, this should not happend"
    );
  },
});

export const useRequest = (): RequestContextData => {
  const ctx = useContext(RequestContext);
  return ctx;
};
