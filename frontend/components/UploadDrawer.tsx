import { Button } from "@/components/ui/button";
import { FileInfo } from "@/components/FileInfo";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";

type UploadDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  file?: File;
  isUploading: boolean;
  onUpload: () => void;
};

export const UploadDrawer = ({
  isOpen,
  onOpenChange,
  file,
  isUploading,
  onUpload,
}: UploadDrawerProps) => (
  <Drawer open={isOpen} onOpenChange={onOpenChange}>
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm p-4">
        <DrawerHeader>
          <DrawerTitle>Upload File</DrawerTitle>
        </DrawerHeader>

        {file && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <FileInfo file={file} />
            <Button
              variant="secondary"
              onClick={onUpload}
              disabled={isUploading}
              className="w-full"
              aria-label="Upload file"
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        )}
      </div>
    </DrawerContent>
  </Drawer>
);
