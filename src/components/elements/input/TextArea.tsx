import { FC, TextareaHTMLAttributes } from "react";

export type TextAreaBaseProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaBase: FC<TextAreaBaseProps> = ({
  className,
  ...props
}: TextAreaBaseProps) => {
  return <textarea {...props} className={`${className}`} />;
};

export type TextAreaProps = TextAreaBaseProps;

export const TextArea: FC<TextAreaProps> = ({ ...props }: TextAreaProps) => {
  return <TextAreaBase {...props} />;
};
