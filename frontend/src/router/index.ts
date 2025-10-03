import { createRouter, createWebHistory } from 'vue-router'
import SupplierList from '@/views/suppliers/SupplierList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/suppliers'
    },
    {
      path: '/suppliers',
      name: 'suppliers',
      component: SupplierList,
    }
  ],
})

export default router
