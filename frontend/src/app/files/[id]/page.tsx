"use client";

import { JSX, useEffect, useState, useMemo } from "react";
import Image from "next/image";

import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CodeBlock } from "@/components/CodeBlock";
import { Typography } from "@/components/Typography/Typography";
import { Header } from "@/components/Header";

import bigLogo from "@/public/logoBig.svg";
import background from "@/public/background.png";
import happyDogImage from "@/public/happinesDog.svg";
import angryDogImage from "@/public/angryDog.svg";

import { useFileStore } from "@/stores/file.store";
import { useFileUpload } from "@/hooks/useFileUpload";
import { PredictionResponse } from "@/types/response.type";
import { NOTIFICATION_TEXT } from "@/constants/text.constant";
import { formatSize } from "@/utils/file.util";

/**
 * Verdict presets that are applied to the UI once the backend finishes analysing the file.
 * Add more layouts here if your model starts returning additional classes.
 */
const benignVerdict = {
  primaryColor: "#00FF1E",
  secondaryColor: "#377441",
  image: happyDogImage,
  verdictText: "Verdict: No malware has been detected, and the file is secure.",
};

const maliciousVerdict = {
  primaryColor: "#FF0000",
  secondaryColor: "#671111",
  image: angryDogImage,
  verdictText:
    "Verdict: Malware detected! The file is malicious and should be quarantined.",
};

/**
 * Dynamically maps model predictions to the correct UI palette.
 */
const getVerdict = (prediction: PredictionResponse["prediction"] | undefined) =>
  prediction === "malicious" ? maliciousVerdict : benignVerdict;

const Page = (): JSX.Element => {
  const { currentFile } = useFileStore();
  const { uploadFileToServer } = useFileUpload();
  const [reportAnalysis, setReportAnalysis] = useState<
    PredictionResponse | undefined
  >();

  /**
   * Upload the file & store the response once the user selects a new file.
   */
  const fetchReportAnalysis = async () => {
    if (!currentFile) return;
    try {
      const response = await uploadFileToServer(currentFile);
      setReportAnalysis(response.data);
    } catch (err) {
      console.log(err);
      setReportAnalysis(undefined);
    }
  };

  useEffect(() => {
    fetchReportAnalysis();
    // Only re‑run when the file changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFile]);

  const verdict = useMemo(
    () => getVerdict(reportAnalysis?.prediction),
    [reportAnalysis?.prediction]
  );

  /**
   * Fallback text while waiting for the backend so the screen does not appear empty.
   */
  const resultText = reportAnalysis
    ? verdict.verdictText +
      "\n" +
      `Name: ${currentFile?.name}` +
      "\n" +
      `Size: ${formatSize(currentFile?.size as number)}` +
      "\n" +
      `LastModified: ${new Date(currentFile?.lastModified as number)}`
    : "Analysing file … please wait.";

  return (
    <>
      <AnimatedBackground
        image={background}
        primaryColor={verdict.primaryColor}
        secondaryColor={verdict.secondaryColor}
      />
      <main className="flex items-end gap-16">
        <div className="overflow-y-hidden h-screen">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 my-8">
            <Image src={bigLogo} alt="CyberSniffer logo" />
            <Typography.Title className="font-medium">
              CyberSniffer
            </Typography.Title>
          </div>

          {/* Analysis blocks */}
          <ul className="max-w-2xl max-h-[800px] overflow-y-scroll none-scrollbar-width rounded-2xl [&>section]:mb-4">
            <CodeBlock>
              <CodeBlock.Header title="Result" className="rounded-t-2xl" />
              <CodeBlock.Content content={resultText} />
            </CodeBlock>

            <CodeBlock>
              <CodeBlock.Header title="Details" className="rounded-t-2xl" />
              <CodeBlock.Content
                content={
                  reportAnalysis
                    ? (reportAnalysis as object)
                    : "Waiting for analysis …"
                }
              />
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

        {/* Verdict visual */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src={verdict.image}
            alt={reportAnalysis?.prediction ?? "benign"}
            height={480}
            className={`
    ${reportAnalysis?.prediction === "malicious" && "transform translate-y-10"}
  `}
            width={480}
            priority
          />
          <Header className="bg-black/40 rounded-2xl h-min mb-2" />
        </div>
      </main>
    </>
  );
};

export default Page;
