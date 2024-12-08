package models

type Role struct {
	Id          int32  `json:"Id"`
	RoleName    string `json:"RoleName"`
	Description string `json:"Description"`
}
