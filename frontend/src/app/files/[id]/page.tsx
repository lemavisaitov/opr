import { JSX } from "react";
import Image from "next/image";

import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CodeBlock } from "@/components/CodeBlock";
import { Typography } from "@/components/Typography/Typography";
import { Header } from "@/components/Header";

import bigLogo from "@/public/logoBig.svg";
import background from "@/public/background.png";
import happyDogImage from "@/public/happinesDog.svg";

interface PageProps {
  params: {
    id: string;
  };
}

const json = {
  confidence: {
    benign: 1.0,
    malicious: 3.2593730599555017e-28,
  },
  explanation:
    "The file was classified as BENIGN. Top features that influenced this decision: - file_size = 9.98e+06, z-score = 33.83 (very high impact) - ...",
  influential_features: [
    {
      name: "max_section_size",
      value: 7531520.0,
      z_score: 46.93646855943499,
    },
    {
      name: "file_size",
      value: 9979768.0,
      z_score: 33.83163381393169,
    },
    {
      name: "avg_section_size",
      value: 906240.0,
      z_score: 14.83927978209799,
    },
  ],
};

const plainText = `Verdict: No malware has been detected, and the file is secure.\n filename: Example.exe Size: 492 B\n Type: file`;
const NOTIFICATION_TEXT =
  "Please remember that my answers may contain errors or inaccuracies. I try to provide useful and relevant information, but it is always recommended to double-check important data with reliable sources or experts. If something seems doubtful to you, let's clarify it together!";
const Page = async ({}: PageProps): Promise<JSX.Element> => {
  return (
    <>
      <AnimatedBackground image={background} />
      <main className="flex items-end gap-16">
        <div className="overflow-y-hidden h-screen">
          <div className="flex items-center justify-center gap-2 my-8">
            <Image src={bigLogo} alt="CyberSniffer logo" />
            <Typography.Title className="font-medium">
              CyberSniffer
            </Typography.Title>
          </div>
          <ul className="max-w-2xl max-h-[800px] overflow-y-scroll none-scrollbar-width rounded-2xl [&>section]:mb-4">
            <CodeBlock>
              <CodeBlock.Header title="Result" className="rounded-t-2xl" />
              <CodeBlock.Content content={plainText} />
            </CodeBlock>
            <CodeBlock>
              <CodeBlock.Header title="Details" className="rounded-t-2xl" />
              <CodeBlock.Content content={json} />
            </CodeBlock>
            <CodeBlock>
              <CodeBlock.Header
                title="Notification"
                className="rounded-t-2xl"
              />
              <CodeBlock.Content content={NOTIFICATION_TEXT} />
            </CodeBlock>
          </ul>
        </div>
        <div>
          <Image src={happyDogImage} alt="happy dog" height={480} width={480} />
          <Header className="bg-black/40 rounded-2xl h-min mb-2" />
        </div>
      </main>
    </>
  );
};
export default Page;
