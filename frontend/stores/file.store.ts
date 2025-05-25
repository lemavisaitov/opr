import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FileState {
  currentFile: File | null;
  fileList: File[];
  isLoading: boolean;
  error: string | null;
}

interface FileActions {
  setCurrentFile: (file: File | null) => void;
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

type FileStore = FileState & FileActions;

export const useFileStore = create<FileStore>()(
  persist(
    (set) => ({
      currentFile: null,
      fileList: [],
      isLoading: false,
      error: null,

      setCurrentFile: (file) => set({ currentFile: file }),

      addFile: (file) =>
        set((state) => {
          const fileExists = state.fileList.some(
            (f) => f.name === file.name && f.size === file.size
          );

          if (fileExists) {
            return { error: "File already exists" };
          }

          return {
            fileList: [...state.fileList, file],
            error: null,
          };
        }),

      removeFile: (index) =>
        set((state) => {
          const newFileList = [...state.fileList];
          newFileList.splice(index, 1);

          const currentFile =
            state.currentFile?.name === state.fileList[index]?.name
              ? null
              : state.currentFile;

          return {
            fileList: newFileList,
            currentFile,
          };
        }),

      clearFiles: () => set({ fileList: [], currentFile: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),
    }),
    {
      name: "file-storage",
      partialize: (state) => ({
        fileList: state.fileList,
      }),
    }
  )
);
