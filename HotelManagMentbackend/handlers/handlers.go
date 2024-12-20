// Code generated by Bilguun. DO NOT EDIT.
// versions:
//
//	Namuunzul v1.27.0
package handlers

import (
	"database/sql"
	"strings"

	db "namuunzul/db/sqlc"

	"namuunzul/conf"
	"namuunzul/utils/secure"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type Handlers struct {
	c     *conf.Config      // Системийн тохиргоо
	pgsql *sql.DB           // PostgreSQL өгөгдлийн сангийн холболт
	kp    *secure.RsaKey    // RSA түлхүүрүүд
}


var validate = validator.New()

func NewHandlers(c *conf.Config, pgsql *sql.DB, kp *secure.RsaKey) *Handlers {
	return &Handlers{c: c, pgsql: pgsql, kp: kp}
}


func (hd *Handlers) queries() (*db.Queries, *sql.DB, *secure.RsaKey) {
	queries := db.New(hd.pgsql)
	return queries, hd.pgsql, hd.kp
}



func (hd *Handlers) AuthMiddleware(ctx *fiber.Ctx) error {
	// HTTP header-аас Authorization токеныг авах
	tokenStr := ctx.Get("Authorization")
	if tokenStr == "" {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Missing token"})
	}

	// RSA Public Key ашиглан токеныг баталгаажуулах
	claims, err := secure.VerifyToken(tokenStr, hd.kp)
	if err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Invalid token"})
	}

	// Role-д суурилсан хандалтын хяналт
	if !claims.IsAdmin && !claims.IsReception { // Зөвхөн Admin болон Receptionist эрхтэй хэрэглэгчдийг зөвшөөрнө
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{"err": "Access denied"})
	}

	// Хэрэглэгчийн мэдээллийг Locals-д хадгалах
	ctx.Locals("user", claims)
	return ctx.Next() // Middleware-ийн дараах үйлдлүүдийг гүйцэтгэх
}

func (hd *Handlers) RoleMiddleware(allowedRoles ...string) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		// Authorization header-аас токен авах
		tokenStr := ctx.Get("Authorization")
		if tokenStr == "" {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Missing token"})
		}

		// "Bearer " хэсгийг хасах
		tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")

		// Токен баталгаажуулах
		claims, err := secure.VerifyToken(tokenStr, hd.kp)
		if err != nil {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Invalid token"})
		}

		// Role шалгах
		isAllowed := false
		for _, role := range allowedRoles {
			switch role {
			case "admin":
				if claims.IsAdmin {
					isAllowed = true
				}
			case "user":
				if claims.IsUser {
					isAllowed = true
				}
			case "reception":
				if claims.IsReception {
					isAllowed = true
				}
			case "finance":
				if claims.IsFinance {
					isAllowed = true
				}
			}
		}

		if !isAllowed {
			return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{"err": "Access denied"})
		}

		// Токен баталгаажсан бол үргэлжлүүлнэ
		return ctx.Next()
	}
}
