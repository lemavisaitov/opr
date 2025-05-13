package app

import (
	"net/http"
	"time"

	"github.com/lemavisaitov/opr/internal/app/api"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Handler interface {
	UploadFile(req *http.Request) *api.Response
}

func NewRouter(handler Handler) chi.Router {
	mux := chi.NewRouter()

	mux.Use(middleware.RequestID)
	mux.Use(middleware.Logger)
	mux.Use(middleware.Recoverer)
	mux.Use(middleware.URLFormat)
	mux.Use(middleware.StripSlashes)
	mux.Use(middleware.Timeout(60 * time.Second))

	mux.Post("/upload", api.Method(handler.UploadFile))

	return mux
}
