import { ReactNode } from "react";

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

type TitleProps = TypographyProps & {
  level?: 1 | 2 | 3 | 4;
  className?: string;
};

type TextProps = {
  className?: string;
  children: ReactNode;
};

export { type TypographyProps, type TitleProps, type TextProps };
