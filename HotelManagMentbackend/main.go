package main

import (
	"log/slog"
	"os"
	"strings"
	"time"

	"namuunzul/conf"
	"namuunzul/db"
	migrate "namuunzul/db/migration"
	"namuunzul/handlers"
	"namuunzul/routes"
	"namuunzul/utils/secure"
)

func main() {
	logHandler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level:     slog.LevelDebug,
		AddSource: true,
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.TimeKey {
				a.Key = "date"

				outputLayout := "2006/01/02 15:04:05"
				formattedTimestamp := time.Now().Format(outputLayout)

				a.Value = slog.StringValue(formattedTimestamp)
			} else if a.Key == slog.SourceKey {
				a.Key = "file"

				if len(strings.Split(a.Value.String(), " ")) < 3 {
					return a
				}

				filepath := strings.Split(a.Value.String(), " ")[1]
				fileline := strings.Split(a.Value.String(), " ")[2]

				lastIndex := strings.LastIndex(filepath, "intranet-backend/")
				if lastIndex != -1 {
					msg := filepath[lastIndex+1+len("intranet-backend"):] + ":" + fileline[:len(fileline)-1]

					a.Value = slog.StringValue(msg)
				}
			}

			return a
		},
	})

	logger := slog.New(logHandler)

	slog.SetDefault(logger)

	c := &conf.Config{}
	if err := conf.CreateConfig(c); err != nil {
		slog.Error("Unable to create the config", slog.Any("err", err))
		os.Exit(1)
	}

	if err := c.Validate(); err != nil {
		slog.Error("Unable to validate the config", slog.Any("err", err))
		os.Exit(1)
	}

	if err := migrate.MigrateDatabase(c); err != nil {
		slog.Error("Unable to migrate the database", slog.Any("err", err))
		os.Exit(1)
	} else {
		slog.Info("Migrate database completed.")
	}

	pgsql, err := db.CreateSqlDB(c)
	if err != nil {
		slog.Error("Unable to create the database object", slog.Any("err", err))
		os.Exit(1)
	}

	slog.Info("Connected to the database.")

	kp := secure.NewRsaKey(c)
	if err := kp.ReadKeyPair(); err != nil {
		slog.Error("Unable to read RSA key pair", slog.Any("err", err))

		if err := kp.GenerateKeyPair(c.Rsa.Size); err != nil {
			slog.Error("Unable to create RSA key pair", slog.Any("err", err))
			os.Exit(1)
		}

		if err := kp.SaveKeyPair(); err != nil {
			slog.Error("Unable to persist the RSA key pair", slog.Any("err", err))
			os.Exit(1)
		}

		slog.Info("RSA key pair created.")
	}

	hd := handlers.NewHandlers(c, pgsql, kp)

	rt := routes.Routes(hd)

	err = rt.Listen(":9000")
	if err != nil {
		slog.Error("Unable to listen port", slog.Any("err", err))
		os.Exit(1)
	}
}
