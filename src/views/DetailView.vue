<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getTrades, type TradeItem } from '@/api/trade'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import { getErrands, type ErrandItem } from '@/api/errand'

type MessageItem = {
  id: number
  sender: string
  title: string
  content: string
  time: string
}

const route = useRoute()
const targetId = Number(route.params.id)
const itemType = String(route.meta.type || '')
const tradeItem = ref<TradeItem | null>(null)
const lostItem = ref<LostFoundItem | null>(null)
const groupItem = ref<GroupBuyItem | null>(null)
const errandItem = ref<ErrandItem | null>(null)
const messageItem = ref<MessageItem | null>(null)
const loading = ref(true)
const notFound = ref(false)

const messages: MessageItem[] = [
  {
    id: 1,
    sender: '系统通知',
    title: '欢迎使用校园轻集市消息中心',
    content: '你现在可以查看详情、回复消息，并跟同学更便捷地沟通。',
    time: '今天 14:35',
  },
  {
    id: 2,
    sender: '买家小李',
    title: '你好，这个商品还能便宜一点吗？',
    content: '我对你发布的二手书很感兴趣，想了解一下成色和取货方式。',
    time: '今天 13:12',
  },
  {
    id: 3,
    sender: '拼单发起人',
    title: '拼单进度更新：已有 3 人参加',
    content: '当前拼单人数已达 3 人，还剩 2 个名额，欢迎继续邀请好友加入。',
    time: '昨天 18:02',
  },
]

const pageTitle = computed(() => {
  switch (itemType) {
    case 'trade':
      return '二手交易详情'
    case 'lostFound':
      return '失物招领详情'
    case 'groupBuy':
      return '拼单详情'
    case 'errand':
      return '跑腿详情'
    case 'message':
      return '消息详情'
    default:
      return '详情信息'
  }
})

const basePath = computed(() => {
  switch (itemType) {
    case 'trade':
      return '/trade'
    case 'lostFound':
      return '/lost-found'
    case 'groupBuy':
      return '/group-buy'
    case 'errand':
      return '/errand'
    case 'message':
      return '/message'
    default:
      return '/'
  }
})

onMounted(async () => {
  if (itemType === 'trade') {
    const res = await getTrades()
    tradeItem.value = res.data.find(item => item.id === targetId) ?? null
  }
  if (itemType === 'lostFound') {
    const res = await getLostFounds()
    lostItem.value = res.data.find(item => item.id === targetId) ?? null
  }
  if (itemType === 'groupBuy') {
    const res = await getGroupBuys()
    groupItem.value = res.data.find(item => item.id === targetId) ?? null
  }
  if (itemType === 'errand') {
    const res = await getErrands()
    errandItem.value = res.data.find(item => item.id === targetId) ?? null
  }
  if (itemType === 'message') {
    messageItem.value = messages.find(item => item.id === targetId) ?? null
  }

  notFound.value = !tradeItem.value && !lostItem.value && !groupItem.value && !errandItem.value && !messageItem.value
  loading.value = false
})
</script>

