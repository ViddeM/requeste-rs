import styles from "./RequestView.module.scss";
import { UrlView } from "./UrlView/UrlView";
import { ContentView } from "./ContentView/ContentView";

export const RequestView = () => {
  return (
    <div className={styles.requestContainer}>
      <UrlView />
      <ContentView />
    </div>
  );
};
