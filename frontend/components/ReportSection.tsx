import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import Image from "next/image";

import lightbulb from "@/public/Lightbulb.svg";
import styles from "@/components/animation.module.css";
import { GradientTextLoader } from "@/components/GradientTextLoader";
import { Typography } from "@/components/Typography/Typography";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "./AnimatedBackground";
import { VerdictResult } from "@/components/VerdictResult";
import { FileDetails } from "@/components/FileDetails";
import { useFileStore } from "@/stores/file.store";

export const ReportSection = ({
  reportAnalysis,
}: {
  reportAnalysis: boolean;
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { currentFile } = useFileStore();

  useEffect(() => {
    if (!reportAnalysis) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.to(loaderRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "none",
    })
      .set(loaderRef.current, { display: "none" })
      .fromTo(
        resultRef.current,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 2,
          transformOrigin: "center center",
          ease: "expo.inOut",
        }
      );

    return () => {
      tl.kill();
    };
  }, [reportAnalysis]);

  return (
    <section className="flex-1 w-full py-4 px-48  relative flex items-center justify-center overflow-visible">
      <div
        ref={loaderRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <GradientTextLoader />
      </div>
      <div
        ref={resultRef}
        className="w-full h-full flex flex-col opacity-0 gap-y-4 overflow-visible"
      >
        <div
          ref={contentRef}
          className="flex flex-col h-full items-center justify-center gap-4 overflow-visible"
        >
          <div
            className={cn(
              styles.animate,
              "flex w-full items-center justify-start"
            )}
          >
            <div className="flex flex-col h-full">
              <VerdictResult
                prediction={reportAnalysis ? "benigb" : "malicious"}
              />
              <FileDetails file={currentFile} />
            </div>
          </div>
          <Typography.Muted className="flex items-start gap-x-2">
            <Image src={lightbulb} alt="lightbulb" />
            The model may contain errors. Check important information.
          </Typography.Muted>
          <AnimatedBackground className="animate-[var(--fade-in)]" />
        </div>
      </div>
    </section>
  );
};
