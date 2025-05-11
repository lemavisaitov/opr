package apperr

import "errors"

var (
	ErrScanTimeout      = errors.New("scan timeout")
	ErrInvalidRulesFile = errors.New("invalid YARA rules file")
	ErrNoRulesInDir     = errors.New("no YARA rules in directory")
)