<template>
  <div class="page-wrap">
    <h1 class="page-title">{{ pageTitle }}</h1>
    <router-link class="back-link" :to="basePath">返回列表</router-link>

    <div v-if="loading" class="detail-status">加载中...</div>
    <div v-else-if="notFound" class="detail-status">未找到该条信息</div>

    <div class="detail-card" v-else>
      <template v-if="tradeItem">
        <img v-if="tradeItem.image" :src="tradeItem.image" alt="商品图片" class="detail-image" />
        <div class="row-item">
          <span class="label">商品编号：</span>
          <span class="value">{{ tradeItem.id }}</span>
        </div>
        <div class="row-item">
          <span class="label">商品名称：</span>
          <span class="value">{{ tradeItem.title }}</span>
        </div>
        <div class="row-item">
          <span class="label">交易人：</span>
          <span class="value">{{ tradeItem.nickname || tradeItem.publisher }}</span>
        </div>
        <div class="row-item">
          <span class="label">分类：</span>
          <span class="value">{{ tradeItem.category }}</span>
        </div>
        <div class="row-item">
          <span class="label">售价：</span>
          <span class="value price-text">¥{{ tradeItem.price }}</span>
        </div>
        <div class="row-item">
          <span class="label">成色：</span>
          <span class="value">{{ tradeItem.condition }}</span>
        </div>
        <div class="row-item">
          <span class="label">交易地点：</span>
          <span class="value">{{ tradeItem.location }}</span>
        </div>
        <div class="row-item">
          <span class="label">发布人：</span>
          <span class="value">{{ tradeItem.publisher }}</span>
        </div>
        <div class="row-item">
          <span class="label">发布时间：</span>
          <span class="value">{{ tradeItem.publishTime || tradeItem.publishingTime }}</span>
        </div>
        <div class="row-item">
          <span class="label">详情描述：</span>
          <span class="value">{{ tradeItem.description }}</span>
        </div>
      </template>

      <template v-else-if="lostItem">
        <img v-if="lostItem.image" :src="lostItem.image" alt="失物图片" class="detail-image" />
        <div class="row-item">
          <span class="label">编号：</span>
          <span class="value">{{ lostItem.id }}</span>
        </div>
        <div class="row-item">
          <span class="label">昵称：</span>
          <span class="value">{{ lostItem.nickname || lostItem.publisher }}</span>
        </div>
        <div class="row-item">
          <span class="label">标题：</span>
          <span class="value">{{ lostItem.title }}</span>
        </div>
        <div class="row-item">
          <span class="label">物品名称：</span>
          <span class="value">{{ lostItem.itemName }}</span>
        </div>
        <div class="row-item">
          <span class="label">类型：</span>
          <span class="value">{{ lostItem.type === 'lost' ? '寻物' : '拾物' }}</span>
        </div>
        <div class="row-item">
          <span class="label">地点：</span>
          <span class="value">{{ lostItem.location }}</span>
        </div>
        <div class="row-item">
          <span class="label">时间：</span>
          <span class="value">{{ lostItem.eventTime }}</span>
        </div>
        <div class="row-item">
          <span class="label">联系方式：</span>
          <span class="value">{{ lostItem.contact }}</span>
        </div>
        <div class="row-item">
          <span class="label">状态：</span>
          <span class="value">{{ lostItem.status }}</span>
        </div>
        <div class="row-item">
          <span class="label">描述：</span>
          <span class="value">{{ lostItem.description }}</span>
        </div>
      </template>

      <template v-else-if="groupItem">
        <div class="row-item">
          <span class="label">编号：</span>
          <span class="value">{{ groupItem.id }}</span>
        </div>
        <div class="row-item">
          <span class="label">活动说明：</span>
          <span class="value">{{ groupItem.activityInfo || '本次活动由发起人统一协调，按人数完成后开始执行。' }}</span>
        </div>
        <div class="row-item">
          <span class="label">标题：</span>
          <span class="value">{{ groupItem.title }}</span>
        </div>
        <div class="row-item">
          <span class="label">类型：</span>
          <span class="value">{{ groupItem.type }}</span>
        </div>
        <div class="row-item">
          <span class="label">拼团人数：</span>
          <span class="value">{{ groupItem.currentCount }}/{{ groupItem.targetCount }}</span>
        </div>
        <div class="row-item">
          <span class="label">截止时间：</span>
          <span class="value">{{ groupItem.deadline }}</span>
        </div>
        <div class="row-item">
          <span class="label">地点：</span>
          <span class="value">{{ groupItem.location }}</span>
        </div>
        <div class="row-item">
          <span class="label">发布人：</span>
          <span class="value">{{ groupItem.publisher }}</span>
        </div>
        <div class="row-item">
          <span class="label">状态：</span>
          <span class="value">{{ groupItem.status }}</span>
        </div>
        <div class="row-item">
          <span class="label">描述：</span>
          <span class="value">{{ groupItem.description }}</span>
        </div>
      </template>

      <template v-else-if="errandItem">
        <div class="row-item">
          <span class="label">编号：</span>
          <span class="value">{{ errandItem.id }}</span>
        </div>
        <div class="row-item">
          <span class="label">昵称：</span>
          <span class="value">{{ errandItem.nickname || errandItem.publisher }}</span>
        </div>
        <div class="row-item">
          <span class="label">标题：</span>
          <span class="value">{{ errandItem.title }}</span>
        </div>
        <div class="row-item">
          <span class="label">任务类型：</span>
          <span class="value">{{ errandItem.taskType }}</span>
        </div>
        <div class="row-item">
          <span class="label">酬劳：</span>
          <span class="value price-text">¥{{ errandItem.reward }}</span>
        </div>
        <div class="row-item">
          <span class="label">路线：</span>
          <span class="value">{{ errandItem.from }} → {{ errandItem.to }}</span>
        </div>
        <div class="row-item">
          <span class="label">截止时间：</span>
          <span class="value">{{ errandItem.deadline }}</span>
        </div>
        <div class="row-item">
          <span class="label">发布人：</span>
          <span class="value">{{ errandItem.publisher }}</span>
        </div>
        <div class="row-item">
          <span class="label">状态：</span>
          <span class="value">{{ errandItem.status }}</span>
        </div>
        <div class="row-item">
          <span class="label">描述：</span>
          <span class="value">{{ errandItem.description }}</span>
        </div>
      </template>

      <template v-else-if="messageItem">
        <div class="row-item">
          <span class="label">消息标题：</span>
          <span class="value">{{ messageItem.title }}</span>
        </div>
        <div class="row-item">
          <span class="label">发送人：</span>
          <span class="value">{{ messageItem.sender }}</span>
        </div>
        <div class="row-item">
          <span class="label">时间：</span>
          <span class="value">{{ messageItem.time }}</span>
        </div>
        <div class="row-item">
          <span class="label">内容：</span>
          <span class="value">{{ messageItem.content }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.page-wrap {
  padding: 20px 0;
}
.page-title {
  font-size: 28px;
  color: #1f2937;
  margin-bottom: 16px;
  border-left: 5px solid #409eff;
  padding-left: 12px;
}
.back-link {
  display: inline-block;
  margin-bottom: 18px;
  color: #2563eb;
  font-size: 14px;
}
.detail-status {
  padding: 24px;
  color: #64748b;
}
.detail-card {
  max-width: 680px;
  padding: 28px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 16px 44px rgba(15, 23, 42, 0.08);
}
.detail-image {
  width: 100%;
  height: 340px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 24px;
}
.row-item {
  display: flex;
  padding: 14px 0;
  border-bottom: 1px solid #f2f3f5;
}
.row-item:last-child {
  border-bottom: none;
}
.label {
  width: 130px;
  font-weight: 600;
  color: #334155;
}
.value {
  color: #475569;
  line-height: 1.6;
}
.price-text {
  color: #ee6666;
  font-weight: 700;
  font-size: 16px;
}
</style>
