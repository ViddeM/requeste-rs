import { Button, IconButton } from "@/components/elements/button/Button";
import { TextField } from "@/components/elements/input/TextField";
import { Key } from "react";
import styles from "./RequestHeadersView.module.scss";
import { Header } from "@/types/request";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { useRequest } from "@/hooks/useRequest";

export const RequestHeadersView = () => {
  const { request, setHeaders } = useRequest();
  const { headers } = request;

  const updateHeaders = (newObj: Header, index: number) => {
    setHeaders(
      headers.map((h, i) => {
        if (i === index) {
          return newObj;
        } else {
          return h;
        }
      })
    );
  };

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
        {headers.map(({ name, value }: Header, index) => (
          <tr key={index as Key}>
            <td>
              <TextField
                value={name}
                placeholder="Name"
                list={HEADER_NAME_DATALIST_ID}
                onChange={(e) => {
                  const newName = e.target.value;
                  updateHeaders(
                    {
                      name: newName,
                      value: value,
                    },
                    index
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
                  updateHeaders(
                    {
                      name: name,
                      value: newValue,
                    },
                    index
                  );
                }}
              />
            </td>
            <td>
              <IconButton
                onClick={() =>
                  setHeaders(headers.filter((h, i) => index !== i))
                }
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
