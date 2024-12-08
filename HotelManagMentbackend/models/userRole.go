package models

import "time"

type UserRole struct {
	UserId     int32     `json:"UserId"`
	RoleId     int32     `json:"RoleId"`
	AssignedAt time.Time `json:"AssignedAt"`
}
