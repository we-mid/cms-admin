import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Products from '@/components/Products'
import Orders from '@/components/Orders'
import Users from '@/components/Users'
import Welcome from '@/components/Welcome'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '',
          component: Welcome
        },
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
