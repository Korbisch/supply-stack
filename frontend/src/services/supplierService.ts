import apiClient from '@/api/client'
import type { Supplier, SupplierListResponse, SupplierResponse } from '@/types/supplier'

export const supplierService = {
  getAll(page = 1, pageSize = 10): Promise<SupplierListResponse> {
    return apiClient
      .get('/suppliers', {
        params: { page, page_size: pageSize },
      })
      .then((response) => response.data)
  },

  getById(id: number): Promise<SupplierResponse> {
    return apiClient.get(`/suppliers/${id}`).then((response) => response.data)
  },

  create(supplier: Supplier): Promise<SupplierResponse> {
    return apiClient.post('/suppliers', supplier).then((response) => response.data)
  },

  update(id: number, supplier: Supplier): Promise<SupplierResponse> {
    return apiClient.put(`/suppliers/${id}`, supplier).then((response) => response.data)
  },

  delete(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/suppliers/${id}`).then((response) => response.data)
  },

  search(query: string, page = 1, pageSize = 10): Promise<SupplierListResponse> {
    return apiClient
      .get('/suppliers/search', {
        params: { q: query, page, page_size: pageSize },
      })
      .then((response) => response.data)
  },
}
