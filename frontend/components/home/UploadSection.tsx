"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import fileIcon from "@/public/file.svg";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { DetectionResult } from "@/components/DetectionResult";
import { Response } from "@/types/response.type";
import { UploadDrawer } from "@/components/UploadDrawer";

type UploadResult =
  | { success: true; data: Response }
  | { success: false; error: unknown; data?: undefined };

export const UploadSection = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult>();
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isUploading, uploadFileToServer } = useFileUpload();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (uploadResult?.success) {
      const delay = Math.floor(Math.random() * 3000) + 2000;
      timer = setTimeout(() => {
        setShowResult(true);
      }, delay);
    } else {
      setShowResult(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [uploadResult]);

  useDragAndDrop((file) => {
    handleFileSelect(file);
  });

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setIsDrawerOpen(true);
    setUploadResult(undefined);
    setShowResult(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadFileToServer(selectedFile);
      setUploadResult(result as UploadResult);
    } catch (error) {
      setUploadResult({ success: false, error });
      setIsDrawerOpen(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 w-full">
      {uploadResult?.success && showResult ? (
        <DetectionResult
          response={uploadResult.data}
          file={selectedFile}
          onReset={() => {
            setSelectedFile(undefined);
            setUploadResult(undefined);
            setIsDrawerOpen(false);
          }}
        />
      ) : uploadResult?.success ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-28 h-24">
            <Image
              src={fileIcon}
              alt="Processing file"
              fill
              className="object-contain opacity-100"
            />
          </div>
          <p className="text-sm text-gray-500">Analyzing file...</p>
        </div>
      ) : (
        <>
          <FileIcon
            isLoaded={isImageLoaded}
            onLoad={() => setIsImageLoaded(true)}
          />

          <input
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={handleInputChange}
            aria-label="File input"
          />

          <Button
            type="button"
            onClick={triggerFileInput}
            aria-label="Select file"
          >
            Choose file
          </Button>

          <UploadDrawer
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            file={selectedFile}
            isUploading={isUploading}
            onUpload={handleUpload}
          />
        </>
      )}
    </section>
  );
};

type FileIconProps = {
  isLoaded: boolean;
  onLoad: () => void;
};

const FileIcon = ({ isLoaded, onLoad }: FileIconProps) => (
  <div className="relative w-28 h-24">
    {!isLoaded && (
      <Skeleton className="absolute top-0 left-0 w-full h-full rounded-md" />
    )}
    <Image
      src={fileIcon}
      alt="Upload file icon"
      fill
      className={cn(
        "object-contain transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-0"
      )}
      onLoad={onLoad}
    />
  </div>
);
