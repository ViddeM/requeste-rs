import { Key } from "react";
import styles from "./Tabs.module.scss";

export interface TabsProps<T> {
  values: T[];
  activeTab: T;
  setActiveTab: (tab: T) => void;
  display: (tab: T) => string;
}

export const Tabs = <T,>({
  values,
  activeTab,
  setActiveTab,
  display,
}: TabsProps<T>) => {
  return (
    <div className={styles.tabsContainer}>
      {values.map((v) => (
        <button
          className={styles.tab}
          disabled={v === activeTab}
          onClick={() => setActiveTab(v)}
          key={v as Key}
        >
          {display(v)}
        </button>
      ))}
    </div>
  );
};
