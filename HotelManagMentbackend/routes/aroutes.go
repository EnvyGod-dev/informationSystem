package routes

import (
	"namuunzul/handlers"

	"github.com/gofiber/fiber/v2"
)

func adminRoutes(app *fiber.App, hd *handlers.Handlers) {
	api := app.Group("/api/v1")

	// Authentication Routes
	auth := api.Group("/auth")
	auth.Post("/register", hd.CreateUser)
	auth.Post("/login", hd.LoginRqst)

	// User Management Routes
	user := api.Group("/user", hd.RoleMiddleware("admin")) // Зөвхөн админд зориулсан
	user.Get("/", hd.GetListUser)
	user.Patch("/email", hd.UpdateEmail)
	user.Patch("/password", hd.UpdatePassword)
	user.Get("/admin", hd.GetListAdmin)
	user.Delete("/delete/:id", hd.DeleteUser)
	user.Get("/hpr", hd.GetListHouseKeeper)

	// Hotel Management Routes
	hotel := api.Group("/hotel", hd.RoleMiddleware("admin")) // Зөвхөн админд зориулсан
	hotel.Post("/", hd.CreateHotel)
	hotel.Get("/", hd.GetListHotel)
	hotel.Get("/ratings", hd.GetListRating)
	hotel.Get("/search", hd.FindByHotelName)
	hotel.Patch("/rating", hd.UpdateByRating)
	hotel.Patch("/name", hd.UpdateByName)
	hotel.Patch("/address", hd.UpdateByAddress)
	hotel.Delete("/delete/:id", hd.DeleteFromHotelID)

	// Room Management Routes
	room := api.Group("/rooms", hd.RoleMiddleware("admin")) // Зөвхөн админд зориулсан
	room.Post("/", hd.CreateRoom)
	room.Get("/hotel/:hotelID", hd.GetRoomsByHotelID)
	room.Get("/", hd.GetAllRoomsWithHotels)
	room.Patch("/price", hd.UpdateByHotelPrice)
	room.Patch("/type", hd.UpdateByRoomType)

	// Booking Management Routes
	booking := api.Group("/booking", hd.RoleMiddleware("admin")) // Зөвхөн админд зориулсан
	booking.Get("/search", hd.SearchBookingsByDateAndPrice)      // Хугацаа болон үнийн дагуу хайлт
	booking.Get("/", hd.GetListBooking)

	// Payment Management Routes
	payment := api.Group("/payment", hd.RoleMiddleware("admin")) // Зөвхөн админд зориулсан
	payment.Post("/", hd.CreatePayment)                          // Төлбөр үүсгэх
	payment.Get("/", hd.GetPayments)                             // Бүх төлбөрүүдийг харах
	payment.Patch("/status", hd.UpdatePaymentStatus)             // Төлбөрийн статус шинэчлэх
	payment.Get("/detailed", hd.GetDetailedPayments)             // Төлбөрүүдийг дэлгэрэнгүй харах
	payment.Delete("/delete/:id", hd.DeletePayment)

}

func userRoutes(app *fiber.App, hd *handlers.Handlers) {
	api := app.Group("/api/v1/customer")

	// Room Viewing Routes (for all users)
	room := api.Group("/rooms")
	room.Get("/", hd.GetAllRoomsWithHotels)           // Бүх өрөөг харах
	room.Get("/hotel/:hotelID", hd.GetRoomsByHotelID) // Буудалд хамаарах өрөөг харах

	// Hotel Viewing Routes (for all users)
	hotel := api.Group("/hotel")
	hotel.Get("/", hd.GetListHotel)          // Бүх зочид буудлыг харах
	hotel.Get("/ratings", hd.GetListRating)  // Буудлуудыг үнэлгээгээр эрэмбэлэх
	hotel.Get("/search", hd.FindByHotelName) // Буудлыг нэрээр хайх

	// Booking Routes for Users
	booking := api.Group("/booking")             // Зөвхөн нэвтэрсэн хэрэглэгчдэд зориулсан
	booking.Post("/", hd.UserCreateBooking)      // Хэрэглэгч захиалга үүсгэх
	booking.Get("/:Id", hd.GetUserBookings)      // Хэрэглэгч өөрийнхөө захиалгыг харах
	booking.Delete("/:id", hd.DeleteUserBooking) // Хэрэглэгч өөрийнхөө захиалгыг устгах
	booking.Patch("/", hd.UpdateBooking)         // Захиалга шинэчлэх

	payment := api.Group("/payment")        // Хэрэглэгч зөвхөн өөрийн эрхээр нэвтэрнэ
	payment.Post("/", hd.CreateUserPayment) // Төлбөр үүсгэх
	payment.Get("/", hd.GetUserPayments)    // Өөрийн төлбөрүүдийг харах

}
