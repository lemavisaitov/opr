type FileInfoProps = {
  file: File;
};

export const FileInfo = ({ file }: FileInfoProps) => (
  <div className="text-center">
    <p className="text-sm font-medium">{file.name}</p>
    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
  </div>
);
