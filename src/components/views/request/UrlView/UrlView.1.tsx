import { useState } from "react";
import styles from "./UrlView.module.scss";
import { Method } from "@/types/request";

const ALL_REQUEST_METHODS: Method[] = [
  Method.GET,
  Method.POST,
  Method.PUT,
  Method.DELETE,
  Method.OPTION,
  Method.HEAD,
];

export const UrlView = ({
  sendRequest,
}: {
  sendRequest: (url: string, method: Method) => void;
}) => {
  const [method, setMethod] = useState<Method>(Method.GET);
  const [url, setUrl] = useState<string>("");

  return (
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
        onClick={() => sendRequest(url, method)}
      >
        SEND
      </button>
    </div>
  );
};
