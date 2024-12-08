package handlers

import (
	"log/slog"
	db "namuunzul/db/sqlc"
	"namuunzul/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// CreateHotel - Зочид буудал үүсгэх
func (hd *Handlers) CreateHotel(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst models.Hotel
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Үнэлгээг string руу хөрвүүлэх
	ratingStr := strconv.FormatFloat(rqst.Rating, 'f', -1, 64)

	// Зочид буудал үүсгэх
	hotel, err := queries.CreateHotel(ctx.Context(), db.CreateHotelParams{
		Name:    rqst.Name,
		Address: rqst.Address,
		City:    rqst.City,
		Rating:  ratingStr,
	})
	if err != nil {
		slog.Error("unable to create hotel", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to create hotel"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(hotel)
}

// GetListHotel - Бүх зочид буудлын жагсаалт
func (hd *Handlers) GetListHotel(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Жагсаалт татах
	hotels, err := queries.GetListHotel(ctx.Context())
	if err != nil {
		slog.Error("unable to retrieve hotels", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve hotels"})
	}

	return ctx.Status(fiber.StatusOK).JSON(hotels)
}

// GetListRating - Үнэлгээгээр эрэмбэлсэн жагсаалт
func (hd *Handlers) GetListRating(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Жагсаалт татах
	hotels, err := queries.GetListRating(ctx.Context())
	if err != nil {
		slog.Error("unable to retrieve hotels by rating", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve hotels by rating"})
	}

	return ctx.Status(fiber.StatusOK).JSON(hotels)
}

// FindByHotelName - Зочид буудлыг нэрээр хайх
func (hd *Handlers) FindByHotelName(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Query параметрээс нэр авах
	hotelName := ctx.Query("name")
	if hotelName == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Hotel name is required"})
	}

	// Хайлт хийх
	hotel, err := queries.FindByHotelName(ctx.Context(), hotelName)
	if err != nil {
		slog.Error("unable to find hotel", slog.Any("err", err))
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"err": "Hotel not found"})
	}

	return ctx.Status(fiber.StatusOK).JSON(hotel)
}

// UpdateByRating - Зочид буудлын үнэлгээг шинэчлэх
func (hd *Handlers) UpdateByRating(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		ID     int32   `json:"id"`
		Rating float64 `json:"rating"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Үнэлгээг string руу хөрвүүлэх
	ratingStr := strconv.FormatFloat(rqst.Rating, 'f', -1, 64)

	// Үнэлгээг шинэчлэх
	err := queries.UpdateByRating(ctx.Context(), db.UpdateByRatingParams{
		ID:     rqst.ID,
		Rating: ratingStr,
	})
	if err != nil {
		slog.Error("unable to update hotel rating", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update hotel rating"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Hotel rating updated successfully"})
}

// UpdateByName - Зочид буудлын нэрийг шинэчлэх
func (hd *Handlers) UpdateByName(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		ID   int32  `json:"id"`
		Name string `json:"name"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Нэрийг шинэчлэх
	err := queries.UpdateByName(ctx.Context(), db.UpdateByNameParams{
		ID:   rqst.ID,
		Name: rqst.Name,
	})
	if err != nil {
		slog.Error("unable to update hotel name", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update hotel name"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Hotel name updated successfully"})
}

// UpdateByAddress - Зочид буудлын хаягийг шинэчлэх
func (hd *Handlers) UpdateByAddress(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		ID      int32  `json:"id"`
		Address string `json:"address"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Хаягийг шинэчлэх
	err := queries.UpdateByAddress(ctx.Context(), db.UpdateByAddressParams{
		ID:      rqst.ID,
		Address: rqst.Address,
	})
	if err != nil {
		slog.Error("unable to update hotel address", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update hotel address"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Hotel address updated successfully"})
}

// DeleteFromHotelID - Зочид буудлыг ID-гаар устгах
func (hd *Handlers) DeleteFromHotelID(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		ID int32 `json:"id"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Зочид буудлыг устгах
	err := queries.DeleteFromHotelID(ctx.Context(), rqst.ID)
	if err != nil {
		slog.Error("unable to delete hotel", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to delete hotel"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Hotel deleted successfully"})
}
