package models

import "time"

type Booking struct {
	Id         int32     `json:"Id"`
	UserId     int32     `json:"UserId"`
	RoomId     int32     `json:"RoomId"`
	StartDate  time.Time `json:"StartDate"`
	EndDate    time.Time `json:"EndDate"`
	TotalPrice float64   `json:"TotalPrice"`
	Status     string    `json:"Status"`
	CreatedAt  time.Time `json:"CreatedAt"`
}
