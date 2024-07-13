import styles from "./ResponseView.module.scss";
import { useState } from "react";
import { Tabs } from "@/components/elements/tabs/Tabs";
import { useResponse } from "@/hooks/useResponse";
import { RequestTrace, TraceEvent } from "@/types/requestTrace";
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

  const events = response.events;
  const lastResponse = events.findLast((e) => e.type === "Response");

  return (
    <>
      {requestError && <p> Error: {requestError}</p>}
      <div className={styles.responseHeader}>{status}</div>
      <Tabs
        values={ALL_RESPONSE_VIEWS}
        activeTab={responseView}
        standalone={false}
        setActiveTab={setResponseView}
        display={(v) => v.toUpperCase()}
      />

      <ResponseViewRenderer responseView={responseView} response={response} />
    </>
  );
};

interface ResponseViewRendererProps {
  responseView: ResponseViewPane;
  response: RequestTrace;
}

const ResponseViewRenderer = ({
  responseView,
  response,
}: ResponseViewRendererProps) => {
  if (responseView === "trace") {
    return <ResponseTraceView trace={response} />;
  }

  const lastResponse = response.events.findLast((e) => e.type === "Response");
  if (!lastResponse) {
    return <p>No response</p>;
  }

  switch (responseView) {
    case "raw":
      return <RawResponseView bodyString={lastResponse.bodyString} />;
    case "headers":
      return <ResponseHeadersView headers={lastResponse.headers} />;
    case "preview":
      return <PreviewResponseView bodyString={lastResponse.bodyString} />;
  }
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
        {trace.events.map((event) => (
          <RenderTraceEvent event={event} />
        ))}
      </code>
    </div>
  );
};

const RenderTraceEvent = ({ event }: { event: TraceEvent }) => {
  switch (event.type) {
    case "Request":
      return (
        <>
          {requestToLines(event).map((l) => (
            <p>{l}</p>
          ))}
          <br />
          <p>{"=======>"}</p>
          <br />
        </>
      );
    case "Response":
      return (
        <>
          {responseToLines(event).map((l) => (
            <p>{l}</p>
          ))}
          <br />
          <p>{"<======="}</p>
          <br />
        </>
      );
    case "Error":
      return (
        <>
          {event.errors.map((err) => (
            <p>
              {" * "}
              {err}
            </p>
          ))}
          <br />
        </>
      );
  }
};

function requestToLines(request: Request): string[] {
  const urlLine = `${request.method} ${request.url}`;
  const headerLines = request.headers.map(
    (h) => `HEADER::${h.name}: ${h.value}`
  );

  return [request.version, urlLine].concat(headerLines).map((s) => `> ${s}`);
}

function responseToLines(response: Response): string[] {
  return [`Response: ${response.status}`]
    .concat(response.headers.map((h) => `HEADER::${h.name}: ${h.value}`))
    .map((s) => `< ${s}`);
}
