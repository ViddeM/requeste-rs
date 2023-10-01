import { FC, InputHTMLAttributes } from "react";
import styles from "./TextField.module.scss";

export type TextFieldBaseProps = InputHTMLAttributes<HTMLInputElement>;

export const TextFieldBase: FC<TextFieldBaseProps> = ({
  className,
  ...props
}: TextFieldBaseProps) => {
  return (
    <input
      {...props}
      type={"text"}
      className={`${className} ${styles.textFieldBase}`}
    />
  );
};

export type TextFieldProps = TextFieldBaseProps;

export const TextField: FC<TextFieldProps> = ({ ...props }: TextFieldProps) => {
  return <TextFieldBase {...props} />;
};
