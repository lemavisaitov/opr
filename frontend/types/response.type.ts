interface InfluentialFeature {
  name:
    | "file_size"
    | "max_section_size"
    | "number_of_sections"
    | "byte_freq_156"
    | "byte_freq_74";
  value: number;
  z_score: number;
}

interface PredictionResponse {
  confidense: {
    benign: number;
    malicious: number;
  };
  influentialFeatures: InfluentialFeature[];
  explanation: string;
  prediction: "benign" | "malicious";
}

export { type PredictionResponse };
