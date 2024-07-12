import React, { useContext } from "react";
import { Request } from "../types/request";

export interface RequestsContextBaseData {
  currentRequestId: string | null;
  setCurrentRequestId: (id: string | null) => void;
  requests: Request[];
  setRequests: (requests: Request[]) => void;
}

export const RequestContext = React.createContext<RequestsContextBaseData>({
  currentRequestId: null,
  setCurrentRequestId: () => {
    console.error(
      "setCurrentRequestId called default function, this should not happen"
    );
  },
  requests: [],
  setRequests: (requests: Request[]) => {
    console.error(
      "setRequests called default function, this should not happen"
    );
  },
});

export interface RequestContextData {
  requests: Request[];
  updateRequest: (id: string, request: Request) => void;
  getCurrentRequest: () => Request | null;
  setRequestId: (id: string | null) => void;
}

export const useRequests = (): RequestContextData => {
  const ctx = useContext(RequestContext);

  return {
    requests: ctx.requests,
    updateRequest: (id, request) => {
      ctx.setRequests(
        ctx.requests.map((r) => {
          if (r.id === id) {
            return request;
          } else {
            return r;
          }
        })
      );
    },
    getCurrentRequest: () => {
      if (!ctx.currentRequestId) {
        return null;
      }

      return ctx.requests.filter((r) => r.id === ctx.currentRequestId)[0];
    },
    setRequestId: (id) => ctx.setCurrentRequestId(id),
  };
};
