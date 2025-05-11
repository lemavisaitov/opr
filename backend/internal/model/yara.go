package model

type RuleOutput struct {
	Namespace string         `json:"namespace"`
	RuleName  string         `json:"ruleName"`
	MetaInfo  map[string]any `json:"metaInfo"`
	FilePath  string         `json:"-"`
}

type AnalysisResult struct {
	Verdict    Verdict      `json:"verdict"`
	Detections []RuleOutput `json:"detections"`
}
