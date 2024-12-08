package handlers

import (
	"log/slog"
	db "namuunzul/db/sqlc"
	"time"

	"github.com/gofiber/fiber/v2"
)

// CreateService - Өрөөний үйлчилгээний захиалга үүсгэх
func (hd *Handlers) CreateService(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		RoomID      int32  `json:"RoomID"`
		Description string `json:"Description"`
		Status      string `json:"Status"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Захиалга үүсгэх
	service, err := queries.CreateService(ctx.Context(), db.CreateServiceParams{
		RoomID:      rqst.RoomID,
		Description: rqst.Description,
		RequestedAt: time.Now().UTC(),
		Status:      rqst.Status,
	})
	if err != nil {
		slog.Error("unable to create service", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to create service"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(service)
}

// GetServicesByRoomID - Тодорхой өрөөний үйлчилгээний захиалгуудыг авах
func (hd *Handlers) GetServicesByRoomID(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// RoomID авах
	roomID, err := ctx.ParamsInt("roomID")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid room ID"})
	}

	// Үйлчилгээний захиалгыг авах
	services, err := queries.GetServicesByRoomID(ctx.Context(), int32(roomID))
	if err != nil {
		slog.Error("unable to retrieve services", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve services"})
	}

	return ctx.Status(fiber.StatusOK).JSON(services)
}

// UpdateServiceStatus - Үйлчилгээний захиалгын статус шинэчлэх
func (hd *Handlers) UpdateServiceStatus(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		ID     int32  `json:"ID"`
		Status string `json:"Status"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Захиалгын статус шинэчлэх
	err := queries.UpdateStatus(ctx.Context(), db.UpdateStatusParams{
		ID:     rqst.ID,
		Status: rqst.Status,
	})
	if err != nil {
		slog.Error("unable to update service status", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update service status"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Service status updated successfully"})
}
