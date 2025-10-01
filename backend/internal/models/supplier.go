package models

import (
	"time"

	"gorm.io/gorm"
)

type Supplier struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `gorm:"not null;index" json:"name" binding:"required"`
	Code        string         `gorm:"uniqueIndex;not null" json:"code" binding:"required"`
	Email       string         `gorm:"not null" json:"email" binding:"required,email"`
	Phone       string         `json:"phone"`
	Address     string         `json:"address"`
	City        string         `json:"city"`
	Country     string         `json:"country"`
	PostalCode  string         `json:"postal_code"`
	ContactName string         `json:"contact_name"`
	Rating      float32        `gorm:"type:decimal(3,2);default:0" json:"rating"`
	Status      string         `gorm:"type:varchar(20);default:'active'" json:"status"` // active, inactive, suspended
	Notes       string         `gorm:"type:text" json:"notes"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Supplier) TableName() string {
	return "suppliers"
}
