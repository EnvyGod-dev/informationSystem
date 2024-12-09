package models

import "time"

// Room үндсэн загвар
type Room struct {
	Id          int32     `json:"Id"`
	HotelId     int32     `json:"HotelId"`
	RoomType    string    `json:"RoomType"`
	Price       float64   `json:"Price"`
	IsAvailable bool      `json:"IsAvailable"`
	RoomImg     string    `json:"RoomImg"`
	CreatedAt   time.Time `json:"CreatedAt"`
}

// RoomWithHotel - Өрөөг Зочид Буудлын мэдээлэлтэй хамт харуулах
type RoomWithHotel struct {
	RoomID       int32   `json:"RoomID"`
	RoomType     string  `json:"RoomType"`
	Price        float64 `json:"Price"`
	IsAvailable  bool    `json:"IsAvailable"`
	HotelID      int32   `json:"HotelID"`
	HotelName    string  `json:"HotelName"`
	HotelAddress string  `json:"HotelAddress"`
}

// RoomByHotel - Зочид буудалд хамааралтай өрөөнүүд
type RoomByHotel struct {
	RoomID       int32   `json:"RoomID"`
	RoomType     string  `json:"RoomType"`
	Price        float64 `json:"Price"`
	IsAvailable  bool    `json:"IsAvailable"`
	HotelName    string  `json:"HotelName"`
	HotelAddress string  `json:"HotelAddress"`
}
