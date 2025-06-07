import { JSX } from "react";
import styles from "./verdictBackground.module.css";
import { Typography } from "./Typography/Typography";
import { cn } from "@/lib/utils";

interface VerdictResultProps {
  prediction: "benigb" | "malicious" | undefined;
}

export const VerdictResult = ({
  prediction,
}: VerdictResultProps): JSX.Element => {
  return (
    <div className={cn(styles.verdictBackground, "flex-1")}>
      <Typography.Title
        level={2}
        className="font-normal mt-10 mx-4 text-7xl gradient-glow"
      >
        {prediction}
      </Typography.Title>
      <Typography.Muted className="mx-4">Verdict</Typography.Muted>
    </div>
  );
};
