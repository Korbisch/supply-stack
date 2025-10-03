<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-800">Supply-Stack</h1>
          </div>
          <div class="flex gap-6">
            <RouterLink
              to="/suppliers"
              class="text-gray-600 hover:text-gray-900 font-medium"
              active-class="text-blue-600"
            >
              Suppliers
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
