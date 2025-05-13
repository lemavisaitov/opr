"use client";

import Image from "next/image";
import dogImage from "@/public/dog.svg";
import { JSX, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DogImage(): JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && (
        <Skeleton className="absolute top-0 left-0 w-full h-full rounded-full" />
      )}
      <Image
        src={dogImage}
        alt="Dog mascot image"
        className={`object-contain transition-opacity duration-100 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
