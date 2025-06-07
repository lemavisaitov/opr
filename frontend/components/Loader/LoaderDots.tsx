import { JSX } from "react";

export const LoaderDots = (): JSX.Element => {
  const delays = [0, 200, 400];

  return (
    <span className="flex items-center ml-2 space-x-1 gradient-glow">
      {delays.map((d, i) => (
        <span
          key={i}
          className="inline-block text-[2rem] text-[#D6645D] animate-bounce-dots dot-glow gradient-glow"
          style={{
            animationDelay: `${d}ms`,
          }}
        >
          .
        </span>
      ))}
    </span>
  );
};
