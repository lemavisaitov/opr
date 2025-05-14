import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import { JSX } from "react";
import { Button } from "./ui/button";
import Typography from "./Typography/Typography";
import { formatSize } from "@/utils/file.util";
import { DetectResultList } from "@/components/DetectResultList";
import { Response } from "@/types/response.type";

interface DetectionDetailsProps {
  response: Response;
  file?: File;
  onReset: () => void;
}

const StatusBanner = ({
  status,
}: {
  status: "Clean" | "Malicious";
}): JSX.Element => {
  return status === "Clean" ? (
    <div className="flex gap-2 items-center text-emerald-500">
      <CircleCheck size={20} />
      <Typography.Text>
        No security vendors flagged this file as malicious
      </Typography.Text>
    </div>
  ) : (
    <div className="flex gap-2 items-center text-red-500">
      <CircleX size={20} />
      <Typography.Text>
        This file appears to be potentially dangerous.
      </Typography.Text>
    </div>
  );
};

export const DetectionDetails = ({
  response,
  file,
  onReset,
}: DetectionDetailsProps): JSX.Element => {
  return (
    <div className="w-full flex flex-col gap-4 max-w-2xl">
      <div
        id="title"
        className="flex px-4 py-4 border border-[#222121] rounded-2xl items-center w-full justify-between"
      >
        <StatusBanner status={response.verdict} />
        <Button onClick={onReset}>
          <RotateCcw />
          Reanalyze
        </Button>
      </div>
      <div id="metadata" className="flex items-center justify-between px-4">
        <div className="flex flex-col gap-1">
          <Typography.Muted className="text-muted-foreground">
            Name
          </Typography.Muted>{" "}
          {file?.name}
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col gap-1">
            <Typography.Muted className="text-muted-foreground">
              Type
            </Typography.Muted>
            {file?.type}
          </div>
          <div className="flex flex-col gap-1">
            <Typography.Muted>Size</Typography.Muted>
            {file?.size && formatSize(file.size)}
          </div>
        </div>
      </div>
      <DetectResultList result={response} />
    </div>
  );
};
