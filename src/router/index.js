// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Login from '@/views/Login'
import Intruduce from '@/views/Intruduce'
import Sku from '@/views/Sku'
import Pictures from '@/views/Pictures'
import User from '@/views/User'
import Author from '@/views/Author'
import Group from '@/views/Group'
import Admin from '@/views/Admin'

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
    {
      path: '/author',
      name: 'author',
      component: Author
    },
    {
      path: '/group',
      name: 'group',
      component: Group
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
  ]
})

export default router