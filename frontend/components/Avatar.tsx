import {
  Avatar as AvatarWrapper,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { JSX } from "react";

export const Avatar = (): JSX.Element => {
  return (
    <AvatarWrapper>
      <AvatarImage src="" />
      <AvatarFallback>CN</AvatarFallback>
    </AvatarWrapper>
  );
};
