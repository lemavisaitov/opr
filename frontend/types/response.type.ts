interface Detection {
  ruleName: string;
}

interface Response {
  detections: Detection[] | null;
  verdict: "Clean" | "Malicious";
}

export { type Detection, type Response };
