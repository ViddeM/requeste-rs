import { Dropdown } from "@/components/elements/dropdown/Dropdown";
import { TextArea } from "@/components/elements/input/TextArea";
import { BodyTypes } from "@/types/request";
import styles from "./RequestBodyView.module.scss";
import { Key, useState } from "react";
import { Button } from "@/components/elements/button/Button";

const ALL_BODY_TYPES: BodyTypes[] = [
  BodyTypes.Json,
  BodyTypes.XML,
  BodyTypes.Text,
];

export const RequestBodyView = () => {
  const [json, setJson] = useState<string>("");
  const rowCount = json.split("\n").length;

  return (
    <div className={styles.requestBodyViewContainer}>
      <Dropdown
        options={ALL_BODY_TYPES.map((t) => {
          return {
            display: t,
            value: t,
          };
        })}
      />
      <div className={styles.editorContainer}>
        <div className={styles.codeLinesContainer}>
          {Array.from(Array(rowCount).keys()).map((n) => (
            <p key={n as Key}>{`${n + 1}: `}</p>
          ))}
        </div>
        <div className={styles.divider} />
        <TextArea
          className={styles.codeTextArea}
          value={json}
          rows={1}
          onChange={(e) => setJson(e.target.value)}
        />
      </div>
      <Button onClick={() => setJson(formatJson(json))}>Format JSON</Button>
    </div>
  );
};

function formatJson(json: string): string {
  let jsonObj = null;
  try {
    jsonObj = JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse json, error:", error);
  }

  if (jsonObj === null) {
    return "";
  }

  return JSON.stringify(jsonObj, undefined, 2);
}
