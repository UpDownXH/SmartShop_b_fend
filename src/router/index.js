// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Login from '@/views/Login'
import AddGood from '@/views/AddGood'

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/add',
      name: 'add',
      component: AddGood
    },
  ]
})

export default router