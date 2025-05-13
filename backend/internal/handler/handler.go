package handler

import (
	"context"
	"errors"
	"github.com/lemavisaitov/opr/internal/app/api"
	"github.com/lemavisaitov/opr/internal/model"
	"io"
	"mime/multipart"
	"net/http"
	"strings"
)

type YaraProvider interface {
	ScanFile(ctx context.Context, fileReader io.ReadCloser) (model.AnalysisResult, error)
}
type Handle struct {
	yaraUC YaraProvider
}

func NewHandler(yaraProvider YaraProvider) *Handle {
	return &Handle{
		yaraUC: yaraProvider,
	}
}

func (h *Handle) UploadFile(req *http.Request) *api.Response {
	if !strings.HasPrefix(req.Header.Get("Content-Type"), "multipart/form-data;") {
		return api.Respond(api.ContentTypeError)
	}
	mr, err := req.MultipartReader()
	if err != nil {
		return api.Respond(api.BadRequestError(err))
	}

	fileReader, err := parsePostFileStream(mr)
	if err != nil {
		return api.Respond(api.BadRequestError(err))
	}

	analysisResult, err := h.yaraUC.ScanFile(req.Context(), fileReader)
	if err != nil {
		return api.Respond(api.InternalError(err))
	}

	return api.Respond(analysisResult)
}

func parsePostFileStream(mr *multipart.Reader) (io.ReadCloser, error) {
	const fileField = "file"

	for {
		part, err := mr.NextPart()
		if errors.Is(err, io.EOF) {
			return nil, errors.New("file not found in the form")
		}
		if err != nil {
			return nil, err
		}

		if part.FormName() == fileField {
			// Создаем pipe для потоковой передачи данных
			pr, pw := io.Pipe()

			// Запускаем горутину для чтения данных из part и записи в pipe
			go func() {
				_, copyErr := io.Copy(pw, part)
				pw.CloseWithError(copyErr)
			}()

			return pr, nil
		}
	}
}
