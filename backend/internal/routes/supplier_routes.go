package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/korbisch/supply-stack/internal/handlers"
)

func SetupSupplierRoutes(router *gin.RouterGroup, handler *handlers.SupplierHandler) {
	suppliers := router.Group("/suppliers")
	{
		suppliers.POST("", handler.CreateSupplier)
		suppliers.GET("", handler.GetAllSuppliers)
		suppliers.GET("/search", handler.SearchSuppliers)
		suppliers.GET("/:id", handler.GetSupplier)
		suppliers.PUT("/:id", handler.UpdateSupplier)
		suppliers.DELETE("/:id", handler.DeleteSupplier)
	}
}
