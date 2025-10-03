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
        <h1 class="text-3xl font-bold text-gray-800">Create New Supplier</h1>
      </div>

      <div class="bg-white shadow-md rounded-lg p-6">
        <SupplierForm
          :loading="store.loading"
          @submit="handleSubmit"
          @close="router.back()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSupplierStore } from '@/stores/supplierStore'
import SupplierForm from '@/components/suppliers/SupplierForm.vue'
import type { Supplier } from '@/types/supplier'

const router = useRouter()
const store = useSupplierStore()

async function handleSubmit(supplier: Supplier) {
  try {
    await store.createSupplier(supplier)
    await router.push('/suppliers')
  } catch (error) {
    console.error('Failed to create supplier:', error)
  }
}
</script>
