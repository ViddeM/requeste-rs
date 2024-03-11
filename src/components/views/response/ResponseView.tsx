import { Response } from "@/types/response";
import styles from "./ResponseView.module.scss";
import { useState } from "react";
import { Tabs } from "@/components/elements/tabs/Tabs";

type ResponseViewPane = "raw" | "preview" | "headers";
const ALL_RESPONSE_VIEWS: ResponseViewPane[] = ["raw", "preview", "headers"];

interface ResponseViewProps {
  response: Response | null;
  requestError: string | null;
}

export const ResponseView = ({ response, requestError }: ResponseViewProps) => {
  const [responseView, setResponseView] = useState<ResponseViewPane>("raw");

  if (!response) {
    return <p>Send a request!</p>;
  }

  return (
    <div className={styles.responseContainer}>
      <div className={styles.responseViewContainer}>
        {requestError && <p> Error: {requestError}</p>}
        <div className={styles.responseHeader}>{response.status}</div>
        <Tabs
          values={ALL_RESPONSE_VIEWS}
          activeTab={responseView}
          setActiveTab={setResponseView}
          display={(v) => v.toUpperCase()}
        />

        {responseView === "raw" ? (
          <RawResponseView bodyString={response.bodyString} />
        ) : responseView === "preview" ? (
          <PreviewResponseView bodyString={response.bodyString} />
        ) : (
          <ResponseHeadersView headers={response.headers} />
        )}
      </div>
    </div>
  );
};

interface DisplayResponseViewProps {
  bodyString: string;
}

const RawResponseView = ({ bodyString }: DisplayResponseViewProps) => {
  return (
    <div className={styles.codeBlock}>
      <code>{bodyString}</code>
    </div>
  );
};

const PreviewResponseView = ({ bodyString }: DisplayResponseViewProps) => {
  return <iframe srcDoc={bodyString} className={styles.preview} />;
};

interface ResponseHeadersViewProps {
  headers: Object;
}

const ResponseHeadersView = ({ headers }: ResponseHeadersViewProps) => {
  return (
    <table className={styles.headersTable}>
      <thead>
        <tr>
          <th align="left">Name</th>
          <th align="left">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(headers).map(([key, val]) => (
          <tr key={key}>
            <td align="left">{key}:</td>
            <td align="left">{val}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
