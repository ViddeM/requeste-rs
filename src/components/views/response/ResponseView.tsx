import styles from "./ResponseView.module.scss";
import { useState } from "react";
import { Tabs } from "@/components/elements/tabs/Tabs";
import { useResponse } from "@/hooks/useResponse";
import { RequestTrace } from "@/types/requestTrace";
import { Header, Request } from "@/types/request";
import { Response } from "@/types/response";

type ResponseViewPane = "raw" | "preview" | "headers" | "trace";
const ALL_RESPONSE_VIEWS: ResponseViewPane[] = [
  "raw",
  "preview",
  "headers",
  "trace",
];

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

  const resp = response.response;

  return (
    <>
      {requestError && <p> Error: {requestError}</p>}
      <div className={styles.responseHeader}>{resp.status}</div>
      <Tabs
        values={ALL_RESPONSE_VIEWS}
        activeTab={responseView}
        standalone={false}
        setActiveTab={setResponseView}
        display={(v) => v.toUpperCase()}
      />

      {responseView === "raw" ? (
        <RawResponseView bodyString={resp.bodyString} />
      ) : responseView === "preview" ? (
        <PreviewResponseView bodyString={resp.bodyString} />
      ) : responseView === "headers" ? (
        <ResponseHeadersView headers={resp.headers} />
      ) : (
        <ResponseTraceView trace={response} />
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
  headers: Header[];
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
        {headers.map((h) => (
          <tr key={h.name}>
            <td align="left">{h.name}:</td>
            <td align="left">{h.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface ResponseTraceViewProps {
  trace: RequestTrace;
}

const ResponseTraceView = ({ trace }: ResponseTraceViewProps) => {
  return (
    <div className={styles.codeBlock}>
      <code>
        {requestToLines(trace.request).map((l) => (
          <p>{l}</p>
        ))}
        <br />
        <p>{"<====>"}</p>
        <br />
        {responseToLines(trace.response).map((l) => (
          <p>{l}</p>
        ))}
      </code>
    </div>
  );
};

function requestToLines(request: Request): string[] {
  const urlLine = `${request.method} ${request.url}`;
  const headerLines = request.headers.map(
    (h) => `HEADER::${h.name}: ${h.value}`
  );

  return [urlLine].concat(headerLines).map((s) => `> ${s}`);
}

function responseToLines(response: Response): string[] {
  return [`Response: ${response.status}`]
    .concat(response.headers.map((h) => `HEADER::${h.name}: ${h.value}`))
    .map((s) => `< ${s}`);
}
