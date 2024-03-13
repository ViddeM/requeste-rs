import { useState } from "react";
import styles from "./UrlView.module.scss";
import { Method } from "@/types/request";
import { DropdownBase } from "@/components/elements/dropdown/Dropdown";
import { Button, ButtonBase } from "@/components/elements/button/Button";
import {
  TextField,
  TextFieldBase,
} from "@/components/elements/input/TextField";

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
      <DropdownBase
        value={method}
        className={`${styles.methodDropdown} ${
          styles[`methodDropdown${method}`]
        }`}
        options={ALL_REQUEST_METHODS.map((m) => {
          return {
            display: m,
            value: m,
          };
        })}
        onChange={(e) => {
          setMethod(e.target.value as Method);
        }}
      />
      {/* <div className={styles.urlInputContainer}> */}
      <TextFieldBase
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        className={styles.urlInput}
      />
      {/* </div> */}
      <ButtonBase
        disabled={url.length === 0}
        className={styles.sendRequestButton}
        onClick={() => sendRequest(url, method)}
      >
        SEND
      </ButtonBase>
    </div>
  );
};
