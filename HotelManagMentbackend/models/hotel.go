package models

import "time"

type Hotel struct {
	Id        int32     `json:"Id"`
	Name      string    `json:"Name"`
	Address   string    `json:"Address"`
	City      string    `json:"City"`
	Rating    float64   `json:"Rating"`
	CreatedAt time.Time `json:"CreatedAt"`
}
