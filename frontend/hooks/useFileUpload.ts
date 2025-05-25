import { API_ROUTES } from "@/constants/routes.constant";
import { PredictionResponse } from "@/types/response.type";
import { useCallback } from "react";
import useSWRMutation from "swr/mutation";

const uploadFile = async (url: string, { arg }: { arg: FormData }) => {
  const response = await fetch(url, {
    method: "POST",
    body: arg,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
};

export const useFileUpload = () => {
  const { trigger, isMutating } = useSWRMutation(API_ROUTES.upload, uploadFile);

  const uploadFileToServer = useCallback(
    async (file: File | null) => {
      if (!file)
        return { success: false, error: new Error("No file selected") };

      const formData = new FormData();
      formData.append("file", file);

      try {
        const result: PredictionResponse = await trigger(formData);
        // console.log(result);
        return { success: true, data: result };
      } catch (error) {
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
