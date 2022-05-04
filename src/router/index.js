// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Login from '@/views/Login'
import Intruduce from '@/views/Intruduce'
import Sku from '@/views/Sku'
import Pictures from '@/views/Pictures'
import User from '@/views/User'

// import AddGood from '@/views/AddGood'

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
      path: '/intruduce',
      name: 'intruduce',
      component: Intruduce
    },
    {
      path: '/sku',
      name: 'sku',
      component: Sku
    },
    // {
    //   path: '/add',
    //   name: 'add',
    //   component: AddGood
    // },
    {
      path: '/pictures',
      name: 'pictures',
      component: Pictures
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
  ]
})

export default router