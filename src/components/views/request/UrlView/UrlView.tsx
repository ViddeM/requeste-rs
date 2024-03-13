import { useState } from "react";
import styles from "./UrlView.module.scss";
import { Method } from "@/types/request";
import { DropdownBase } from "@/components/elements/dropdown/Dropdown";
import { ButtonBase } from "@/components/elements/button/Button";
import { TextFieldBase } from "@/components/elements/input/TextField";
import { useRequest } from "@/hooks/useRequest";

const ALL_REQUEST_METHODS: Method[] = [
  Method.GET,
  Method.POST,
  Method.PUT,
  Method.DELETE,
  Method.OPTION,
  Method.HEAD,
];

export const UrlView = () => {
  const { sendRequest, request, setMethod, setUrl } = useRequest();
  const { url, method } = request;

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
      <TextFieldBase
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        className={styles.urlInput}
      />
      <ButtonBase
        disabled={url.length === 0}
        className={styles.sendRequestButton}
        onClick={() => sendRequest()}
      >
        SEND
      </ButtonBase>
    </div>
  );
};
