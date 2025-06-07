import { cn } from "@/lib/utils";
import { JSX } from "react";

interface AnimatedBackgroundProps {
  className?: string;
}

export const AnimatedBackground = ({
  className,
}: AnimatedBackgroundProps): JSX.Element => {
  return (
    <div className={cn("fixed inset-0 z-[1] bg-transparent", className)}>
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-50 blur-[150px] animate-scale"
        style={{
          background:
            "linear-gradient(78.7deg, #439ddf 13%, #4f87ed 35%, #9476c5 47%, #bc688e 51%, #d6645d 56%, transparent 100%)",
          top: "30%",
          left: "32%",
        }}
      />
    </div>
  );
};
