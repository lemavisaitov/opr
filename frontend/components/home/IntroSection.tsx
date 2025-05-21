import Image from "next/image";
import bigLogo from "@/public/logoBig.svg";
import { Typography } from "@/components/Typography/Typography";
import { Divider } from "@/components/Divider";
import { JSX } from "react";

export default function IntroSection(): JSX.Element {
  return (
    <section className="max-w-3xl px-8">
      <div className="flex items-center justify-center gap-2">
        <Image src={bigLogo} alt="CyberSniffer logo" />
        <Typography.Title>CyberSniffer</Typography.Title>
      </div>
      <Typography.Text className="px-8 text-center mt-4">
        Analyse suspicious files, domains, IPs and URLs to detect malware and
        share them with the security community.
      </Typography.Text>
      <Divider className="bg-[#222121] w-full h-[1px] my-8" />
    </section>
  );
}
