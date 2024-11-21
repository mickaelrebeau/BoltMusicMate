import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/callback',
    name: 'callback',
    component: () => import('../views/Callback.vue'),
  },
  {
    path: '/discover',
    name: 'discover',
    component: () => import('../views/Discover.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/preferences',
    name: 'preferences',
    component: () => import('../views/Preferences.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router