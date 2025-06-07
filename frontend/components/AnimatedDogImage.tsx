import { PredictionResponse } from "@/types/response.type";
import { gsap } from "gsap";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface AnimatedDogImageProps {
  reportAnalysis: PredictionResponse | undefined;
  verdictImage: string | StaticImport;
  loadingDogImage: string | StaticImport;
}

export const AnimatedDogImage = ({
  reportAnalysis,
  verdictImage,
  loadingDogImage,
}: AnimatedDogImageProps) => {
  const sniffRef = useRef<HTMLImageElement>(null);
  const verdictRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (reportAnalysis) {
      gsap
        .timeline({ defaults: { ease: "power2.out", duration: 2 } })
        .to(sniffRef.current, { opacity: 0, scale: 0.95 })
        .set(sniffRef.current, { display: "none" })
        .set(verdictRef.current, { display: "block" })
        .fromTo(
          verdictRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1 }
        );
    } else {
      gsap
        .timeline({ defaults: { ease: "power2.out", duration: 0.4 } })
        .to(verdictRef.current, { opacity: 0, scale: 1.05 })
        .set(verdictRef.current, { display: "none" })
        .set(sniffRef.current, { display: "block" })
        .fromTo(
          sniffRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1 }
        );
    }
  }, [reportAnalysis]);

  return (
    <div className="absolute bottom-0 right-8 w-[450px] h-[450px] overflow-hidden">
      <Image
        ref={sniffRef}
        src={loadingDogImage}
        alt="sniffing dog"
        className="absolute w-full h-full object-contain"
        style={{ opacity: reportAnalysis ? 0 : 1 }}
      />
      <Image
        ref={verdictRef}
        src={verdictImage}
        alt="dog image"
        className="absolute w-full h-full object-contain"
        style={{ opacity: reportAnalysis ? 1 : 0, display: "none" }}
      />
    </div>
  );
};
