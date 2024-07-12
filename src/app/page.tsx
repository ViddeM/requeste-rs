"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import { ResponseView } from "@/components/views/response/ResponseView";
import { RequestView } from "@/components/views/request/RequestView";
import { MenubarView } from "@/components/views/menubar/MenubarView";
import { RequestContext } from "@/hooks/useRequest";
import { ResponseContext, ResponseContextData } from "@/hooks/useResponse";
import { invoke } from "@tauri-apps/api";
import { Header, Method, Request } from "@/types/request";
import { RequestTrace } from "@/types/requestTrace";

export default function Home() {
  const [requestId, setRequestId] = useState<string>("");
  const [requests, setRequests] = useState<Request[]>([]);

  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<Method>(Method.GET);
  const [body, setBody] = useState<string>("");
  const [headers, setHeaders] = useState<Header[]>([]);
  const [response, setResponse] = useState<RequestTrace | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);

  const requestInfo: Request = {
    id: requestId,
    url: url,
    method: method,
    body: body,
    headers: headers,
  };

  const responseContext = {
    response: response,
    requestError: requestError,
    awaitingResponse: awaitingResponse,
    setResponse: setResponse,
    setRequestError: setRequestError,
    setAwaitingResponse: setAwaitingResponse,
  };

  return (
    <RequestContext.Provider
      value={{
        request: requestInfo,
        setUrl: setUrl,
        setMethod: setMethod,
        setBody: setBody,
        setHeaders: setHeaders,
        sendRequest: () => sendRequest(requestInfo, responseContext),
      }}
    >
      <ResponseContext.Provider value={responseContext}>
        <main className={styles.main}>
          <MenubarView />
          <RequestView />
          <ResponseView />
        </main>
      </ResponseContext.Provider>
    </RequestContext.Provider>
  );
}

async function sendRequest(
  request: Request,
  { setAwaitingResponse, setResponse, setRequestError }: ResponseContextData
) {
  setAwaitingResponse(true);
  invoke("send_request", {
    request: {
      url: request.url,
      method: request.method,
      body: request.body,
      headers: request.headers.filter((h) => h.name !== ""),
    },
  })
    .then((resp) => {
      console.log("Success resp", resp);
      setRequestError(null);
      setResponse(resp as RequestTrace);
    })
    .catch((err) => {
      console.log("Error resp", err);
      setRequestError(`Failed to send request, err: ${err}`);
    })
    .finally(() => {
      setAwaitingResponse(false);
    });
}
