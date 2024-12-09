package handlers

import (
	"log/slog"
	db "namuunzul/db/sqlc"
	"namuunzul/models"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

// CreateBooking - Шинэ захиалга үүсгэх
func (hd *Handlers) CreateBooking(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst models.CreateBookingRequest
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	totalPriceStr := strconv.FormatFloat(rqst.TotalPrice, 'f', -1, 64)
	// Захиалга үүсгэх
	booking, err := queries.CreateBooking(ctx.Context(), db.CreateBookingParams{
		UserID:     rqst.UserID,
		RoomID:     rqst.RoomID,
		StartDate:  rqst.StartDate,
		EndDate:    rqst.EndDate,
		TotalPrice: totalPriceStr,
		Status:     rqst.Status,
	})
	if err != nil {
		slog.Error("unable to create booking", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to create booking"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(booking)
}

// GetListBooking - Бүх захиалгуудыг авах
func (hd *Handlers) GetListBooking(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Захиалгуудыг авах
	bookings, err := queries.GetListBooking(ctx.Context())
	if err != nil {
		slog.Error("unable to retrieve bookings", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve bookings"})
	}

	return ctx.Status(fiber.StatusOK).JSON(bookings)
}

// UpdateBooking - Захиалгыг шинэчлэх
func (hd *Handlers) UpdateBooking(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst models.UpdateBookingRequest
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	totalPriceStr := strconv.FormatFloat(rqst.TotalPrice, 'f', -1, 64)
	// Захиалгыг шинэчлэх
	err := queries.UpdateBooking(ctx.Context(), db.UpdateBookingParams{
		ID:         rqst.ID,
		StartDate:  rqst.StartDate,
		EndDate:    rqst.EndDate,
		TotalPrice: totalPriceStr,
		Status:     rqst.Status,
	})
	if err != nil {
		slog.Error("unable to update booking", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update booking"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Booking updated successfully"})
}

// DeleteBooking - Захиалгыг устгах
func (hd *Handlers) DeleteBooking(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Захиалгын ID авах
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid booking ID"})
	}

	// Захиалгыг устгах
	err = queries.DeleteBooking(ctx.Context(), int32(id))
	if err != nil {
		slog.Error("unable to delete booking", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to delete booking"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Booking deleted successfully"})
}

// GetExpiredBookings - Дууссан хугацаатай захиалгуудыг авах
func (hd *Handlers) GetExpiredBookings(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Дууссан хугацаатай захиалгуудыг татах
	bookings, err := queries.GetExpiredBookings(ctx.Context())
	if err != nil {
		slog.Error("unable to retrieve expired bookings", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve expired bookings"})
	}

	return ctx.Status(fiber.StatusOK).JSON(bookings)
}

// GetActiveOrNewBookings - Идэвхтэй эсвэл шинэ захиалгуудыг авах
func (hd *Handlers) GetActiveOrNewBookings(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Идэвхтэй эсвэл шинэ захиалгуудыг татах
	bookings, err := queries.GetActiveOrNewBookings(ctx.Context())
	if err != nil {
		slog.Error("unable to retrieve active or new bookings", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve active or new bookings"})
	}

	return ctx.Status(fiber.StatusOK).JSON(bookings)
}

// SearchBookingsByDateAndPrice - Хугацаа болон үнийн дагуу захиалгуудыг хайх
func (hd *Handlers) SearchBookingsByDateAndPrice(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Query параметрээс утга авах
	minEndDateStr := ctx.Query("minEndDate")
	minPrice := ctx.QueryFloat("minPrice")

	// minEndDate-г time.Time руу хөрвүүлэх
	minEndDate, err := time.Parse("2006-01-02", minEndDateStr) // ISO 8601 форматаар хөрвүүлнэ
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid date format. Use YYYY-MM-DD."})
	}

	// minPrice-ийг string руу хөрвүүлэх
	minPriceStr := strconv.FormatFloat(minPrice, 'f', -1, 64)

	// Захиалгуудыг хайх
	bookings, err := queries.SearchBookingsByDateAndPrice(ctx.Context(), db.SearchBookingsByDateAndPriceParams{
		MinEndDate: minEndDate,
		MinPrice:   minPriceStr,
	})
	if err != nil {
		slog.Error("unable to search bookings", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to search bookings"})
	}

	return ctx.Status(fiber.StatusOK).JSON(bookings)
}

func (hd *Handlers) UserCreateBooking(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Token-аас хэрэглэгчийн ID-г авах
	// userID, err := secure.GetCurrentUserID(ctx)
	// if err != nil {
	// 	return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Invalid user token"})
	// }

	// Хүсэлтийг задлах
	var rqst models.CreateBookingRequest
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// UserID-г токеноос авах тул хүсэлтэд байгаа утгыг хүчингүй болгоно
	// rqst.UserID = userID

	totalPriceStr := strconv.FormatFloat(rqst.TotalPrice, 'f', -1, 64)
	// Захиалга үүсгэх
	booking, err := queries.CreateBooking(ctx.Context(), db.CreateBookingParams{
		UserID:     rqst.UserID,
		RoomID:     rqst.RoomID,
		StartDate:  rqst.StartDate,
		EndDate:    rqst.EndDate,
		TotalPrice: totalPriceStr,
		Status:     rqst.Status,
	})
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to create booking"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(booking)
}

func (hd *Handlers) GetUserBookings(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	UserIDCTX := ctx.Params("Id")
	UserID, err := strconv.Atoi(UserIDCTX)
	// // Token-аас хэрэглэгчийн ID-г авах
	// userID, err := secure.GetCurrentUserID(ctx)
	// if err != nil {
	// 	return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Invalid user token"})
	// }

	// Хэрэглэгчийн захиалгыг авах
	bookings, err := queries.GetUserBookings(ctx.Context(), int32(UserID))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve bookings"})
	}

	return ctx.Status(fiber.StatusOK).JSON(bookings)
}

func (hd *Handlers) DeleteUserBooking(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Token-аас хэрэглэгчийн ID-г авах
	// userID, err := secure.GetCurrentUserID(ctx)
	// if err != nil {
	// 	return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Invalid user token"})
	// }

	// Захиалгын ID-г авах
	bookingID, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid booking ID"})
	}

	// Захиалга устгах эрхийг шалгах
	err = queries.DeleteBookingIfOwner(ctx.Context(), db.DeleteBookingIfOwnerParams{
		ID:     int32(bookingID),
		UserID: int32(bookingID),
	})
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to delete booking"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Booking deleted successfully"})
}
