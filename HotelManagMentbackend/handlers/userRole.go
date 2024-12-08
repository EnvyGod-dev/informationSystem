package handlers

import (
	"log/slog"
	db "namuunzul/db/sqlc"

	"github.com/gofiber/fiber/v2"
)

// AssignRoleToUser - Хэрэглэгчид Role оноох
func (hd *Handlers) AssignRoleToUser(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		UserID int32 `json:"userID"`
		RoleID int32 `json:"roleID"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Role оноох
	role, err := queries.AssignRoleToUser(ctx.Context(), db.AssignRoleToUserParams{
		UserID: rqst.UserID,
		RoleID: rqst.RoleID,
	})
	if err != nil {
		slog.Error("unable to assign role", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to assign role"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(role)
}

// GetUserRoles - Хэрэглэгчийн Role-уудыг авах
func (hd *Handlers) GetUserRoles(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// URL-аас UserID авах
	userID, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid user ID"})
	}

	// Role-уудыг авах
	roles, err := queries.GetUserRoles(ctx.Context(), int32(userID))
	if err != nil {
		slog.Error("unable to retrieve roles", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve roles"})
	}

	return ctx.Status(fiber.StatusOK).JSON(roles)
}

// RemoveRoleFromUser - Хэрэглэгчээс Role хасах
func (hd *Handlers) RemoveRoleFromUser(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		UserID int32 `json:"userID"`
		RoleID int32 `json:"roleID"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Role хасах
	err := queries.RemoveRoleFromUser(ctx.Context(), db.RemoveRoleFromUserParams{
		UserID: rqst.UserID,
		RoleID: rqst.RoleID,
	})
	if err != nil {
		slog.Error("unable to remove role", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to remove role"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Role removed successfully"})
}

// GetAllUserRoles - Бүх хэрэглэгчдийн Role-уудыг авах
func (hd *Handlers) GetAllUserRoles(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Бүх хэрэглэгчдийн Role-уудыг авах
	userRoles, err := queries.GetAllUserRoles(ctx.Context())
	if err != nil {
		slog.Error("unable to retrieve all user roles", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve user roles"})
	}

	return ctx.Status(fiber.StatusOK).JSON(userRoles)
}
