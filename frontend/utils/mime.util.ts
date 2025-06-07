const mimeMap: Record<string, string> = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "Microsoft Word (DOCX)",

  // Изображения
  "image/png": "PNG изображение",
  "image/jpeg": "JPEG изображение",
  "image/gif": "GIF изображение",
  "image/webp": "WebP изображение",

  "application/pdf": "PDF-документ",

  "application/zip": "ZIP-архив",
  "application/x-rar-compressed": "RAR-архив",

  "application/x-msdownload": "EXE-файл (Windows исполняемый файл)",

  "text/plain": "Текстовый файл",
  "text/html": "HTML-документ",
  "application/json": "JSON-документ",

  unknown: "Неизвестный тип файла",
};

export const describeMimeType = (mime: string): string => {
  return mimeMap[mime] || `Неизвестный формат (${mime})`;
};
