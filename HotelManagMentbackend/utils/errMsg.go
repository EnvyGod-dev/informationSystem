package utils

import (
	"database/sql"
	"regexp"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/exp/slog"
)

func CustomOverErrMsg(ctx *fiber.Ctx, err error) error {
	// check error is fiber error
	if e, ok := err.(*fiber.Error); ok {
		// Return the Fiber error as JSON
		return ctx.Status(e.Code).JSON(fiber.Map{
			"error": e.Message,
		})
	}

	// For other errors, return a generic JSON error
	return ctx.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
		"error": "Unprocessable",
	})
}

func ErrMsg(err error) *fiber.Error {
	if err == sql.ErrNoRows {
		return fiber.NewError(fiber.StatusNotFound, "өгөгдөл олдсонгүй")
	}

	pattern := `SQLSTATE (\d{5})`

	re := regexp.MustCompile(pattern)
	match := re.FindStringSubmatch(err.Error())

	if len(match) == 2 {
		sqlState := match[1]

		switch sqlState {
		case "23502":
			return fiber.NewError(fiber.StatusUnprocessableEntity, "Хоосон утга оруулах боломжгүй")
		case "23503":
			return fiber.NewError(fiber.StatusUnprocessableEntity, "Холбоотой мэдээлэл буруу байна")
		case "23505":
			return fiber.NewError(fiber.StatusUnprocessableEntity, "Мэдээлэл давхардаж байна")
		case "23514":
			return fiber.NewError(fiber.StatusUnprocessableEntity, "Мэдээллийн утга буруу байна")
		case "22001":
			return fiber.NewError(fiber.StatusUnprocessableEntity, "Оруулсан мэдээлэл хэтэрхий урт байна")
		default:
			return fiber.NewError(fiber.StatusUnprocessableEntity, "Мэдээллийн утга буруу байна")
		}
	}

	return fiber.NewError(fiber.StatusUnprocessableEntity, "Алдаа гарлаа")
}

func CustomErrMsg(msg string) error {
	return fiber.NewError(fiber.StatusUnprocessableEntity, msg)
}

func CustomAuthErrMsg(msg string) error {
	return fiber.NewError(fiber.StatusUnauthorized, msg)
}
func ForbiddenErrMsg(msg string) *fiber.Error {
	return fiber.NewError(fiber.StatusForbidden, msg)
}
func ValidationErrMsg(err error) error {
	s := ""
	slog.Info("asad", slog.Any("msg", err))
	for _, err := range err.(validator.ValidationErrors) {
		if err.Tag() == "required" {
			s = err.Field() + " хоосон байна" + ", " + s
		}

		if err.Tag() == "oneof" {
			s = err.Field() + " буруу байна" + ", " + s
		}

	}

	if len(s) > 0 {
		s = s[:len(s)-2]
	}

	return fiber.NewError(fiber.StatusBadRequest, s)
}
