import { useCallback } from "react";
import useSWRMutation from "swr/mutation";

async function uploadFile(url: string, { arg }: { arg: FormData }) {
  const res = await fetch(url, {
    method: "POST",
    body: arg,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
}

export function useFileUpload() {
  const { trigger, isMutating } = useSWRMutation("/api/upload", uploadFile);

  const uploadFileToServer = useCallback(
    async (file: File | null) => {
      if (!file)
        return { success: false, error: new Error("No file selected") };

      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await trigger(formData);
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
}
