"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { invoke } from "@tauri-apps/api/tauri";
import { ResponseView } from "@/components/response/ResponseView";
import { Response } from "@/types/response";

enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  OPTION = "OPTION",
  HEAD = "HEAD",
}

const ALL_REQUEST_METHODS: Method[] = [
  Method.GET,
  Method.POST,
  Method.PUT,
  Method.DELETE,
  Method.OPTION,
  Method.HEAD,
];

export default function Home() {
  const [method, setMethod] = useState<Method>(Method.GET);
  const [url, setUrl] = useState<string>("");
  const [response, setResponse] = useState<Response | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  return (
    <main className={styles.main}>
      <div className={styles.menuBar}></div>
      <div className={styles.requestContainer}>
        <div className={styles.urlContainer}>
          <select
            value={method}
            className={`${styles.methodDropdown} ${
              styles[`methodDropdown${method}`]
            }`}
            onChange={(e) => {
              setMethod(e.target.value as Method);
            }}
          >
            {ALL_REQUEST_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <div className={styles.urlInputContainer}>
            <input
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              className={styles.urlInput}
            />
          </div>
          <button
            disabled={url.length === 0}
            className={styles.sendRequestButton}
            onClick={() => {
              invoke("send_request", {
                request: { url: url, method: method },
              })
                .then((resp) => {
                  setRequestError(null);
                  setResponse(resp as Response);
                })
                .catch((err) => {
                  setRequestError(`Failed to send request, err: ${err}`);
                });
            }}
          >
            SEND
          </button>
        </div>
        {requestError && <p>{requestError}</p>}
      </div>
      <div className={styles.responseContainer}>
        {response ? (
          <ResponseView response={response} />
        ) : (
          <div>Send a request!</div>
        )}
      </div>
    </main>
  );
}
