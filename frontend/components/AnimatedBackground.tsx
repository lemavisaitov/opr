"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, Scope } from "animejs";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface AnimatedBackgroundProps {
  image?: string | StaticImport;
}

export const AnimatedBackground = ({ image }: AnimatedBackgroundProps) => {
  const root = useRef<HTMLDivElement | null>(null);
  const scope = useRef<Scope | null>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const sc = createScope({ root: root.current });
    scope.current = sc;

    sc.add(() => {
      if (!blob1Ref.current || !blob2Ref.current) return;

      animate(blob1Ref.current, {
        scale: [
          { to: 1.5, ease: "linear", duration: 9_000 },
          { to: 1, ease: "linear", duration: 9_000 },
        ],
        loop: true,
        loopDelay: 250,
      });

      animate(blob2Ref.current, {
        scale: [
          { to: 1.25, ease: "linear", duration: 2_000 },
          { to: 1, ease: "linear", duration: 2_000 },
        ],
        loop: true,
        direction: "alternate",
        loopDelay: 250,
      });
    });

    return () => sc.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      {image && (
        <Image
          src={image}
          alt="background image"
          className="absolute w-screen h-screen opacity-60 object-fill"
        />
      )}
      <div
        ref={blob1Ref}
        className="absolute w-[1500px] h-[1500px] rounded-full opacity-40 mix-blend-screen blur-[300px]"
        style={{
          background: "radial-gradient(circle, #00FF1E, transparent 100%)",
          top: "70%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <div
        ref={blob2Ref}
        className="absolute w-[1000px] h-[1000px] rounded-full opacity-100 mix-blend-screen blur-[300px]"
        style={{
          background: "radial-gradient(circle, #377441, transparent 100%)",
          top: "40%",
          left: "40%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
};
