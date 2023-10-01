import { ButtonHTMLAttributes, FC } from "react";
import styles from "./Button.module.scss";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

export type ButtonBaseProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonBase: FC<ButtonBaseProps> = ({
  className,
  ...props
}: ButtonBaseProps) => {
  return <button {...props} className={`${className} ${styles.buttonBase}`} />;
};

export const Button: FC<ButtonBaseProps> = ({ ...props }) => {
  return <ButtonBase {...props} />;
};

export type ButtonSize = "small" | "medium" | "large";

export type IconButtonProps = ButtonBaseProps & {
  iconProps: FontAwesomeIconProps;
  buttonSize: ButtonSize;
};

export const IconButton: FC<IconButtonProps> = ({
  iconProps,
  buttonSize,
  ...props
}: IconButtonProps) => {
  const size = styles[`iconButton-${buttonSize}`];

  return (
    <ButtonBase {...props} className={`${styles.iconButton} ${size}`}>
      <FontAwesomeIcon {...iconProps} />
    </ButtonBase>
  );
};
