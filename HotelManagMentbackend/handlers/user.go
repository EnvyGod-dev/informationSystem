package handlers

import (
	"log/slog"
	db "namuunzul/db/sqlc"
	"namuunzul/models"
	"namuunzul/utils"
	"namuunzul/utils/secure"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func (hd *Handlers) CreateUser(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Body-оос хүсэлтийг задлах
	var rqst models.CreateUser
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"msg": "Invalid request"})
	}

	// Нууц үг хоёр удаа тохирч байгаа эсэхийг шалгах
	if rqst.IsHashedPassword != rqst.ConfirmPassword {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Passwords do not match"})
	}

	// Нууц үгийг хэшлэх
	pswd, err := utils.HashPassword(rqst.IsHashedPassword)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "cannot hash password"})
	}

	// Шинэ хэрэглэгч үүсгэх
	user, err := queries.CreateUser(ctx.Context(), db.CreateUserParams{
		LastName:         rqst.LastName,
		FirstName:        rqst.FirstName,
		UserName:         rqst.UserName,
		Email:            rqst.Email,
		IsHashedPassword: pswd,
		IsAdmin:          rqst.IsAdmin,
		IsUser:           rqst.IsUser,
		IsReception:      rqst.IsReception,
		IsFinance:        rqst.IsFinance,
		IsHouseKeeper:    rqst.IsHouseKeeper,
		IsActive:         rqst.IsActive,
	})
	if err != nil {
		slog.Error("unable to create user", slog.Any("err", err))
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "cannot create user"})
	}

	// Response илгээх
	response := models.CreateUserResponse{
		Id:        user.ID,
		LastName:  user.LastName,
		FirstName: user.FirstName,
		UserName:  user.UserName,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}

	return ctx.Status(fiber.StatusOK).JSON(response)
}

func (hd *Handlers) LoginRqst(ctx *fiber.Ctx) error {
	queries, _, kp := hd.queries()

	if kp == nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "RSA key is not initialized"})
	}

	// Body-оос хүсэлтийг задлах
	var rqst models.LoginRequest
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"msg": "Invalid request"})
	}

	// Хэрэглэгчийг username эсвэл email-аар хайх
	user, err := queries.GetUserName(ctx.Context(), rqst.Identifier)
	if err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Invalid username or email"})
	}

	// Нууц үгийг шалгах
	if !utils.CheckPassword(rqst.Password, user.IsHashedPassword) {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Invalid password"})
	}

	// Токен үүсгэх
	token, err := secure.IssueToken(
		user.ID,
		user.IsAdmin,
		user.IsUser,
		user.IsReception,
		user.IsFinance,
		kp, // RSA түлхүүрийг дамжуулна
	)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Could not generate token"})
	}

	// Амжилттай нэвтэрсэн хэрэглэгчийн мэдээллийг токентой хамт буцаах
	response := models.LoginResponse{
		Token:       token,
		Id:          user.ID,
		LastName:    user.LastName,
		FirstName:   user.FirstName,
		UserName:    user.UserName,
		Email:       user.Email,
		IsAdmin:     user.IsAdmin,
		IsUser:      user.IsUser,
		IsReception: user.IsReception,
		IsFinance:   user.IsFinance,
		CreatedAt:   user.CreatedAt,
	}

	return ctx.Status(fiber.StatusOK).JSON(response)
}

func (hd *Handlers) GetListUser(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	user, err := queries.GetListUser(ctx.Context())
	if err != nil {
		slog.Error("unable to fetched user", slog.Any("Err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err})
	}

	return ctx.Status(fiber.StatusOK).JSON(user)
}

func (hd *Handlers) UpdateEmail(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	var rqst models.UpdateEmail
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "invalid rqst body"})
	}

	// Өгөгдлийг баталгаажуулах
	if err := validate.Struct(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid input"})
	}

	// И-Мэйл шинэчлэх
	err := queries.UpdateUserEmail(ctx.Context(), db.UpdateUserEmailParams{
		ID:    rqst.ID,
		Email: rqst.Email,
	})
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update email"})
	}

	return ctx.JSON(fiber.Map{"msg": "Email updated successfully"})
}

func (hd *Handlers) UpdatePassword(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	var rqst models.UpdatePassword
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "invalid rqst body"})
	}

	// Өгөгдлийг баталгаажуулах
	if err := validate.Struct(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid input"})
	}

	// Нууц үг баталгаажуулах
	if rqst.NewPassword != rqst.ConfirmPassword {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Passwords do not match"})
	}

	// Нууц үгийг хэшлэх
	hashedPassword, err := utils.HashPassword(rqst.NewPassword)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to hash password"})
	}

	// Нууц үгийг шинэчлэх
	err = queries.UpdateUserPassword(ctx.Context(), db.UpdateUserPasswordParams{
		ID:               rqst.ID,
		IsHashedPassword: hashedPassword,
	})
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update password"})
	}

	return ctx.JSON(fiber.Map{"msg": "Password updated successfully"})
}

func (hd *Handlers) GetListAdmin(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	admin, err := queries.GetListAdmin(ctx.Context())
	if err != nil {
		slog.Error("unable to fetch admin", slog.Any("Err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err})
	}

	return ctx.Status(fiber.StatusOK).JSON(admin)
}

func (hd *Handlers) DeleteUser(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	DeleteUserIDSTR := ctx.Params("id")
	deleteUserId, err := strconv.Atoi(DeleteUserIDSTR)
	if err != nil {
		slog.Error("unable to parsing id", slog.Any("Err", err))
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": err})
	}

	_, err = queries.FindByUserId(ctx.Context(), int32(deleteUserId))
	if err != nil {
		slog.Error("unable to find ID", slog.Any("Err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err})
	}

	err = queries.DeleteUserByID(ctx.Context(), int32(deleteUserId))
	if err != nil {
		slog.Error("cannot delete user ID", slog.Any("Err", err))
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"ok": "Амжилттай усталаа"})
}

func (hd *Handlers) GetListHouseKeeper(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	hpr, err := queries.GetListHouseKeeper(ctx.Context())
	if err != nil {
		slog.Error("unable to fetched house keeper", slog.Any("Err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err})
	}

	return ctx.Status(fiber.StatusOK).JSON(hpr)
}
