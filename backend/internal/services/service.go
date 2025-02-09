package services

import (
	"context"
	"event-trigger/internal/cache"
	"event-trigger/internal/models"
	"fmt"
	"time"

	"github.com/robfig/cron/v3"
	"gorm.io/gorm"
)

type TriggerService struct {
	db    *gorm.DB
	cache *cache.CacheManager
	cron  *cron.Cron
	ctx   context.Context
}

func NewTriggerService(db *gorm.DB, cache *cache.CacheManager) *TriggerService {
	ctx := context.Background()
	c := cron.New()
	c.Start()

	return &TriggerService{
		db:    db,
		cache: cache,
		cron:  c,
		ctx:   ctx,
	}
}

// CreateTrigger creates a new trigger
func (s *TriggerService) CreateTrigger(trigger *models.Trigger) error {
	result := s.db.Create(trigger)
	if result.Error != nil {
		return result.Error
	}

	// If it's a scheduled trigger, set up the cron job
	if trigger.Type == models.ScheduledTrigger && trigger.Schedule != "" {
		return s.ScheduleTrigger(trigger)
	}

	return nil
}

// GetTrigger retrieves a trigger by ID
func (s *TriggerService) GetTrigger(id uint) (*models.Trigger, error) {
	var trigger models.Trigger
	if err := s.db.First(&trigger, id).Error; err != nil {
		return nil, err
	}
	return &trigger, nil
}

// GetRecentLogs retrieves logs from the last 2 hours
func (s *TriggerService) GetRecentLogs(triggerID uint) ([]models.EventLog, error) {
	var logs []models.EventLog
	twoHoursAgo := time.Now().Add(-2 * time.Hour)

	// Try cache first
	cacheKey := fmt.Sprintf("trigger_logs:%d", triggerID)
	err := s.cache.Get(s.ctx, cacheKey, &logs)
	if err == nil {
		return logs, nil
	}

	// If not in cache, get from database
	err = s.db.Where("trigger_id = ? AND executed_at > ? AND is_archived = false",
		triggerID, twoHoursAgo).Find(&logs).Error
	if err != nil {
		return nil, err
	}

	// Cache the results
	s.cache.Set(s.ctx, cacheKey, logs, 5*time.Minute)
	return logs, nil
}

// TestTrigger tests a trigger without saving it
func (s *TriggerService) TestTrigger(trigger *models.Trigger) error {
	log := models.EventLog{
		TriggerID:  trigger.ID,
		Status:     "test_executed",
		ExecutedAt: time.Now(),
	}
	return s.db.Create(&log).Error
}

// ExecuteTrigger executes a trigger by ID
func (s *TriggerService) ExecuteTrigger(triggerID uint) error {
	trigger, err := s.GetTrigger(triggerID)
	if err != nil {
		return err
	}

	log := models.EventLog{
		TriggerID:  trigger.ID,
		Status:     "executed",
		ExecutedAt: time.Now(),
	}

	// Cache the execution log
	cacheKey := fmt.Sprintf("trigger_log:%d:%s", trigger.ID, time.Now().Format("2006-01-02"))
	s.cache.Set(s.ctx, cacheKey, log, 48*time.Hour)

	return s.db.Create(&log).Error
}

// ScheduleTrigger sets up a cron job for a scheduled trigger
func (s *TriggerService) ScheduleTrigger(trigger *models.Trigger) error {
	if trigger.Type != models.ScheduledTrigger {
		return fmt.Errorf("trigger type must be scheduled")
	}

	_, err := s.cron.AddFunc(trigger.Schedule, func() {
		s.ExecuteTrigger(trigger.ID)
	})

	return err
}

// CleanupOldLogs archives logs older than 2 hours and deletes logs older than 48 hours
func (s *TriggerService) CleanupOldLogs() error {
	twoHoursAgo := time.Now().Add(-2 * time.Hour)
	fortyEightHoursAgo := time.Now().Add(-48 * time.Hour)

	// Archive logs older than 2 hours
	if err := s.db.Model(&models.EventLog{}).
		Where("executed_at < ? AND is_archived = false", twoHoursAgo).
		Update("is_archived", true).Error; err != nil {
		return err
	}

	// Delete logs older than 48 hours
	return s.db.Delete(&models.EventLog{}, "executed_at < ?", fortyEightHoursAgo).Error
}

// ListTriggers retrieves all triggers
func (s *TriggerService) ListTriggers() ([]models.Trigger, error) {
	var triggers []models.Trigger
	if err := s.db.Find(&triggers).Error; err != nil {
		return nil, err
	}
	return triggers, nil
}

// ListEvents retrieves all events/logs with optional archive filter
func (s *TriggerService) ListEvents(archived bool) ([]models.EventLog, error) {
	var logs []models.EventLog
	query := s.db.Order("executed_at desc")

	if !archived {
		query = query.Where("is_archived = ?", false)
	}

	if err := query.Find(&logs).Error; err != nil {
		return nil, err
	}
	return logs, nil
}

func (s *TriggerService) DeleteTrigger(id uint) error {
	// Check if trigger exists
	trigger := &models.Trigger{}
	if err := s.db.First(trigger, id).Error; err != nil {
		return err
	}

	// Delete the trigger
	return s.db.Delete(trigger).Error
}
