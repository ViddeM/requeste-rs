import { Key } from "react";
import styles from "./Tabs.module.scss";
import { ButtonBase } from "../button/Button";

export interface TabsProps<T> {
  values: T[];
  activeTab: T;
  standalone: boolean;
  setActiveTab: (tab: T) => void;
  display: (tab: T) => string;
}

export const Tabs = <T,>({
  values,
  activeTab,
  standalone,
  setActiveTab,
  display,
}: TabsProps<T>) => {
  return (
    <div className={styles.tabsContainer}>
      {values.map((v) => (
        <ButtonBase
          className={`${styles.tab} ${standalone ? styles.outerTabs : ""}`}
          disabled={v === activeTab}
          onClick={() => setActiveTab(v)}
          key={v as Key}
        >
          {display(v)}
        </ButtonBase>
      ))}
    </div>
  );
};
