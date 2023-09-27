import { Response } from "@/types/response";
import styles from "./ResponseView.module.css";
import { useState } from "react";

type ResponseViewPane = "raw" | "preview";
const ALL_RESPONSE_VIEWS: ResponseViewPane[] = ["raw", "preview", "headers"];

export const ResponseView = ({ response }: { response: Response }) => {
  const [responseView, setResponseView] = useState<ResponseViewPane>("raw");

  return (
    <div className={styles.responseViewContainer}>
      <div className={styles.responseHeader}>{response.status}</div>
      <div className={styles.responseTabs}>
        {ALL_RESPONSE_VIEWS.map((view) => (
          <button
            className={`${styles.responseTab} ${
              responseView === view ? styles.activeTab : ""
            }`}
            disabled={responseView === view}
            onClick={() => setResponseView(view)}
          >
            {view.toUpperCase()}
          </button>
        ))}
      </div>

      {responseView === "raw" ? (
        <div className={styles.codeBlock}>
          <code>{response?.bodyString}</code>
        </div>
      ) : responseView === "preview" ? (
        <iframe srcDoc={response?.bodyString} className={styles.preview} />
      ) : (
        <table className={styles.headersTable}>
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(response.headers).map(([key, val]) => (
              <tr>
                <td align="left">{key}:</td>
                <td align="left">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
