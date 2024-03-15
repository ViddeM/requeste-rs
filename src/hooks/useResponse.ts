import React from "react";
import { useContext } from "react";
import { RequestTrace } from "@/types/requestTrace";

export interface ResponseContextData {
  response: RequestTrace | null;
  requestError: string | null;
  awaitingResponse: boolean;
  setResponse: (resp: RequestTrace | null) => void;
  setRequestError: (error: string | null) => void;
  setAwaitingResponse: (awaiting: boolean) => void;
}

export const ResponseContext = React.createContext<ResponseContextData>({
  response: null,
  requestError: null,
  awaitingResponse: false,
  setResponse: () => {
    console.error("setResponse called default function!");
  },
  setRequestError: () => {
    console.error("setRequestError called default function!");
  },
  setAwaitingResponse: () => {
    console.error("setAwaitingResponse called default function!");
  },
});

export const useResponse = (): ResponseContextData => {
  const ctx = useContext(ResponseContext);
  return { ...ctx };
};
