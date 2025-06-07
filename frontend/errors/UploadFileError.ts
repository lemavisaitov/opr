export class UploadFileError extends Error {
  constructor(message = "Upload failed") {
    super(message);
    this.name = "UploadFileError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UploadFileError);
    }
  }
}
