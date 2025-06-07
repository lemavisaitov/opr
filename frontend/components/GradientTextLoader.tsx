import { LoaderDots } from "@/components/Loader/LoaderDots";
import { JSX } from "react";

export const GradientTextLoader = (): JSX.Element => {
  return (
    <div
      className="flex w-max p-4 items-center text-[2rem] font-pixelify overflow-hidden gradient-glow"
      style={{
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      Analysis
      <LoaderDots />
    </div>
  );
};
