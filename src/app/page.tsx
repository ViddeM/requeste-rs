"use client";

import { useState } from "react";
import styles from "./page.module.css";

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

  return (
    <main className={styles.main}>
      <div className={styles.menuBar}></div>
      <div className={styles.line} />
      <div className={styles.container}>
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
                console.log(`SENDING ${method} REQUEST TO ${url}`);
              }}
            >
              SEND
            </button>
          </div>
        </div>
        <div className={styles.line} />
        <div className={styles.responseContainer}>{response?.status}</div>
      </div>
    </main>
  );
}
