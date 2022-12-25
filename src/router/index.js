import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    meta: { keepAlive: true },
    component: () => import('../views/index/index.vue')
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/index/detail/index.vue')
  },
  {
    path: '/echarts',
    name: 'Echarts',
    meta: { keepAlive: true },
    component: () => import('../views/echarts/index.vue')
  },
  {
    path: '/tags',
    name: 'Tags',
    meta: { keepAlive: true },
    component: () => import('../views/tags/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { show: true },
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/register/index.vue')
  },
  {
    path: '/over',
    name: 'Over',
    component: () => import('../views/tags/over/index.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
