import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Exchanges from '@/components/Exchanges'
import Products from '@/components/Products'
import Orders from '@/components/Orders'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/products',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'exchanges',
          component: Exchanges
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
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    }
  ]
})
