import { API_ROUTES } from "@/constants/routes.constant";
import { PredictionResponse } from "@/types/response.type";
import { useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { FileNotSelectedError } from "@/errors/FileNotSelectedError";
import { UploadFileError } from "@/errors/UploadFileError";

export interface UploadSuccess {
  success: true;
  data: PredictionResponse;
}

export interface UploadFailure {
  success: false;
  error: Error;
}

type UploadResult = UploadSuccess | UploadFailure;

const uploadFile = async (url: string, { arg }: { arg: FormData }) => {
  const response = await fetch(url, {
    method: "POST",
    body: arg,
  });

  if (!response.ok) throw new UploadFileError();
  const json = await response.json();
  console.log("📥 Ответ от API:", json);
  return json;
};

export const useFileUpload = () => {
  const { trigger, isMutating } = useSWRMutation(API_ROUTES.upload, uploadFile);

  const uploadFileToServer = useCallback(
    async (file: File | null): Promise<UploadResult> => {
      if (!file) {
        return {
          success: false,
          error: new FileNotSelectedError(),
        };
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        console.log("upload");
        const result: PredictionResponse = await trigger(formData);
        console.log(result);
        return { success: true, data: result };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        return { success: false, error };
      }
    },
    [trigger]
  );

  return {
    isUploading: isMutating,
    uploadFileToServer,
  };
};
