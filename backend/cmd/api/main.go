package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/korbisch/supply-stack/internal/config"
	"github.com/korbisch/supply-stack/internal/database"
	"github.com/korbisch/supply-stack/internal/handlers"
	"github.com/korbisch/supply-stack/internal/repository"
	"github.com/korbisch/supply-stack/internal/routes"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	// Set Gin mode
	gin.SetMode(cfg.Server.GinMode)

	// Connect to database
	if err := database.Connect(&cfg.Database); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer func() {
		if err := database.Close(); err != nil {
			log.Fatal("Failed to close database connection", err)
		}
	}()

	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Initialize repositories
	supplierRepo := repository.NewSupplierRepository(database.GetDB())

	// Initialize handlers
	supplierHandler := handlers.NewSupplierHandler(supplierRepo)

	// Initialize Gin router
	router := gin.Default()

	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORS.AllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":   "ok",
			"service":  "supply-stack-api",
			"database": "connected",
		})
	})

	// API v1 group
	v1 := router.Group("/api/v1")
	{
		routes.SetupSupplierRoutes(v1, supplierHandler)
	}

	// Start server
	log.Printf("Server starting on port %s", cfg.Server.Port)
	if err := router.Run(":" + cfg.Server.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
