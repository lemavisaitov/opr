import { JSX, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { TextProps, TitleProps, TypographyProps } from "./Typography.types";
import titleStyles from "./Typography.constants";

const Text = ({ children, className }: TextProps): JSX.Element => {
  return <p className={twMerge("leading-7", className)}>{children}</p>;
};

const Muted = ({ children, className }: TextProps): JSX.Element => {
  return (
    <p className={twMerge("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
};

const Title = ({
  children,
  level = 1,
  className = "",
}: TitleProps): ReactNode => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag className={twMerge(titleStyles[level], className)}>
      {children}
    </HeadingTag>
  );
};

export const Typography = ({
  children,
  className,
}: TypographyProps): ReactNode => {
  return <div className={className}>{children}</div>;
};

Typography.Text = Text;
Typography.Title = Title;
Typography.Muted = Muted;
