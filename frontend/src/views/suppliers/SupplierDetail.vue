<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <button
          @click="router.back()"
          class="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2 cursor-pointer"
        >
          ← Back to Suppliers
        </button>
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-800">Supplier Details</h1>
          <button
            v-if="store.currentSupplier"
            @click="router.push(`/suppliers/${store.currentSupplier.id}/edit`)"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </button>
        </div>
      </div>

      <div v-if="store.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading supplier...</p>
      </div>

      <div v-else-if="store.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ store.error }}
      </div>

      <div v-else-if="store.currentSupplier" class="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <span
            :class="{
              'bg-green-100 text-green-800': store.currentSupplier.status === 'active',
              'bg-gray-100 text-gray-800': store.currentSupplier.status === 'inactive',
              'bg-red-100 text-red-800': store.currentSupplier.status === 'suspended'
            }"
            class="px-3 py-1 inline-flex text-sm font-semibold rounded-full"
          >
            {{ store.currentSupplier.status }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Supplier Name</label>
            <p class="text-lg text-gray-900">{{ store.currentSupplier.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Supplier Code</label>
            <p class="text-lg text-gray-900">{{ store.currentSupplier.code }}</p>
          </div>
        </div>

        <div class="border-t pt-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p class="text-gray-900">{{ store.currentSupplier.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Phone</label>
              <p class="text-gray-900">{{ store.currentSupplier.phone || '-' }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500 mb-1">Contact Person</label>
              <p class="text-gray-900">{{ store.currentSupplier.contact_name || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Address</h2>
          <div class="space-y-2">
            <p class="text-gray-900">{{ store.currentSupplier.address || '-' }}</p>
            <p class="text-gray-900">
              {{ store.currentSupplier.postal_code }} {{ store.currentSupplier.city }}
            </p>
            <p class="text-gray-900">{{ store.currentSupplier.country || '-' }}</p>
          </div>
        </div>

        <div v-if="store.currentSupplier.notes" class="border-t pt-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Notes</h2>
          <p class="text-gray-900 whitespace-pre-wrap">{{ store.currentSupplier.notes }}</p>
        </div>

        <div class="border-t pt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500">
            <div>
              <label class="block font-medium mb-1">Created At</label>
              <p>{{ formatDate(store.currentSupplier.created_at) }}</p>
            </div>
            <div>
              <label class="block font-medium mb-1">Last Updated</label>
              <p>{{ formatDate(store.currentSupplier.updated_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSupplierStore } from '@/stores/supplierStore'

const router = useRouter()
const route = useRoute()
const store = useSupplierStore()

const supplierId = parseInt(route.params.id as string)

onMounted(() => {
  store.fetchSupplier(supplierId)
})

function formatDate(dateString?: string) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
