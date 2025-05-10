"use client";

import { JSX, useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";

import HeroIcon from "@/public/heroIcon.svg";

import { ROUTES } from "@/constants/routes.constant";

import Icon from "@/components/Icon";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar } from "@/components/Avatar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "./ui/button";
import Link from "next/link";
import { useFileUpload } from "@/hooks/useFileUpload";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps): JSX.Element => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // TODO: Сделать так, чтобы Drawer выдвигался.
  const { isUploading, uploadFileToServer } = useFileUpload();

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setIsDrawerOpen(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      console.log(e.target.files[0]);
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <header className={className}>
      <div className="rounded-2xl border border-[#222121] px-2 py-2  w-4xl flex items-center justify-between">
        <div className="flex justify-center items-center gap-2">
          <Icon href={ROUTES.home} src={HeroIcon} alt="Hero icon" />
          <Breadcrumbs />
        </div>
        {/* <Tools /> */}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex items-center justify-center gap-2">
          <Button variant={"outline"}>ru</Button>
          <Button variant={"outline"} onClick={handleButtonClick}>
            <Upload />
            upload
          </Button>
          <ModeToggle />
          <Link href={ROUTES.profile}>
            <Avatar className="w-9 h-9" />
          </Link>
        </div>
      </div>
      <div className="rounded-2xl border border-[#222121] px-2 py-2 flex items-center justify-center gap-2">
        <Button variant={"outline"}>Recent</Button>
        <Button variant={"outline"}>Whitelist</Button>
        {/* <RecentFiles />
        <Whitelist /> */}
      </div>
    </header>
  );
};
