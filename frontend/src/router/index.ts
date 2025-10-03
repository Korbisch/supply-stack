import { createRouter, createWebHistory } from 'vue-router'
import SupplierList from '@/views/suppliers/SupplierList.vue'
import SupplierCreate from '@/views/suppliers/SupplierCreate.vue'
import SupplierDetail from '@/views/suppliers/SupplierDetail.vue'
import SupplierEdit from '@/views/suppliers/SupplierEdit.vue'

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
    },
    {
      path: '/suppliers/new',
      name: 'supplier-create',
      component: SupplierCreate,
    },
    {
      path: '/suppliers/:id',
      name: 'supplier-detail',
      component: SupplierDetail,
    },
    {
      path: '/suppliers/:id/edit',
      name: 'supplier-edit',
      component: SupplierEdit,
    }
  ],
})

export default router
