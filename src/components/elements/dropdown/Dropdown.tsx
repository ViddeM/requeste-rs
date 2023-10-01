import { FC, SelectHTMLAttributes } from "react";
import styles from "./Dropdown.module.scss";

export interface Option {
  display: string;
  value: string;
}

export type DropdownBaseProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
};

export const DropdownBase: FC<DropdownBaseProps> = ({ options, ...props }) => {
  return (
    <select {...props}>
      {options.map((o) => (
        <DropdownOption option={o} />
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
