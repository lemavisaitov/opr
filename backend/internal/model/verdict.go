//go:generate go run -mod=mod github.com/dmarkham/enumer -type=Verdict -trimprefix=Status -json -sql

package model

type Verdict int

const (
	Clean Verdict = iota
	Malicious
)
