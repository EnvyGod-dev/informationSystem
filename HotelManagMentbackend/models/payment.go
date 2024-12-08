package models

import "time"

type Payment struct {
	Id          int32     `json:"Id"`
	BookingId   int32     `json:"BookingId"`
	Amount      float64   `json:"Amount"`
	PaymentDate time.Time `json:"PaymentDate"`
	Status      string    `json:"Status"`
}
