import { useState } from "react";
import styles from "./RequestView.module.scss";
import { invoke } from "@tauri-apps/api/tauri";
import { Response } from "@/types/response";
import { UrlView } from "./UrlView/UrlView";
import { Header, Method } from "@/types/request";
import { ContentView } from "./ContentView/ContentView";
import { useResponse } from "@/hooks/useResponse";

export const RequestView = () => {
  const { setResponse, setRequestError, setAwaitingResponse } = useResponse();
  const [headers, setHeaders] = useState<Header[]>([]);

  const sendRequest = (url: string, method: Method) => {
    setAwaitingResponse(true);
    invoke("send_request", {
      request: {
        url: url,
        method: method,
        headers: headers.filter((h) => h.name !== ""),
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
  };

  return (
    <div className={styles.requestContainer}>
      <UrlView sendRequest={sendRequest} />
      <ContentView headers={headers} setHeaders={setHeaders} />
    </div>
  );
};
