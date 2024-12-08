package routes

import (
	"namuunzul/handlers"

	"github.com/gofiber/fiber/v2"
)

func adminRoutes(app *fiber.App, hd *handlers.Handlers) {
	api := app.Group("/api/v1")

	auth := api.Group("/auth")
	auth.Post("/register", hd.CreateUser)
	auth.Post("/login", hd.LoginRqst)

	user := api.Group("/user", hd.RoleMiddleware("admin")) // RoleMiddleware ашиглаж байна
	user.Get("/", hd.GetListUser)
	user.Patch("/email", hd.UpdateEmail)
	user.Patch("/password", hd.UpdatePassword)
	user.Get("/admin", hd.GetListAdmin)
	user.Delete("/delete/:id", hd.DeleteUser)
	user.Get("/hpr", hd.GetListHouseKeeper)

}
func userRoutes(app *fiber.App, hd *handlers.Handlers) {}
