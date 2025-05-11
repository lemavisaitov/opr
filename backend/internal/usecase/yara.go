package usecase

import (
	"context"
	"encoding/json"
	"io"
	"os"

	"github.com/lemavisaitov/opr/internal/model"
)

type YaraScanner interface {
	ScanFile(ctx context.Context, pathToDir string) (model.AnalysisResult, error)
}

type YaraUC struct {
	scanner YaraScanner
}

func New(scanner YaraScanner) *YaraUC {
	return &YaraUC{scanner: scanner}
}

func (u *YaraUC) ScanFile(ctx context.Context, fileReader io.ReadCloser) (model.AnalysisResult, error) {
	var analysisResult model.AnalysisResult
	tempFile, err := os.CreateTemp("./", "yara-scan-*")
	if err != nil {
		return analysisResult, err
	}

	defer fileReader.Close()
	defer os.Remove(tempFile.Name())
	defer tempFile.Close()

	if _, err := io.Copy(tempFile, fileReader); err != nil {
		return analysisResult, err
	}

	analysisResult, err = u.scanner.ScanFile(ctx, tempFile.Name())
	if err != nil {
		return analysisResult, err
	}

	jsonData, err := json.Marshal(analysisResult)
	if err != nil {
		return analysisResult, err
	}

	var resultMap map[string]interface{}
	err = json.Unmarshal(jsonData, &resultMap)
	if err != nil {
		return analysisResult, err
	}

	return analysisResult, nil
}
