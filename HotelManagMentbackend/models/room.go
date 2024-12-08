package models

import "time"

type Room struct {
	Id          int32     `json:"Id"`
	HotelId     int32     `json:"HotelId"`
	RoomType    string    `json:"RoomType"`
	Price       float64   `json:"Price"`
	IsAvailable bool      `json:"IsAvailable"`
	CreatedAt   time.Time `json:"CreatedAt"`
}
