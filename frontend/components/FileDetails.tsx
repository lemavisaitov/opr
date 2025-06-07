import { formatSize } from "@/utils/file.util";
import { describeMimeType } from "@/utils/mime.util";
import { Typography } from "@/components/Typography/Typography";

interface FileDetailsProps {
  file: File | null;
}

export const FileDetails = ({ file }: FileDetailsProps) => {
  return (
    <div className="flex flex-col flex-1 p-4 max-w-[300px] gap-2">
      {file && (
        <>
          <div>
            <Typography.Text className="text-2xl">{file.name}</Typography.Text>
            <Typography.Muted>Filename</Typography.Muted>
          </div>
          <div>
            <Typography.Text className="text-2xl">
              {formatSize(file.size)}
            </Typography.Text>
            <Typography.Muted>Size</Typography.Muted>
          </div>
          <div>
            <Typography.Text className="text-2xl w-full">
              {describeMimeType(file.type)}
            </Typography.Text>
            <Typography.Muted>Type</Typography.Muted>
          </div>
        </>
      )}
    </div>
  );
};
