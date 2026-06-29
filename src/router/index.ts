import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import TradeView from '../views/TradeView.vue'
import LostFoundView from '../views/LostFoundView.vue'
import GroupBuyView from '../views/GroupBuyView.vue'
import ErrandView from '../views/ErrandView.vue'
import PublishView from '../views/PublishView.vue'
import MessageView from '../views/MessageView.vue'
import UserCenterView from '../views/UserCenterView.vue'
import DetailView from '../views/DetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首页',
      },
    },
    {
      path: '/trade',
      name: 'trade',
      component: TradeView,
      meta: {
        title: '二手交易',
      },
    },
    {
      path: '/trade/:id',
      name: 'tradeDetail',
      component: DetailView,
      meta: {
        title: '二手交易详情',
        type: 'trade',
      },
    },
    {
      path: '/lost-found',
      name: 'lostFound',
      component: LostFoundView,
      meta: {
        title: '失物招领',
      },
    },
    {
      path: '/lost-found/:id',
      name: 'lostFoundDetail',
      component: DetailView,
      meta: {
        title: '失物招领详情',
        type: 'lostFound',
      },
    },
    {
      path: '/group-buy',
      name: 'groupBuy',
      component: GroupBuyView,
      meta: {
        title: '拼单搭子',
      },
    },
    {
      path: '/group-buy/:id',
      name: 'groupBuyDetail',
      component: DetailView,
      meta: {
        title: '拼单详情',
        type: 'groupBuy',
      },
    },
    {
      path: '/errand',
      name: 'errand',
      component: ErrandView,
      meta: {
        title: '跑腿委托',
      },
    },
    {
      path: '/errand/:id',
      name: 'errandDetail',
      component: DetailView,
      meta: {
        title: '跑腿详情',
        type: 'errand',
      },
    },
    {
      path: '/publish',
      name: 'publish',
      component: PublishView,
      meta: {
        title: '发布信息',
      },
    },
    {
      path: '/message',
      name: 'message',
      component: MessageView,
      meta: {
        title: '消息中心',
      },
    },
    {
      path: '/message/:id',
      name: 'messageDetail',
      component: DetailView,
      meta: {
        title: '消息详情',
        type: 'message',
      },
    },
    {
      path: '/user',
      name: 'user',
      component: UserCenterView,
      meta: {
        title: '个人中心',
      },
    },
  ],
})

export default router
