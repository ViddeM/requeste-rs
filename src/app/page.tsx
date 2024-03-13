"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import { ResponseView } from "@/components/views/response/ResponseView";
import { Response } from "@/types/response";
import { RequestView } from "@/components/views/request/RequestView";
import { MenubarView } from "@/components/views/menubar/MenubarView";
import { RequestContext, RequestInfo } from "@/hooks/useRequest";
import { ResponseContext, ResponseContextData } from "@/hooks/useResponse";
import { invoke } from "@tauri-apps/api";
import { Header, Method } from "@/types/request";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<Method>(Method.GET);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [response, setResponse] = useState<Response | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);

  const requestInfo = {
    url: url,
    method: method,
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
  request: RequestInfo,
  { setAwaitingResponse, setResponse, setRequestError }: ResponseContextData
) {
  setAwaitingResponse(true);
  invoke("send_request", {
    request: {
      url: request.url,
      method: request.method,
      headers: request.headers.filter((h) => h.name !== ""),
    },
  })
    .then((resp) => {
      console.log("Success resp", resp);
      setRequestError(null);
      setResponse(resp as Response);
    })
    .catch((err) => {
      console.log("Error resp", err);
      setRequestError(`Failed to send request, err: ${err}`);
    })
    .finally(() => {
      setAwaitingResponse(false);
    });
}
