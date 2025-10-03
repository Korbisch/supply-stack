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
        <h1 class="text-3xl font-bold text-gray-800">Edit Supplier</h1>
      </div>

      <div v-if="store.loading && !store.currentSupplier" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading supplier...</p>
      </div>

      <div v-else-if="store.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ store.error }}
      </div>

      <div v-else-if="store.currentSupplier" class="bg-white shadow-md rounded-lg p-6">
        <SupplierForm
          :supplier="store.currentSupplier"
          :loading="store.loading"
          @submit="handleSubmit"
          @cancel="router.back()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSupplierStore } from '@/stores/supplierStore'
import SupplierForm from '@/components/suppliers/SupplierForm.vue'
import type { Supplier } from '@/types/supplier'

const router = useRouter()
const route = useRoute()
const store = useSupplierStore()

const supplierId = parseInt(route.params.id as string)

onMounted(() => {
  store.fetchSupplier(supplierId)
})

async function handleSubmit(supplier: Supplier) {
  try {
    await store.updateSupplier(supplierId, supplier)
    router.push('/suppliers')
  } catch (error) {
    console.error('Failed to update supplier:', error)
  }
}
</script>
