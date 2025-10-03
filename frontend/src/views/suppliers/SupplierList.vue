<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Suppliers</h1>
      <button
        @click="navigateToCreate"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
      >
        <span>+</span>
        <span>Add Supplier</span>
      </button>
    </div>

    <div class="mb-6">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Search suppliers by name, code, or email..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <div v-if="store.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading suppliers...</p>
    </div>

    <div v-else-if="store.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ store.error }}
    </div>

    <div v-else-if="store.suppliers.length === 0" class="text-center py-12">
      <p class="text-gray-600 text-lg">No suppliers found</p>
      <button
        @click="navigateToCreate"
        class="mt-4 text-blue-600 hover:text-blue-700 underline"
      >
        Create your first supplier
      </button>
    </div>

    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Code
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            City
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="supplier in store.suppliers" :key="supplier.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ supplier.code }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ supplier.name }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ supplier.email }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ supplier.city || '-' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'bg-green-100 text-green-800': supplier.status === 'active',
                  'bg-gray-100 text-gray-800': supplier.status === 'inactive',
                  'bg-red-100 text-red-800': supplier.status === 'suspended'
                }"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ supplier.status }}
              </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              @click="viewSupplier(supplier.id!)"
              class="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
            >
              View
            </button>
            <button
              @click="editSupplier(supplier.id!)"
              class="text-green-600 hover:text-green-900 mr-3 cursor-pointer"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(supplier)"
              class="text-red-600 hover:text-red-900 cursor-pointer"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          Showing {{ (store.pagination.page - 1) * store.pagination.page_size + 1 }} to
          {{ Math.min(store.pagination.page * store.pagination.page_size, store.pagination.total) }}
          of {{ store.pagination.total }} results
        </div>
        <div class="flex gap-2">
          <button
            :disabled="store.pagination.page === 1"
            :class="store.pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 cursor-pointer'"
            @click="goToPage(store.pagination.page - 1)"
            class="px-3 py-1 border border-gray-300 rounded bg-white"
          >
            Previous
          </button>
          <span class="px-3 py-1">
            Page {{ store.pagination.page }} of {{ store.pagination.total_pages }}
          </span>
          <button
            @click="goToPage(store.pagination.page + 1)"
            :disabled="store.pagination.page === store.pagination.total_pages"
            :class="store.pagination.page === store.pagination.total_pages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 cursor-pointer'"
            class="px-3 py-1 border border-gray-300 rounded bg-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete supplier "{{ supplierToDelete?.name }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupplierStore } from '@/stores/supplierStore'
import type { Supplier } from '@/types/supplier'

const router = useRouter()
const store = useSupplierStore()

const searchQuery = ref('')
const showDeleteModal = ref(false)
const supplierToDelete = ref<Supplier | null>(null)

onMounted(() => {
  store.fetchSuppliers()
})

let searchTimeout: ReturnType<typeof setTimeout>

function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      store.searchSuppliers(searchQuery.value)
    } else {
      store.fetchSuppliers()
    }
  }, 300)
}

function goToPage(page: number) {
  if (searchQuery.value.trim()) {
    store.searchSuppliers(searchQuery.value, page, store.pagination.page_size)
  } else {
    store.fetchSuppliers(page, store.pagination.page_size)
  }
}

function navigateToCreate() {
  router.push('/suppliers/new')
}

function viewSupplier(id: number) {
  router.push(`/suppliers/${id}`)
}

function editSupplier(id: number) {
  router.push(`/suppliers/${id}/edit`)
}

function confirmDelete(supplier: Supplier) {
  supplierToDelete.value = supplier
  showDeleteModal.value = true
}

async function handleDelete() {
  if (supplierToDelete.value?.id) {
    await store.deleteSupplier(supplierToDelete.value.id)
    showDeleteModal.value = false
    supplierToDelete.value = null
  }
}
</script>
