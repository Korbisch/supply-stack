import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Supplier, PaginationMeta } from '@/types/supplier'
import { supplierService } from '@/services/supplierService'

export const useSupplierStore = defineStore('supplier', () => {
  const suppliers = ref<Supplier[]>([])
  const currentSupplier = ref<Supplier | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationMeta>({
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 0,
  })

  async function fetchSuppliers(page = 1, pageSize = 10) {
    loading.value = true
    error.value = null
    try {
      const response = await supplierService.getAll(page, pageSize)
      suppliers.value = response.data
      pagination.value = response.pagination
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch suppliers'
      console.error('Error fetching suppliers:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchSupplier(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await supplierService.getById(id)
      currentSupplier.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch supplier'
      console.error('Error fetching supplier:', err)
    } finally {
      loading.value = false
    }
  }

  async function createSupplier(supplier: Supplier) {
    loading.value = true
    error.value = null
    try {
      const response = await supplierService.create(supplier)
      await fetchSuppliers(pagination.value.page, pagination.value.page_size)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to create supplier'
      console.error('Error creating supplier:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSupplier(id: number, supplier: Supplier) {
    loading.value = true
    error.value = null
    try {
      const response = await supplierService.update(id, supplier)
      await fetchSuppliers(pagination.value.page, pagination.value.page_size)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to update supplier'
      console.error('Error updating supplier:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSupplier(id: number) {
    loading.value = true
    error.value = null
    try {
      await supplierService.delete(id)
      await fetchSuppliers(pagination.value.page, pagination.value.page_size)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete supplier'
      console.error('Error deleting supplier:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchSuppliers(query: string, page = 1, pageSize = 10) {
    loading.value = true
    error.value = null
    try {
      const response = await supplierService.search(query, page, pageSize)
      suppliers.value = response.data
      pagination.value = response.pagination
    } catch (err: any) {
      error.value = err.message || 'Failed to search suppliers'
      console.error('Error searching suppliers:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    suppliers,
    currentSupplier,
    loading,
    error,
    pagination,
    fetchSuppliers,
    fetchSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
  }
})
