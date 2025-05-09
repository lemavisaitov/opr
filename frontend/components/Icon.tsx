import Link from "next/link";
import { Url } from "url";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface IconProps {
  href: Url | string;
  src: string | StaticImport;
  alt: string;
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
}

const Icon = ({ href, src, alt, width, height }: IconProps) => {
  return (
    <Link href={href}>
      <Image src={src} alt={alt} width={width} height={height} />
    </Link>
  );
};

export default Icon;
