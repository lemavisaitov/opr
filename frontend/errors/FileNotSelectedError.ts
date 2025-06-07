export class FileNotSelectedError extends Error {
  constructor(message = "No file selected") {
    super(message);
    this.name = "FileNotSelectedError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FileNotSelectedError);
    }
  }
}
