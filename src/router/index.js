import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    redirect: '/notice',
    children: [
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
      {
        path: '/picture',
        name: 'Picture',
        component: () => import('../views/Picture.vue')
      },
      {
        path: '/notice',
        name: 'Notice',
        component: () => import('../views/Notice.vue')
      },
      {
        path: '/declare',
        name: 'Declare',
        component: () => import('../views/Declare.vue')
      },
      {
        path: '/introduce',
        name: 'Introduce',
        component: () => import('../views/Introduce.vue')
      },
      {
        path: '/floor',
        name: 'Floor',
        component: () => import('../views/Floor.vue')
      },
      {
        path: '/room',
        name: 'Room',
        component: () => import('../views/Room.vue')
      },
      {
        path: '/count',
        name: 'Count',
        component: () => import('../views/Count.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export const createRouter = new VueRouter({
  mode: 'history',
  routes
})
export default router
