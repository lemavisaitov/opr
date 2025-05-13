package model

type RuleOutput struct {
	Namespace string         `json:"-"`
	RuleName  string         `json:"ruleName"`
	MetaInfo  map[string]any `json:"-"`
	FilePath  string         `json:"-"`
}

type AnalysisResult struct {
	Verdict    Verdict      `json:"verdict"`
	Detections []RuleOutput `json:"detections"`
}
