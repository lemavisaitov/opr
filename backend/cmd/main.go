package main

import (
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/lemavisaitov/opr/internal/app"
	"github.com/lemavisaitov/opr/internal/handler"
	"github.com/lemavisaitov/opr/internal/usecase"
	"github.com/lemavisaitov/opr/pkg/logger"
	"github.com/lemavisaitov/opr/tool/yarascanner"

	"go.uber.org/zap"
)

const (
	YaraRulesDir = "./yara_rules"
	Port         = "8080"
)

func main() {
	err := logger.Init("Debug")
	if err != nil {
		panic(err)
	}

	scanner, err := yarascanner.New(YaraRulesDir)
	if err != nil {
		logger.Fatal("Failed to create yara scanner",
			zap.Error(err),
		)
	}
	yaraUC := usecase.New(scanner)
	handler := handler.NewHandler(yaraUC)
	router := app.NewRouter(handler)
	server := http.Server{
		Addr:              fmt.Sprintf(":%s", Port),
		Handler:           router,
		ReadHeaderTimeout: 60 * time.Second,
	}

	shutdownChan := make(chan os.Signal, 1)
	signal.Notify(shutdownChan, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-shutdownChan
	}()

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		logger.Fatal("Failed to start server",
			zap.Error(err),
		)
	}
}
