"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import fileIcon from "@/public/file.svg";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

export default function UploadSection() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isUploading, uploadFileToServer } = useFileUpload();

  useDragAndDrop((file) => {
    setSelectedFile(file);
    setIsDrawerOpen(true);
  });

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setIsDrawerOpen(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleUpload = async () => {
    const result = await uploadFileToServer(selectedFile);
    if (result.success) {
      setIsDrawerOpen(false);
      alert(`Upload success: ${result.data.message}`);
    } else {
      alert(`Upload error: ${result.error}`);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-28 h-24">
        {!isImageLoaded && (
          <Skeleton className="absolute top-0 left-0 w-full h-full rounded-md" />
        )}
        <Image
          src={fileIcon}
          alt="Upload file icon"
          fill
          className={cn(
            "object-contain transition-opacity duration-300",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoadingComplete={() => setIsImageLoaded(true)}
        />
      </div>

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleInputChange}
      />

      <Button type="button" onClick={handleButtonClick}>
        Choose file
      </Button>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm p-4">
            <DrawerHeader>
              <DrawerTitle>Upload File</DrawerTitle>
            </DrawerHeader>

            {selectedFile && (
              <div className="flex flex-col items-center gap-4 mt-4">
                <p className="text-sm text-gray-500">{selectedFile.name}</p>
                <Button
                  variant="secondary"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? "Uploading..." : "Upload File"}
                </Button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
}
