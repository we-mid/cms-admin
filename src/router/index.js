import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Products from '@/components/Products'
import Orders from '@/components/Orders'
import Users from '@/components/Users'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: { name: 'Products' },
      component: Home,
      children: [
        {
          path: 'users',
          component: Users
        },
        {
          path: 'orders',
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
