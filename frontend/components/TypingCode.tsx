"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

interface TypingCodeProps {
  raw: string[];
  step?: number;
  lineStep?: number;
}

export default function TypingCode({
  raw,
  step = 50,
  lineStep = 200,
}: TypingCodeProps) {
  const codeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!codeRef.current) return;

    codeRef.current.innerHTML = "";

    const lineElements = raw.map((line) => {
      const lineContainer = document.createElement("div");
      lineContainer.className = "line-container block min-h-[1.2em] mb-0.5";

      const lineEl = document.createElement("div");
      lineEl.className = "line";
      lineEl.textContent = line;

      lineContainer.appendChild(lineEl);
      codeRef.current?.appendChild(lineContainer);

      return { container: lineContainer, element: lineEl };
    });

    const animations: gsap.core.Tween[] = [];
    const splitInstances: SplitText[] = [];

    lineElements.forEach(({ element }, lineIndex) => {
      const split = new SplitText(element, {
        type: "words",
        wordsClass: "word inline-block whitespace-pre",
      });

      splitInstances.push(split);

      const animation = gsap.from(split.words, {
        y: -12,
        opacity: 0,
        filter: "blur(1.4px)",
        duration: 0.6,
        ease: "power3.out",
        stagger: step / 1000,
        delay: lineIndex * (lineStep / 1000),
        clearProps: "all",
      });

      animations.push(animation);
    });

    return () => {
      animations.forEach((anim) => anim.kill());
      splitInstances.forEach((split) => split.revert());
    };
  }, [raw, step, lineStep]);

  return (
    <div ref={codeRef} className="whitespace-pre-wrap font-mono text-sm" />
  );
}
