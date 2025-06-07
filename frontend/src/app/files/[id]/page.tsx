"use client";

import { JSX, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Typography } from "@/components/Typography/Typography";
import { Header } from "@/components/Header";
import bigLogo from "@/public/logoBig.svg";
import happyDogImage from "@/public/happinesDog.svg";
import angryDogImage from "@/public/angryDog.svg";
import { useFileStore } from "@/stores/file.store";
import { useFileUpload } from "@/hooks/useFileUpload";
import { PredictionResponse } from "@/types/response.type";
import { Button } from "@/components/ui/button";
import { ReportSection } from "@/components/ReportSection";
import sniffingDog from "@/public/sniffingDog.svg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { AnimatedDogImage } from "@/components/AnimatedDogImage";

const benignVerdict: { image: StaticImport } = {
  image: happyDogImage,
};

const maliciousVerdict: { image: StaticImport } = {
  image: angryDogImage,
};

// const TEST_PREDICTION_RESPONSE: PredictionResponse = {
//   confidense: { benign: 1, malicious: 0 },
//   influentialFeatures: [],
//   explanation: "",
//   prediction: "benign",
// };

const getVerdict = (prediction: PredictionResponse["prediction"] | undefined) =>
  prediction === "malicious" ? maliciousVerdict : benignVerdict;

const Page = (): JSX.Element => {
  const { currentFile } = useFileStore();
  console.log(currentFile);
  const { uploadFileToServer } = useFileUpload();
  const [reportAnalysis, setReportAnalysis] = useState<
    PredictionResponse | undefined
  >();

  const fetchReportAnalysis = async () => {
    // if (!currentFile) return;

    try {
      const response = await uploadFileToServer(currentFile);
      console.log("uploadFileToServer response:", response);
      if (response.success) setReportAnalysis(response.data);
    } catch (err) {
      console.log("ERROR");
      setReportAnalysis(undefined);
    }
  };

  useEffect(() => {
    fetchReportAnalysis();
  }, [currentFile]);

  const verdict = useMemo(
    () => getVerdict(reportAnalysis?.prediction),
    [reportAnalysis?.prediction]
  );
  console.log(reportAnalysis);
  return (
    <main className="flex flex-col relative items-center justify-between w-full h-full overflow-hidden">
      <section className="flex items-center justify-between gap-2 my-8 w-full px-64">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center justify-start">
            <Image src={bigLogo} alt="CyberSniffer logo" />
            <Typography.Title className="font-medium">
              CyberSniffer
            </Typography.Title>
          </div>
          <Typography.Title level={2}>Analysis result</Typography.Title>
        </div>
        <div className="max-w-96 h-full relative">
          <Typography.Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            tempus a erat quis auctor. Nulla facilisi. Sed ut rhoncus lorem. Nam
            placerat,
          </Typography.Text>
          <Button className="absolute bottom-0">Upload</Button>
        </div>
      </section>
      <ReportSection reportAnalysis={Boolean(reportAnalysis)} />
      <AnimatedDogImage
        reportAnalysis={reportAnalysis}
        verdictImage={verdict.image}
        loadingDogImage={sniffingDog}
      />
      <Header className="relative bottom-0 bg-black/40 rounded-2xl h-min mb-2" />
    </main>
  );
};

export default Page;
