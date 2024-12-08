package models

import "time"

type Service struct {
	Id          int32     `json:"Id"`
	RoomId      int32     `json:"RoomId"`
	Description string    `json:"Description"`
	RequestedAt time.Time `json:"RequestedAt"`
	Status      string    `json:"Status"`
}
