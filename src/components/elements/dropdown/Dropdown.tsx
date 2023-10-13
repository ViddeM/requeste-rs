import { FC, Key, SelectHTMLAttributes } from "react";
import styles from "./Dropdown.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

export interface Option {
  display: string;
  value: string;
}

export type DropdownBaseProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
};

export const DropdownBase: FC<DropdownBaseProps> = ({
  options,
  className,
  ...props
}) => {
  const style = `${className} ${styles.dropdownBase}`;

  return (
    <select {...props} className={style}>
      {options.map((o) => (
        <DropdownOption key={o.value as Key} option={o} />
      ))}
    </select>
  );
};

export type DropdownProps = DropdownBaseProps;

export const Dropdown: FC<DropdownProps> = ({ ...props }) => {
  return <DropdownBase {...props} />;
};

interface DropdownOptionProps {
  option: Option;
}

const DropdownOption = ({ option }: DropdownOptionProps) => {
  return <option value={option.value}>{option.display}</option>;
};
