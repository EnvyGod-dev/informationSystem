package db

import (
	"database/sql"
	"fmt"
	"os"

	"namuunzul/conf"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func CreateSqlDB(c *conf.Config) (*sql.DB, error) {
	db, err := sql.Open("pgx", c.Database.Url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}
