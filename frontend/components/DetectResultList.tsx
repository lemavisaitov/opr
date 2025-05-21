import { List } from "@/components/List";
import { JSX } from "react";
import { Detection, type Response } from "@/types/response.type";
import { Typography } from "./Typography/Typography";
import { CircleCheck, CircleX } from "lucide-react";

const YARA_RULES = [
  "HelloWorldRule",
  "BebraRule",
  "Detect_Emotet_Loader",
  "CobaltStrike_Beacon_HTTP",
  "Ryuk_Ransomware_Strings",
  "APT29_CozyBear_Signature",
  "PowerShell_Reverse_Shell",
];

interface DetectResultListProps {
  result: Response;
}

export const DetectResultList = ({
  result,
}: DetectResultListProps): JSX.Element => {
  return result.detections ? (
    <div>
      <List<Detection>
        itemClassName="flex items-center justify-between px-4 py-0.5"
        items={result.detections}
        renderItem={(item) => (
          <>
            <Typography.Muted>{item.ruleName}</Typography.Muted>
            <Typography.Text className="text-red-500 flex items-center justify-center gap-2">
              <CircleX size={20} />
              {result.verdict}
            </Typography.Text>
          </>
        )}
      />
      <List
        itemClassName="flex items-center justify-between px-4 py-0.5"
        items={YARA_RULES.filter((yaraRule) => {
          // Если нет детектов или детекты null, показываем все правила
          if (!result?.detections) return true;

          // Исключаем правило, если оно найдено в ответе сервера
          return !result.detections.some(
            (detection) => detection.ruleName === yaraRule
          );
        })}
        renderItem={(item) => (
          <>
            <Typography.Muted>{item}</Typography.Muted>
            <Typography.Text className="text-emerald-500 flex items-center justify-center gap-2">
              <CircleCheck size={20} />
              Undetected
            </Typography.Text>
          </>
        )}
      />
    </div>
  ) : (
    <List
      itemClassName="flex items-center justify-between px-4 py-0.5"
      items={YARA_RULES}
      renderItem={(item) => (
        <>
          <Typography.Muted>{item}</Typography.Muted>
          <Typography.Text className="text-emerald-500 flex items-center justify-center gap-2">
            <CircleCheck size={20} />
            Undetected
          </Typography.Text>
        </>
      )}
    />
  );
};
