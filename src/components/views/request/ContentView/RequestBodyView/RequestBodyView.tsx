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
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);
  const rowCount = json.split("\n").length;

  return (
    <div className={styles.requestBodyViewContainer}>
      <div className={styles.requestBodyButtonGroup}>
        <Dropdown
          options={ALL_BODY_TYPES.map((t) => {
            return {
              display: t,
              value: t,
            };
          })}
          className={styles.bodyTypeDropdown}
        />
        <Button
          className={styles.formatCodeButton}
          onClick={() => setJson(formatJson(json, setJsonParseError))}
        >
          Format JSON
        </Button>
      </div>
      {jsonParseError && (
        <p className={styles.jsonParseError}>FAILED TO PARSE JSON!</p>
      )}
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
    </div>
  );
};

function formatJson(
  json: string,
  setError: (error: string | null) => void
): string {
  // Because Mac is fucked and replaces all " with “ ” (start/end of quotes) and the JSON.parse method doesn't know what to do with those...
  let jsonToParse = json.replaceAll("“", '"').replaceAll("”", '"');

  let jsonObj = null;
  try {
    jsonObj = JSON.parse(jsonToParse);
  } catch (error) {
    console.error("Failed to parse json, error:", error);
    setError("Failed to parse json");
    return json;
  }

  setError(null);

  if (jsonObj === null) {
    return "";
  }

  return JSON.stringify(jsonObj, undefined, 2);
}
