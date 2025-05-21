import { JSX, ReactNode } from "react";
import { Typography } from "@/components/Typography/Typography";
import { List } from "@/components/List";
import { cn } from "@/lib/utils";
import TypingCode from "@/components/TypingCode";

interface CodeBlockProps {
  children: ReactNode;
}

export const CodeBlock = ({ children }: CodeBlockProps): JSX.Element => {
  return (
    <section className="border border-black/40 bg-black/60 rounded-2xl font-mono text-sm">
      {children}
    </section>
  );
};

interface CodeBlockHeaderProps {
  title: string;
  className?: string;
}

const CodeBlockHeader = ({ title, className }: CodeBlockHeaderProps) => {
  return (
    <div
      className={cn(
        "px-4 py-2 bg-white/5 border-b sticky top-0 backdrop-blur-lg",
        className
      )}
    >
      <Typography.Text className="font-semibold">{title}</Typography.Text>
    </div>
  );
};

interface CodeBlockContentProps {
  content: string | object;
}

const CodeBlockContent = ({ content }: CodeBlockContentProps) => {
  const formatJson = (obj: any) => {
    if (typeof obj === "string") {
      try {
        obj = JSON.parse(obj);
      } catch {
        return obj;
      }
    }
    return JSON.stringify(obj, null, 2);
  };

  const raw = typeof content === "object" ? formatJson(content) : content;
  const lines = raw.split("\n");
  console.log(raw.split("\n"));
  return (
    <div className="flex w-full bg-black/20 text-gray-100 rounded-md overflow-hidden">
      <div className="text-right text-gray-500 px-3 py-2 select-none">
        {lines.map((_: string, index: number) => (
          <div key={index} className="leading-5">
            {index + 1}
          </div>
        ))}
      </div>
      <pre className="px-4 py-2 w-full overflow-auto">
        <TypingCode raw={lines} step={40} lineStep={50} />
      </pre>
    </div>
  );
};

CodeBlock.Header = CodeBlockHeader;
CodeBlock.Content = CodeBlockContent;
