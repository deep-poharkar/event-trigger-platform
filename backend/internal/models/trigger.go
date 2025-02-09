package models

import (
	"time"

	"gorm.io/gorm"
)

type TriggerType string

const (
	ScheduledTrigger TriggerType = "scheduled"
	APITrigger       TriggerType = "api"
)

type Trigger struct {
	gorm.Model
	Type     TriggerType `json:"type"`
	Name     string      `json:"name"`
	Schedule string      `json:"schedule,omitempty"`
	Endpoint string      `json:"endpoint,omitempty"`
	IsActive bool        `json:"is_active" gorm:"default:true"`
}

type EventLog struct {
	gorm.Model
	TriggerID  uint      `json:"trigger_id"`
	Status     string    `json:"status"`
	Payload    string    `json:"payload,omitempty"`
	IsArchived bool      `json:"is_archived" gorm:"default:false"`
	ExecutedAt time.Time `json:"executed_at"`
}
