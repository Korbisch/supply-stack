<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Supplier Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Tech Supplies GmbH"
        />
      </div>

      <div>
        <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
          Supplier Code <span class="text-red-500">*</span>
        </label>
        <input
          id="code"
          v-model="formData.code"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., TECH001"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="contact@supplier.com"
        />
      </div>

      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+49 123 456789"
        />
      </div>
    </div>

    <div>
      <label for="contact_name" class="block text-sm font-medium text-gray-700 mb-2">
        Contact Person
      </label>
      <input
        id="contact_name"
        v-model="formData.contact_name"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Max Mustermann"
      />
    </div>

    <div>
      <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
        Address
      </label>
      <input
        id="address"
        v-model="formData.address"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Hauptstraße 1"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <input
          id="city"
          v-model="formData.city"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Stuttgart"
        />
      </div>

      <div>
        <label for="postal_code" class="block text-sm font-medium text-gray-700 mb-2">
          Postal Code
        </label>
        <input
          id="postal_code"
          v-model="formData.postal_code"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="70173"
        />
      </div>

      <div>
        <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
          Country
        </label>
        <input
          id="country"
          v-model="formData.country"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Germany"
        />
      </div>
    </div>

    <div>
      <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
        Status
      </label>
      <select
        id="status"
        v-model="formData.status"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>

    <div>
      <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
        Notes
      </label>
      <textarea
        id="notes"
        v-model="formData.notes"
        rows="4"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Additional notes about this supplier..."
      ></textarea>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div class="flex gap-4 justify-end">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {{ loading ? 'Saving...' : isEdit ? 'Update Supplier' : 'Create Supplier' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Supplier } from '@/types/supplier.ts'

interface Props {
  supplier?: Supplier
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  submit: [supplier: Supplier]
  cancel: []
}>()

const isEdit = ref(!!props.supplier)
const error = ref<string | null>(null)

const formData = reactive<Supplier>({
  name: '',
  code: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  postal_code: '',
  contact_name: '',
  status: 'active',
  notes: '',
})

if (props.supplier) {
  Object.assign(formData, props.supplier)
}

watch(() => props.supplier, (newSupplier) => {
  if (newSupplier) {
    Object.assign(formData, newSupplier)
    isEdit.value = true
  }
}, { deep: true })

function handleSubmit() {
  error.value = null

  // Basic validation
  if (!formData.name || !formData.code || !formData.email) {
    error.value = 'Please fill in all required fields'
    return
  }

  emit('submit', { ...formData })
}
</script>
