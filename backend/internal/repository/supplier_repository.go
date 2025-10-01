package repository

import (
	"github.com/korbisch/supply-stack/internal/models"
	"gorm.io/gorm"
)

type SupplierRepository struct {
	db *gorm.DB
}

func NewSupplierRepository(db *gorm.DB) *SupplierRepository {
	return &SupplierRepository{db: db}
}

func (r *SupplierRepository) Create(supplier *models.Supplier) error {
	return r.db.Create(supplier).Error
}

func (r *SupplierRepository) GetByID(id uint) (*models.Supplier, error) {
	var supplier models.Supplier
	err := r.db.First(&supplier, id).Error
	if err != nil {
		return nil, err
	}
	return &supplier, nil
}

func (r *SupplierRepository) GetAll(page, pageSize int) ([]models.Supplier, int64, error) {
	var suppliers []models.Supplier
	var total int64

	// Count total records
	if err := r.db.Model(&models.Supplier{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset := (page - 1) * pageSize
	err := r.db.Offset(offset).Limit(pageSize).Order("created_at desc").Find(&suppliers).Error

	return suppliers, total, err
}

func (r *SupplierRepository) Update(supplier *models.Supplier) error {
	return r.db.Save(supplier).Error
}

func (r *SupplierRepository) Delete(id uint) error {
	return r.db.Delete(&models.Supplier{}, id).Error
}

func (r *SupplierRepository) Search(query string, page, pageSize int) ([]models.Supplier, int64, error) {
	var suppliers []models.Supplier
	var total int64

	searchPattern := "%" + query + "%"
	db := r.db.Where("name ILIKE ? OR code ILIKE ? OR email ILIKE ?", searchPattern, searchPattern, searchPattern)

	// Count total
	if err := db.Model(&models.Supplier{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get results
	offset := (page - 1) * pageSize
	err := db.Offset(offset).Limit(pageSize).Order("created_at desc").Find(&suppliers).Error

	return suppliers, total, err
}
