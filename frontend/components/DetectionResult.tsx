import { DetectionDetails } from "@/components/DetectionDetails";

type DetectionResultProps = {
  response: Response;
  file?: File;
  onReset: () => void;
};

export const DetectionResult = ({
  response,
  file,
  onReset,
}: DetectionResultProps) => (
  <div className="w-full max-w-2xl p-6">
    {/* <h2 className="text-xl font-bold mb-4">Scan Result: {response.verdict}</h2> */}

    {file && (
      <div className="mb-4">
        <h3 className="font-medium">Scanned File:</h3>
        <p className="text-sm text-gray-600">{file.name}</p>
      </div>
    )}

    <DetectionDetails response={response} onReset={onReset} file={file} />
  </div>
);
