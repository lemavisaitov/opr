import { JSX } from "react";

import { Header } from "@/components/Header";
import IntroSection from "@/components/home/IntroSection";
import { UploadSection } from "@/components/home/UploadSection";
import DogImage from "@/components/home/DogImage";

export default function Home(): JSX.Element {
  return (
    <>
      <main className="flex flex-col md:flex-row items-center justify-center px-4 py-10">
        <div className="flex flex-col items-center">
          <IntroSection />
          <UploadSection />
        </div>
        <DogImage />
      </main>
      <Header className="flex items-center justify-between w-4xl gap-2 pb-4" />
    </>
  );
}
