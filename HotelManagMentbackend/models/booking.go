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

// Request structs for Booking
type CreateBookingRequest struct {
	UserID     int32     `json:"UserID" validate:"required"`
	RoomID     int32     `json:"RoomID" validate:"required"`
	StartDate  time.Time `json:"StartDate" validate:"required"`
	EndDate    time.Time `json:"EndDate" validate:"required"`
	TotalPrice float64   `json:"TotalPrice" validate:"required"`
	Status     string    `json:"Status" validate:"required,oneof=active new expired cancelled"`
}

type UpdateBookingRequest struct {
	ID         int32     `json:"ID" validate:"required"`
	StartDate  time.Time `json:"StartDate"`
	EndDate    time.Time `json:"EndDate"`
	TotalPrice float64   `json:"TotalPrice"`
	Status     string    `json:"Status" validate:"oneof=active new expired cancelled"`
}

// Response structs for Booking
type BookingResponse struct {
	Id         int32     `json:"Id"`
	UserId     int32     `json:"UserId"`
	RoomId     int32     `json:"RoomId"`
	StartDate  time.Time `json:"StartDate"`
	EndDate    time.Time `json:"EndDate"`
	TotalPrice float64   `json:"TotalPrice"`
	Status     string    `json:"Status"`
	CreatedAt  time.Time `json:"CreatedAt"`
}
