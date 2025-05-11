package api

import (
	"context"
	"errors"
	"net/http"
)

const (
	// 5xx
	ErrCodeUnknown = "Unknown"
	// Generic HTTP errors
	ErrCodeBadRequest           = "BadRequest"
	ErrCodeUnauthorized         = "Unauthorized"
	ErrCodeNotFound             = "NotFound"
	ErrCodeMethodNotAllowed     = "NotAllowed"
	ErrCodeNotImplemented       = "NotImplemented"
	ErrCodeInvalidQueryArgument = "InvalidQueryArgument"
	ErrCodePreconditionRequired = "PreconditionRequired"

	// 403
	ErrCodeForbidden          = "Forbidden"
	ErrCodeMissingPermissions = "MissingPermissions"
	// 413
	ErrCodePayloadTooLarge = "PayloadTooLarge"
	// 415
	ErrCodeUnexpectedContentType = "UnexpectedContentType"
	//422
	ErrCodeUnprocessableEntity = "Invalid entity"
	// 499
	ErrCodeRequestCanceled = "RequestCanceled"
)

var (
	ContentTypeError = &ErrorResponse{
		Code:    ErrCodeUnexpectedContentType,
		Message: "provided content-type not supported",
		Status:  http.StatusUnsupportedMediaType,
	}
)

func BadRequestError(err error) *ErrorResponse {
	return &ErrorResponse{
		Code:      ErrCodeBadRequest,
		Message:   err.Error(),
		DebugInfo: GetDebugInfo(err),
		Status:    http.StatusBadRequest,
	}
}

func RequestCanceledError(err error) *ErrorResponse {
	return &ErrorResponse{
		Code:      ErrCodeRequestCanceled,
		Message:   err.Error(),
		Status:    499,
		DebugInfo: GetDebugInfo(err),
	}
}

func InternalError(err error) *ErrorResponse {
	// overwrite response if it is caused by request cancel
	if errors.Is(err, context.Canceled) {
		return RequestCanceledError(err)
	}
	return &ErrorResponse{
		Code:      ErrCodeUnknown,
		Message:   err.Error(),
		Status:    http.StatusInternalServerError,
		DebugInfo: GetDebugInfo(err),
	}
}
