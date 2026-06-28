import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/list',
      name: 'List',
      component: () => import('@/views/ListView.vue')
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: () => import('@/views/DetailView.vue')
    },
    {
      path: '/publish',
      name: 'Publish',
      component: () => import('@/views/PublishView.vue')
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('@/views/MessageView.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue')
    },
    {
      path: '/board',
      name: 'Board',
      component: () => import('@/views/BoardView.vue')
    }
  ]
})

export default router
