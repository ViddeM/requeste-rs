import { useState } from "react";
import styles from "./RequestView.module.scss";
import { invoke } from "@tauri-apps/api/tauri";
import { Response } from "@/types/response";
import { UrlView } from "./UrlView/UrlView";
import { Header, Method } from "@/types/request";
import { ContentView } from "./ContentView/ContentView";

interface RequestViewProps {
  setResponse: (response: Response) => void;
  setRequestError: (requestError: string | null) => void;
}

export const RequestView = ({
  setResponse,
  setRequestError,
}: RequestViewProps) => {
  const [headers, setHeaders] = useState<Header[]>([]);

  const sendRequest = (url: string, method: Method) => {
    console.log("SENDING REQUEST");
    invoke("send_request", {
      request: { url: url, method: method, headers: headers },
    })
      .then((resp) => {
        setRequestError(null);
        setResponse(resp as Response);
      })
      .catch((err) => {
        setRequestError(`Failed to send request, err: ${err}`);
      });
  };

  return (
    <div className={styles.requestContainer}>
      <UrlView sendRequest={sendRequest} />
      <ContentView headers={headers} setHeaders={setHeaders} />
    </div>
  );
};
