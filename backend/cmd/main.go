package main

import (
	"event-trigger/internal/cache"
	"event-trigger/internal/database"
	"event-trigger/internal/handlers"
	"event-trigger/internal/services"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize Database and Cache
	db := database.InitDB()
	cacheManager := cache.NewCacheManager()

	// Initialize Services and Handlers
	triggerService := services.NewTriggerService(db, cacheManager)
	triggerHandler := handlers.NewTriggerHandler(triggerService)

	// Setup Router
	r := gin.Default()

	// CORS configuration
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:3000"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	corsConfig.ExposeHeaders = []string{"Content-Length"}
	corsConfig.AllowCredentials = true
	corsConfig.MaxAge = 12 * time.Hour

	r.Use(cors.New(corsConfig))

	// API Group
	api := r.Group("/api/v1")
	{
		api.GET("/triggers", triggerHandler.ListTriggers)
		api.POST("/triggers", triggerHandler.CreateTrigger)
		api.GET("/triggers/:id/logs", triggerHandler.GetTriggerLogs)
		api.POST("/triggers/test", triggerHandler.TestTrigger)
		api.DELETE("/triggers/:id", triggerHandler.DeleteTrigger)
		api.POST("/triggers/:id/execute", triggerHandler.ExecuteTrigger)
		api.POST("/triggers/schedule", triggerHandler.ScheduleTrigger)
		api.GET("/events", triggerHandler.ListEvents)
	}

	// Add health check route
	r.GET("/health", handlers.HealthCheck)

	log.Println("🚀 Server running on http://localhost:8080")
	log.Fatal(r.Run(":8080"))
}
