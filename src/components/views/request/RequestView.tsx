import { Key, useState } from "react";
import styles from "./RequestView.module.scss";
import { invoke } from "@tauri-apps/api";
import { Response } from "@/types/response";
import { Tabs } from "@/components/elements/tabs/Tabs";
import { Button, IconButton } from "@/components/elements/button/Button";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { TextField } from "@/components/elements/input/TextField";

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

const UrlView = ({
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

type RequestViewPane = "body" | "headers";
const ALL_REQUEST_VIEWS: RequestViewPane[] = ["body", "headers"];

type ContentViewProps = {} & RequestHeadersProps;

const ContentView = ({ ...props }: ContentViewProps) => {
  const [requestView, setRequestView] = useState<RequestViewPane>("body");

  return (
    <div>
      <Tabs
        values={ALL_REQUEST_VIEWS}
        activeTab={requestView}
        setActiveTab={setRequestView}
        display={(v) => v.toUpperCase()}
      />
      {requestView === "body" ? (
        <div>NOT IMPLEMENTED</div>
      ) : (
        <RequestHeadersView {...props} />
      )}
    </div>
  );
};

interface Header {
  id: number;
  name: string;
  value: string;
}

type RequestHeadersProps = {
  headers: Header[];
  setHeaders: (header: Header[]) => void;
};

const RequestHeadersView = ({ headers, setHeaders }: RequestHeadersProps) => {
  return (
    <table className={styles.requestHeadersTable}>
      <thead>
        <tr>
          <th colSpan={3} align="left">
            <Button
              onClick={() =>
                setHeaders([
                  ...headers,
                  {
                    name: "",
                    value: "",
                    id:
                      headers.reduce((acc, curr) => {
                        if (curr.id > acc) {
                          return curr.id;
                        } else {
                          return acc;
                        }
                      }, 0) + 1,
                  },
                ])
              }
            >
              Add row
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {headers.map(({ name, value, id }: Header) => (
          <tr key={name as Key}>
            <td>
              <TextField
                value={name}
                placeholder="Name"
                list={HEADER_NAME_DATALIST_ID}
                onChange={(e) => {
                  const newName = e.target.value;
                  setHeaders(
                    headers.map((h) => {
                      if (h.id === id) {
                        return {
                          id: id,
                          name: newName,
                          value: value,
                        };
                      } else {
                        return h;
                      }
                    })
                  );
                }}
              />

              <datalist id={HEADER_NAME_DATALIST_ID}>
                {EXAMPLE_HEADER_NAMES.map((n) => (
                  <option key={n as Key}>{n}</option>
                ))}
              </datalist>
            </td>
            <td>
              <TextField
                value={value}
                placeholder="Value"
                onChange={(e) => {
                  const newValue = e.target.value;
                  setHeaders(
                    headers.map((h) => {
                      if (h.id === id) {
                        return {
                          id: id,
                          name: name,
                          value: newValue,
                        };
                      } else {
                        return h;
                      }
                    })
                  );
                }}
              />
            </td>
            <td>
              <IconButton
                onClick={() => setHeaders(headers.filter((h) => h.id !== id))}
                buttonSize="small"
                iconProps={{ icon: faX }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const HEADER_NAME_DATALIST_ID = "header-names-datalist";

const EXAMPLE_HEADER_NAMES: string[] = [
  "Authorization",
  "Content-Type",
  "Accept",
  "User-Agent",
];
