import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Products from '@/components/Products'
import Orders from '@/components/Orders'
import Users from '@/components/Users'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: { name: 'Orders' },
      component: Home,
      children: [
        {
          path: 'users',
          name: 'Users',
          component: Users
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders
        },
        {
          path: 'products',
          name: 'Products',
          component: Products
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

export default router
