package handlers

import (
	"errors"
	"event-trigger/internal/models"
	"event-trigger/internal/services"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// TriggerHandler structure
type TriggerHandler struct {
	service *services.TriggerService
}

// NewTriggerHandler creates a new instance of TriggerHandler
func NewTriggerHandler(service *services.TriggerService) *TriggerHandler {
	return &TriggerHandler{
		service: service,
	}
}

// CreateTrigger handles trigger creation
func (h *TriggerHandler) CreateTrigger(c *gin.Context) {
	var trigger models.Trigger
	if err := c.ShouldBindJSON(&trigger); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Basic validation
	if trigger.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "trigger name is required"})
		return
	}

	if err := h.service.CreateTrigger(&trigger); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, trigger)
}

// GetTriggerLogs handles retrieval of trigger logs
func (h *TriggerHandler) GetTriggerLogs(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid trigger ID"})
		return
	}

	logs, err := h.service.GetRecentLogs(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, logs)
}

// TestTrigger handles trigger testing
func (h *TriggerHandler) TestTrigger(c *gin.Context) {
	var trigger models.Trigger
	if err := c.ShouldBindJSON(&trigger); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.TestTrigger(&trigger); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Trigger tested successfully"})
}

// ExecuteTrigger handles manual trigger execution
func (h *TriggerHandler) ExecuteTrigger(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid trigger ID"})
		return
	}

	if err := h.service.ExecuteTrigger(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Trigger executed successfully"})
}

// ScheduleTrigger handles scheduling of triggers
func (h *TriggerHandler) ScheduleTrigger(c *gin.Context) {
	var trigger models.Trigger
	if err := c.ShouldBindJSON(&trigger); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.ScheduleTrigger(&trigger); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Trigger scheduled successfully"})
}

// ListTriggers handles retrieval of all triggers
func (h *TriggerHandler) ListTriggers(c *gin.Context) {
	triggers, err := h.service.ListTriggers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, triggers)
}

// ListEvents handles retrieval of all events/logs
func (h *TriggerHandler) ListEvents(c *gin.Context) {
	archived := c.Query("archived") == "true"
	logs, err := h.service.ListEvents(archived)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, logs)
}

// DeleteTrigger handles trigger deletion
func (h *TriggerHandler) DeleteTrigger(c *gin.Context) {
	idStr := c.Param("id")
	if idStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing trigger ID"})
		return
	}

	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid trigger ID format: %v", err)})
		return
	}

	if err := h.service.DeleteTrigger(uint(id)); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Trigger not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Trigger deleted successfully"})
}
