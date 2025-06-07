import { RotateCcw } from "lucide-react";
import { JSX } from "react";
import { Button } from "./ui/button";
import { Typography } from "./Typography/Typography";
import { formatSize } from "@/utils/file.util";
import { DetectResultList } from "@/components/DetectResultList";

interface DetectionDetailsProps {
  response: Response;
  file?: File;
  onReset: () => void;
}

export const DetectionDetails = ({
  response,
  file,
  onReset,
}: DetectionDetailsProps): JSX.Element => {
  console.log(response);
  return (
    <div className="w-full flex flex-col gap-4 max-w-2xl">
      <div
        id="title"
        className="flex px-4 py-4 border border-[#222121] rounded-2xl items-center w-full justify-between"
      >
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
      <DetectResultList />
    </div>
  );
};
