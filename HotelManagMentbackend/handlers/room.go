package handlers

import (
	"log/slog"
	db "namuunzul/db/sqlc"
	"namuunzul/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// CreateRoom - Шинэ өрөө үүсгэх
func (hd *Handlers) CreateRoom(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst models.Room
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	priceStr := strconv.FormatFloat(rqst.Price, 'f', -1, 64)
	// Өрөөг үүсгэх
	room, err := queries.CreateRoom(ctx.Context(), db.CreateRoomParams{
		HotelID:     rqst.HotelId,
		RoomType:    rqst.RoomType,
		Price:       priceStr,
		IsAvailable: rqst.IsAvailable,
		RoomImg:     rqst.RoomImg,
	})
	if err != nil {
		slog.Error("unable to create room", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to create room"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(room)
}

// GetRoomsByHotelID - Зочид буудлын ID-гаар өрөөнүүдийг авах
func (hd *Handlers) GetRoomsByHotelID(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Query параметрээс буудлын ID авах
	hotelID, err := ctx.ParamsInt("hotelID")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid hotel ID"})
	}

	// Өрөөнүүдийг татах
	rooms, err := queries.GetRoomsByHotelID(ctx.Context(), int32(hotelID))
	if err != nil {
		slog.Error("unable to retrieve rooms by hotel ID", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve rooms"})
	}

	return ctx.Status(fiber.StatusOK).JSON(rooms)
}

// GetAllRoomsWithHotels - Бүх өрөө, тэдгээрийн буудлуудын мэдээллийг авах
func (hd *Handlers) GetAllRoomsWithHotels(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Өрөөнүүдийг татах
	rooms, err := queries.GetAllRoomsWithHotels(ctx.Context())
	if err != nil {
		slog.Error("unable to retrieve all rooms with hotels", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve rooms with hotels"})
	}

	return ctx.Status(fiber.StatusOK).JSON(rooms)
}

// UpdateByHotelPrice - Өрөөний үнийг шинэчлэх
func (hd *Handlers) UpdateByHotelPrice(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		ID    int32   `json:"id"`
		Price float64 `json:"price"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	priceStr := strconv.FormatFloat(rqst.Price, 'f', -1, 64)
	// Үнэ шинэчлэх
	err := queries.UpdateByHotelPrice(ctx.Context(), db.UpdateByHotelPriceParams{
		ID:    rqst.ID,
		Price: priceStr,
	})
	if err != nil {
		slog.Error("unable to update room price", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update room price"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Room price updated successfully"})
}

// UpdateByRoomType - Өрөөний төрлийг шинэчлэх
func (hd *Handlers) UpdateByRoomType(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		ID       int32  `json:"id"`
		RoomType string `json:"roomType"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Өрөөний төрлийг шинэчлэх
	err := queries.UpdateByRoomType(ctx.Context(), db.UpdateByRoomTypeParams{
		ID:       rqst.ID,
		RoomType: rqst.RoomType,
	})
	if err != nil {
		slog.Error("unable to update room type", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update room type"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Room type updated successfully"})
}
