package yarascanner

import (
	"bufio"
	"bytes"
	"context"
	"errors"
	"fmt"
	"github.com/lemavisaitov/opr/pkg/logger"
	"go.uber.org/zap"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/lemavisaitov/opr/internal/apperr"
	"github.com/lemavisaitov/opr/internal/model"
)

type Config struct {
	RulesDir string
}
type YaraScanner struct {
	rulesPath string
}

func New(cfg Config) (*YaraScanner, error) {
	yaraFiles, err := getRulesFromDir(cfg.RulesDir)
	if err != nil {
		return nil, err
	}

	if len(yaraFiles) == 0 {
		return nil, apperr.ErrNoRulesInDir
	}

	pathToCompiled := cfg.RulesDir + "_compiled"
	if err := compileYaraRules(yaraFiles, pathToCompiled); err != nil {
		return nil, err
	}

	return &YaraScanner{
		rulesPath: pathToCompiled,
	}, nil
}

func getRulesFromDir(dir string) ([]string, error) {
	var yaraFiles []string
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return fmt.Errorf("error accessing the path %q: %w", path, err)
		}

		if !info.IsDir() && (filepath.Ext(path) == ".yar" || filepath.Ext(path) == ".yara") {
			yaraFiles = append(yaraFiles, path)
		}
		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("error when traversing the directory: %w", err)
	}
	return yaraFiles, nil
}

func compileYaraRules(inputFiles []string, outputFile string) error {
	args := append([]string{"-w"}, inputFiles...)
	args = append(args, outputFile)
	cmd := exec.Command("yarac", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Run()
	if err != nil {
		return fmt.Errorf("%w: %w", apperr.ErrInvalidRulesFile, err)
	}

	return nil
}

func (e *YaraScanner) ScanFile(ctx context.Context, pathToFile string) (model.AnalysisResult, error) {
	var matches []model.RuleOutput

	args := []string{"--print-meta", "-r", "-w", "-e"}

	args = append(args, e.rulesPath, "-C")
	args = append(args, pathToFile)
	cmd := exec.CommandContext(ctx, "yara", args...)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	output, err := cmd.Output()
	if err != nil {
		if cerr := ctx.Err(); errors.Is(cerr, context.DeadlineExceeded) {
			return model.AnalysisResult{}, apperr.ErrScanTimeout
		}

		if exitErr := new(exec.ExitError); errors.As(err, &exitErr) {
			errMsg := fmt.Sprintf("YARA failed with code %d: %s", exitErr.ExitCode(), stderr.String())
			return model.AnalysisResult{}, errors.New(errMsg)
		}

		return model.AnalysisResult{}, fmt.Errorf("scan aborted: %w", err)
	}

	scanner := bufio.NewScanner(strings.NewReader(string(output)))

	for scanner.Scan() {
		line := scanner.Text()

		logger.Debug("YARA rule output line",
			zap.String("line", line),
		)

		ruleOutput, err := parseYARALine(line)
		if err != nil {
			logger.Error("Error parsing YARA rule output: %s",
				zap.Error(err),
			)
			return model.AnalysisResult{}, err
		}
		logger.Debug("YARA rule parsed output",
			zap.String("namespace", ruleOutput.Namespace),
			zap.String("rule name", ruleOutput.RuleName),
			zap.String("filepath", ruleOutput.FilePath),
			zap.Any("meta info", ruleOutput.MetaInfo),
		)

		matches = append(matches, ruleOutput)
	}

	if len(matches) > 0 {
		return model.AnalysisResult{
			Verdict:    model.Malicious,
			Detections: matches,
		}, nil
	}

	return model.AnalysisResult{
		Verdict: model.Clean,
	}, nil
}

var re = regexp.MustCompile(`^(\w+):(\w+)(?:\s+\[(.*?)\])?\s+(.+)$`)

func parseYARALine(line string) (model.RuleOutput, error) {
	matches := re.FindStringSubmatch(line)
	if len(matches) < 5 {
		return model.RuleOutput{}, fmt.Errorf("could not parse yarascanner rule output: %s", line)
	}

	result := model.RuleOutput{
		Namespace: matches[1],
		RuleName:  matches[2],
		MetaInfo:  make(map[string]any),
		FilePath:  matches[4],
	}

	// meta information parsing
	if matches[3] != "" {
		metaPairs := strings.Split(matches[3], ",")
		metaRegex := regexp.MustCompile(`(\w+)="([^"]+)"`)
		for _, pair := range metaPairs {
			pair = strings.TrimSpace(pair)
			metaMatch := metaRegex.FindStringSubmatch(pair)
			if len(metaMatch) == 3 {
				result.MetaInfo[metaMatch[1]] = metaMatch[2]
			}
		}
	}

	return result, nil
}
