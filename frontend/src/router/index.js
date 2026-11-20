import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Produtos from '../views/Produtos.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/produtos' },
    { path: '/login', component: Login },
    { path: '/produtos', component: Produtos, meta: { requiresAuth: true } },
  ],
})

// Guarda de navegação: protege as telas que exigem login.
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) return '/login'
  if (to.path === '/login' && auth.token) return '/produtos'
})

export default router
