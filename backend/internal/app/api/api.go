package api

import (
	"github.com/go-chi/render"
	"github.com/lemavisaitov/opr/pkg/logger"
	"go.uber.org/zap"
	"net/http"
)

type Response struct {
	data    interface{}
	status  int
	headers []struct{ k, v string }
}

func Respond(data interface{}) *Response {
	resp := &Response{data: data}
	if er, ok := data.(*ErrorResponse); ok {
		resp.status = er.Status
	}
	return resp
}

func RespondStatus(status int, data interface{}) *Response {
	return &Response{status: status, data: data}
}

type MethodFunc func(req *http.Request) *Response

func Method(h MethodFunc) http.HandlerFunc {
	return func(resp http.ResponseWriter, req *http.Request) {
		res := h(req)
		for _, p := range res.headers {
			resp.Header().Set(p.k, p.v)
		}
		if res.status != 0 {
			render.Status(req, res.status)
		}
		if res.data == nil {
			resp.WriteHeader(http.StatusNoContent)
			return
		}
		HTTPRespond(resp, req, res.data)
	}
}

// HTTPRespond writes v to resp according to its request req.
//
// Calling on status http.StatusNoContent causes error http.ErrBodyNotAllowed
func HTTPRespond(resp http.ResponseWriter, req *http.Request, v interface{}) {
	if val, ok := v.(render.Renderer); ok {
		MustRender(resp, req, val)
		return
	}
	render.Respond(resp, req, v)
}

func MustRender(resp http.ResponseWriter, req *http.Request, v render.Renderer) {
	var (
		info         *DebugInfo
		responseCode string
		err          error
	)
	ctx := req.Context()
	switch e := v.(type) {
	case ErrorResponse:
		info = e.DebugInfo
		err = v.Render(resp, req)
	case *ErrorResponse:
		info = e.DebugInfo
		err = v.Render(resp, req)
	default:
		err = render.Render(resp, req, v)
	}
	if err != nil {
		panic(err)
	}
	if info != nil {
		if responseCode != ErrCodeRequestCanceled {
			logger.Error("error response",
				zap.String(ErrCodeRequestCanceled, responseCode),
				zap.Error(info),
			)
		} else {
			logger.Error("request canceled",
				zap.Error(info),
			)
		}
	}
}

type ErrorResponse struct {
	Code      string      `json:"code"` // Using string to simplify comparing in JS code.
	Message   string      `json:"message,omitempty"`
	Details   interface{} `json:"details,omitempty"`
	DebugInfo *DebugInfo  `json:"debugInfo,omitempty"`

	Status int `json:"-"` // For render proper status code in response.
}

func (e ErrorResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.Status)
	if HidesDebugInfo(r.Context()) {
		e.DebugInfo = nil
	}
	render.Respond(w, r, e)
	return nil
}

type DebugInfo struct {
	Err string `json:"error,omitempty"`
}

func (i DebugInfo) Error() string {
	return i.Err
}

func GetDebugInfo(err error) *DebugInfo {
	if err == nil {
		return nil
	}
	info := DebugInfo{Err: err.Error()}
	return &info
}
