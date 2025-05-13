import {
  Avatar as AvatarWrapper,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { JSX } from "react";

interface AvatarProps {
  className?: string;
}

export const Avatar = ({ className }: AvatarProps): JSX.Element => {
  return (
    <AvatarWrapper className={className}>
      <AvatarImage width={36} height={36} src="" />
      <AvatarFallback>CN</AvatarFallback>
    </AvatarWrapper>
  );
};
