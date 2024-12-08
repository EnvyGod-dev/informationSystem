package models

import "time"

type User struct {
	Id               int32     `json:"Id"`
	LastName         string    `json:"LastName"`
	FirstName        string    `json:"FirstName"`
	UserName         string    `json:"UserName"`
	Email            string    `json:"Email"`
	IsHashedPassword string    `json:"IsHashedPassword"`
	IsAdmin          bool      `json:"IsAdmin"`
	IsUser           bool      `json:"IsUser"`
	IsReception      bool      `json:"IsReception"`
	IsFinance        bool      `json:"IsFinance"`
	IsHouseKeeper    bool      `json:"IsHouseKeeper"`
	IsActive         bool      `json:"IsActive"`
	CreatedAt        time.Time `json:"CreatedAt"`
}

type CreateUser struct {
	LastName         string `json:"LastName" validate:"required"`
	FirstName        string `json:"FirstName" validate:"required"`
	UserName         string `json:"UserName" validate:"required"`
	Email            string `json:"Email" validate:"required,email"`
	IsHashedPassword string `json:"Password" validate:"required"`
	ConfirmPassword  string `json:"ConfirmPassword" validate:"required"`
	IsAdmin          bool   `json:"IsAdmin"`
	IsUser           bool   `json:"IsUser"`
	IsReception      bool   `json:"IsReception"`
	IsFinance        bool   `json:"IsFinance"`
	IsHouseKeeper    bool   `json:"IsHouseKeeper"`
	IsActive         bool   `json:"IsActive"`
}

type CreateUserResponse struct {
	Id        int32     `json:"Id"`
	LastName  string    `json:"LastName"`
	FirstName string    `json:"FirstName"`
	UserName  string    `json:"UserName"`
	Email     string    `json:"Email"`
	CreatedAt time.Time `json:"CreatedAt"`
}

type LoginRequest struct {
	Identifier string `json:"Identifier"`
	Password   string `json:"Password"`
}

type LoginResponse struct {
	Token       string    `json:"Token"`       // JWT токен
	Id          int32     `json:"Id"`          // Хэрэглэгчийн ID
	LastName    string    `json:"LastName"`    // Хэрэглэгчийн овог
	FirstName   string    `json:"FirstName"`   // Хэрэглэгчийн нэр
	UserName    string    `json:"UserName"`    // Username
	Email       string    `json:"Email"`       // И-мэйл
	IsAdmin     bool      `json:"IsAdmin"`     // Админ эрхтэй эсэх
	IsUser      bool      `json:"IsUser"`      // Хэрэглэгч эрхтэй эсэх
	IsReception bool      `json:"IsReception"` // Receptionist эрхтэй эсэх
	IsFinance   bool      `json:"IsFinance"`   // Finance эрхтэй эсэх
	CreatedAt   time.Time `json:"CreatedAt"`   // Хэрэглэгч үүссэн огноо
}

type UpdateEmail struct {
	ID    int32  `json:"Id" validate:"required"`
	Email string `json:"email" validate:"required,email"`
}

type UpdatePassword struct {
	ID              int32  `json:"id" validate:"required"`
	NewPassword     string `json:"NewPassword" validate:"required"`
	ConfirmPassword string `json:"ConfirmPassword" validate:"required"`
}
