package handlers

import (
	"log/slog"
	db "namuunzul/db/sqlc"
	"namuunzul/models"

	"github.com/gofiber/fiber/v2"
)

// CreateRole - Role үүсгэх
func (hd *Handlers) CreateRole(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst models.Role
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Role үүсгэх
	role, err := queries.CreateRole(ctx.Context(), db.CreateRoleParams{
		RoleName:    rqst.RoleName,
		Description: rqst.Description,
	})
	if err != nil {
		slog.Error("unable to create role", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to create role"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(role)
}

// GetRoles - Бүх Role-уудыг авах
func (hd *Handlers) GetRoles(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Бүх Role-уудыг авах
	roles, err := queries.GetRoles(ctx.Context())
	if err != nil {
		slog.Error("unable to retrieve roles", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve roles"})
	}

	return ctx.Status(fiber.StatusOK).JSON(roles)
}

// UpdateRole - Role шинэчлэх
func (hd *Handlers) UpdateRole(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst models.Role
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Role шинэчлэх
	err := queries.UpdateRole(ctx.Context(), db.UpdateRoleParams{
		ID:          rqst.Id,
		RoleName:    rqst.RoleName,
		Description: rqst.Description,
	})
	if err != nil {
		slog.Error("unable to update role", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update role"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Role updated successfully"})
}

// DeleteRole - Role устгах
func (hd *Handlers) DeleteRole(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// URL-аас Role ID авах
	roleID, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid role ID"})
	}

	// Role устгах
	err = queries.DeleteRole(ctx.Context(), int32(roleID))
	if err != nil {
		slog.Error("unable to delete role", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to delete role"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Role deleted successfully"})
}
