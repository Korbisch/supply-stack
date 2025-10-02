export interface Supplier {
  id?: number
  name: string
  code: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  contact_name?: string
  rating?: number
  status?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface PaginationMeta {
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface SupplierListResponse {
  data: Supplier[]
  pagination: PaginationMeta
}

export interface SupplierResponse {
  data: Supplier
  message?: string
}
