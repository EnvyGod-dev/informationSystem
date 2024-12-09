package handlers

import (
	"log/slog"
	db "namuunzul/db/sqlc"
	"namuunzul/utils/secure"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

// CreatePayment - Төлбөр үүсгэх
func (hd *Handlers) CreatePayment(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		BookingID   int32   `json:"BookingID"`
		Amount      float64 `json:"Amount"`
		PaymentDate string  `json:"PaymentDate"`
		Status      string  `json:"Status"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// PaymentDate-г time.Time руу хөрвүүлэх
	paymentDate, err := time.Parse("2006-01-02", rqst.PaymentDate)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid date format. Use YYYY-MM-DD."})
	}

	amoutStr := strconv.FormatFloat(rqst.Amount, 'f', -1, 64)
	// Төлбөр үүсгэх
	payment, err := queries.CreatePayment(ctx.Context(), db.CreatePaymentParams{
		BookingID:   rqst.BookingID,
		Amount:      amoutStr,
		PaymentDate: paymentDate,
		Status:      rqst.Status,
	})
	if err != nil {
		slog.Error("unable to create payment", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to create payment"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(payment)
}

// GetPayments - Бүх төлбөрүүдийг харах
func (hd *Handlers) GetPayments(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Төлбөрүүдийг авах
	payments, err := queries.GetPayments(ctx.Context())
	if err != nil {
		slog.Error("unable to retrieve payments", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve payments"})
	}

	return ctx.Status(fiber.StatusOK).JSON(payments)
}

// UpdatePaymentStatus - Төлбөрийн статус шинэчлэх
func (hd *Handlers) UpdatePaymentStatus(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Хүсэлтийг задлах
	var rqst struct {
		ID     int32  `json:"ID"`
		Status string `json:"Status"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// Статус шинэчлэх
	err := queries.UpdatePaymentStatus(ctx.Context(), db.UpdatePaymentStatusParams{
		ID:     rqst.ID,
		Status: rqst.Status,
	})
	if err != nil {
		slog.Error("unable to update payment status", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to update payment status"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "Payment status updated successfully"})
}

// GetDetailedPayments - Төлбөрүүдийг дэлгэрэнгүй харах
func (hd *Handlers) GetDetailedPayments(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Төлбөрүүдийг дэлгэрэнгүй харах
	payments, err := queries.GetDetailedPayments(ctx.Context())
	if err != nil {
		slog.Error("unable to retrieve detailed payments", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve detailed payments"})
	}

	return ctx.Status(fiber.StatusOK).JSON(payments)
}

func (hd *Handlers) CreateUserPayment(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Context-аас хэрэглэгчийн ID-г авах
	_, err := secure.GetCurrentUserID(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Unauthorized"})
	}

	// Хүсэлтийг задлах
	var rqst struct {
		BookingID   int32   `json:"BookingID"`
		Amount      float64 `json:"Amount"`
		PaymentDate string  `json:"PaymentDate"`
		Status      string  `json:"Status"`
	}
	if err := ctx.BodyParser(&rqst); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid request body"})
	}

	// PaymentDate-г time.Time руу хөрвүүлэх
	paymentDate, err := time.Parse("2006-01-02", rqst.PaymentDate)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": "Invalid date format. Use YYYY-MM-DD."})
	}

	amoutStr := strconv.FormatFloat(rqst.Amount, 'f', -1, 64)
	// Төлбөр үүсгэх
	payment, err := queries.CreatePayment(ctx.Context(), db.CreatePaymentParams{
		BookingID:   rqst.BookingID,
		Amount:      amoutStr,
		PaymentDate: paymentDate,
		Status:      rqst.Status,
	})
	if err != nil {
		slog.Error("unable to create payment", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to create payment"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(payment)
}

// GetUserPayments - Хэрэглэгчийн өөрийн төлбөрүүдийг авах
func (hd *Handlers) GetUserPayments(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	// Context-аас хэрэглэгчийн ID-г авах
	userID, err := secure.GetCurrentUserID(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"err": "Unauthorized"})
	}

	// Хэрэглэгчийн төлбөрүүдийг авах
	payments, err := queries.GetUserPayments(ctx.Context(), userID)
	if err != nil {
		slog.Error("unable to retrieve user payments", slog.Any("err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": "Failed to retrieve payments"})
	}

	return ctx.Status(fiber.StatusOK).JSON(payments)
}

func (hd *Handlers) DeletePayment(ctx *fiber.Ctx) error {
	queries, _, _ := hd.queries()

	DeletePaymentIDSTR := ctx.Params("id")
	DeletePaymentID, err := strconv.Atoi(DeletePaymentIDSTR)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"err": err})
	}
	_, err = queries.FindByPaymentID(ctx.Context(), int32(DeletePaymentID))
	if err != nil {
		slog.Error("unable to find payment id", slog.Any("Err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err})
	}

	err = queries.DeletePaymentId(ctx.Context(), int32(DeletePaymentID))
	if err != nil {
		slog.Error("unable to delete payment", slog.Any("Err", err))
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"err": err})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "deleted successully"})
}
