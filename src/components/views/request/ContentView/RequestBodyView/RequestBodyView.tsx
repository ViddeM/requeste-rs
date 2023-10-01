import { Dropdown } from "@/components/elements/dropdown/Dropdown";
import { TextArea } from "@/components/elements/input/TextArea";
import { BodyTypes } from "@/types/request";
import styles from "./RequestBodyView.module.scss";

const ALL_BODY_TYPES: BodyTypes[] = [
  BodyTypes.Json,
  BodyTypes.XML,
  BodyTypes.Text,
];

export const RequestBodyView = () => {
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
      <TextArea />
    </div>
  );
};
