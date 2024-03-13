"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import { ResponseView } from "@/components/views/response/ResponseView";
import { Response } from "@/types/response";
import { RequestView } from "@/components/views/request/RequestView";
import { MenubarView } from "@/components/views/menubar/MenubarView";
import { RequestContext, RequestInfo } from "@/hooks/useRequest";
import { ResponseContext } from "@/hooks/useResponse";

export default function Home() {
  const [response, setResponse] = useState<Response | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [request, setRequest] = useState<RequestInfo | null>(null);
  const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);

  return (
    <RequestContext.Provider
      value={{
        request: request,
        setRequest: setRequest,
      }}
    >
      <ResponseContext.Provider
        value={{
          response: response,
          requestError: requestError,
          awaitingResponse: awaitingResponse,
          setResponse: setResponse,
          setRequestError: setRequestError,
          setAwaitingResponse: setAwaitingResponse,
        }}
      >
        <main className={styles.main}>
          <MenubarView />
          <RequestView />
          <ResponseView />
        </main>
      </ResponseContext.Provider>
    </RequestContext.Provider>
  );
}
