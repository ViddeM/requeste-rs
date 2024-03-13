import styles from "./ResponseView.module.scss";
import { useState } from "react";
import { Tabs } from "@/components/elements/tabs/Tabs";
import { useResponse } from "@/hooks/useResponse";

type ResponseViewPane = "raw" | "preview" | "headers";
const ALL_RESPONSE_VIEWS: ResponseViewPane[] = ["raw", "preview", "headers"];

export const ResponseView = () => {
  return (
    <div className={styles.responseContainer}>
      <ResponseContent />
    </div>
  );
};

const ResponseContent = () => {
  const { requestError, response, awaitingResponse } = useResponse();
  const [responseView, setResponseView] = useState<ResponseViewPane>("raw");

  if (awaitingResponse) {
    return <p>waiting for response...</p>;
  }

  if (requestError) {
    return <p>{requestError}</p>;
  }

  if (!response) {
    return <p>Send a request!</p>;
  }

  return (
    <>
      {requestError && <p> Error: {requestError}</p>}
      <div className={styles.responseHeader}>{response.status}</div>
      <Tabs
        values={ALL_RESPONSE_VIEWS}
        activeTab={responseView}
        standalone={false}
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
    </>
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
