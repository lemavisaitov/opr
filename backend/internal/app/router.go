package app

import (
	"github.com/lemavisaitov/opr/internal/app/api"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Handler interface {
	UploadFile(req *http.Request) *api.Response
}

func NewRouter(handler Handler) chi.Router {
	mux := chi.NewRouter()

	corsMiddleware := cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		ExposedHeaders: []string{"*"},
		// ... другие параметры
	})
	mux.Use(
		middleware.RequestID,
		middleware.Logger,
		middleware.Recoverer,
		corsMiddleware,
		middleware.URLFormat,
		middleware.StripSlashes,
		middleware.Timeout(60*time.Second),
	)

	mux.Post("/api/files/upload", api.Method(handler.UploadFile))

	return mux
}
