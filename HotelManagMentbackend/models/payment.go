package models

import "time"

type Payment struct {
	Id          int32     `json:"Id"`
	BookingId   int32     `json:"BookingId"`
	Amount      float64   `json:"Amount"`
	PaymentDate time.Time `json:"PaymentDate"`
	Status      string    `json:"Status"`
}

type DetailedPayment struct {
	PaymentID     int32     `json:"PaymentID"`
	Amount        float64   `json:"Amount"`
	PaymentDate   time.Time `json:"PaymentDate"`
	PaymentStatus string    `json:"PaymentStatus"`
	BookingID     int32     `json:"BookingID"`
	StartDate     time.Time `json:"StartDate"`
	EndDate       time.Time `json:"EndDate"`
	TotalPrice    float64   `json:"TotalPrice"`
	BookingStatus string    `json:"BookingStatus"`
	UserID        int32     `json:"UserID"`
	FirstName     string    `json:"FirstName"`
	LastName      string    `json:"LastName"`
	Email         string    `json:"Email"`
	RoomID        int32     `json:"RoomID"`
	RoomType      string    `json:"RoomType"`
	RoomPrice     float64   `json:"RoomPrice"`
}
