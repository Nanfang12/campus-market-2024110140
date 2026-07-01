<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getTrades, type TradeItem } from '@/api/trade'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import { getErrands, type ErrandItem } from '@/api/errand'
import { getMessages, type MessageItem } from '@/api/message'
import { useFavoriteStore, type FavoriteType } from '@/stores/favorite'

// 页面支持的全部类型（消息不参与收藏）
type PageType = FavoriteType | 'message' | ''

const favoriteStore = useFavoriteStore()
const route = useRoute()

// 把 params.id 规范化成单个 string（防止是 string[] 的情况）
const rawId = Array.isArray(route.params.id) ? route.params.id[0] : String(route.params.id || '')
// meta.type 规范化成单个 string
const rawType = Array.isArray(route.meta.type) ? String(route.meta.type[0] || '') : String(route.meta.type || '')

// 类型守卫：确认是合法的页面类型
const itemType = computed<PageType>(() => {
  const t = rawType
  if (t === 'trade' || t === 'lostFound' || t === 'groupBuy' || t === 'errand' || t === 'message') {
    return t as PageType
  }
  return ''
})

// 收藏类型：只有四类业务信息才支持收藏
const favoriteType = computed<FavoriteType | ''>(() => {
  const t = itemType.value
  if (t === 'trade' || t === 'lostFound' || t === 'groupBuy' || t === 'errand') {
    return t as FavoriteType
  }
  return ''
})

// 安全解析图片字符串
function parseImage(img: string | null | undefined): [string, string] {
  if (!img || typeof img !== 'string') return ['📷', '暂无图片']
  const parts = img.split(' ')
  if (parts.length >= 2) {
    return [parts[0] || '📷', parts.slice(1).join(' ')]
  }
  return ['📷', img]
}

const tradeItem = ref<TradeItem | null>(null)
const lostItem = ref<LostFoundItem | null>(null)
const groupItem = ref<GroupBuyItem | null>(null)
const errandItem = ref<ErrandItem | null>(null)
const messageItem = ref<MessageItem | null>(null)
const loaded = ref(false)

onMounted(async () => {
  try {
    if (itemType.value === 'trade') {
      const list = await getTrades()
      tradeItem.value = list.find((item) => String(item.id) === rawId) ?? null
    } else if (itemType.value === 'lostFound') {
      const list = await getLostFounds()
      lostItem.value = list.find((item) => String(item.id) === rawId) ?? null
    } else if (itemType.value === 'groupBuy') {
      const list = await getGroupBuys()
      groupItem.value = list.find((item) => String(item.id) === rawId) ?? null
    } else if (itemType.value === 'errand') {
      const list = await getErrands()
      errandItem.value = list.find((item) => String(item.id) === rawId) ?? null
    } else if (itemType.value === 'message') {
      const list = await getMessages()
      messageItem.value = list.find((item) => String(item.id) === rawId) ?? null
    }
  } catch {
    // 静默处理
  } finally {
    loaded.value = true
  }
})

// 从加载到的对象里取真实 id（与列表页一致，保持原始 number|string 类型）
const currentItemId = computed<number | string | null>(() => {
  if (tradeItem.value) return tradeItem.value.id
  if (lostItem.value) return lostItem.value.id
  if (groupItem.value) return groupItem.value.id
  if (errandItem.value) return errandItem.value.id
  return null
})

const notFound = computed(
  () => loaded.value && currentItemId.value === null && !messageItem.value
)

const pageTitle = computed(() => {
  switch (itemType.value) {
    case 'trade': return '二手交易详情'
    case 'lostFound': return '失物招领详情'
    case 'groupBuy': return '拼单详情'
    case 'errand': return '跑腿详情'
    case 'message': return '消息详情'
    default: return '详情信息'
  }
})

const basePath = computed(() => {
  switch (itemType.value) {
    case 'trade': return '/trade'
    case 'lostFound': return '/lost-found'
    case 'groupBuy': return '/group-buy'
    case 'errand': return '/errand'
    case 'message': return '/message'
    default: return '/'
  }
})

// 给详情页用的收藏信息聚合
const favoriteInfo = computed(() => {
  let title = ''
  let description = ''
  let location: string | undefined = undefined
  if (tradeItem.value) {
    title = tradeItem.value.title
    description = tradeItem.value.description
    location = tradeItem.value.location
  } else if (lostItem.value) {
    title = lostItem.value.title
    description = lostItem.value.description
    location = lostItem.value.location
  } else if (groupItem.value) {
    title = groupItem.value.title
    description = groupItem.value.description
    location = groupItem.value.location
  } else if (errandItem.value) {
    title = errandItem.value.title
    description = errandItem.value.description
    location = `${errandItem.value.from} → ${errandItem.value.to}`
  }
  return { title, description, location }
})

const isFavorited = computed(() => {
  if (!favoriteType.value || currentItemId.value === null) return false
  return favoriteStore.isFavorite(favoriteType.value, currentItemId.value)
})

function toggleFavorite() {
  if (!favoriteType.value || currentItemId.value === null) return
  favoriteStore.toggleFavorite({
    id: currentItemId.value,
    type: favoriteType.value,
    title: favoriteInfo.value.title,
    description: favoriteInfo.value.description,
    location: favoriteInfo.value.location,
  })
}
</script>

<template>
  <div class="page-wrap">
    <h1 class="page-title">{{ pageTitle }}</h1>
    <router-link class="back-link" :to="basePath">返回列表</router-link>

    <div v-if="notFound" class="detail-status">未找到该条信息</div>

    <div class="detail-card" v-else>
      <template v-if="itemType === 'trade' && tradeItem">
        <div class="detail-image"><span class="detail-image__emoji">{{ parseImage(tradeItem.image)[0] }}</span><span class="detail-image__label">{{ parseImage(tradeItem.image)[1] }}</span></div>
        <div class="row-item">
          <span class="label">商品编号：</span>
          <span class="value">{{ tradeItem.id }}</span>
        </div>
        <div class="row-item">
          <span class="label">商品名称：</span>
          <span class="value">{{ tradeItem.title }}</span>
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
          <span class="value">{{ tradeItem.publishTime }}</span>
        </div>
        <div class="row-item">
          <span class="label">详情描述：</span>
          <span class="value">{{ tradeItem.description }}</span>
        </div>
      </template>

      <template v-else-if="itemType === 'lostFound' && lostItem">
        <div class="detail-image"><span class="detail-image__emoji">{{ parseImage(lostItem.image)[0] }}</span><span class="detail-image__label">{{ parseImage(lostItem.image)[1] }}</span></div>
        <div class="row-item">
          <span class="label">编号：</span>
          <span class="value">{{ lostItem.id }}</span>
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

      <template v-else-if="itemType === 'groupBuy' && groupItem">
        <div class="detail-image"><span class="detail-image__emoji">{{ parseImage(groupItem.image)[0] }}</span><span class="detail-image__label">{{ parseImage(groupItem.image)[1] }}</span></div>
        <div class="row-item">
          <span class="label">编号：</span>
          <span class="value">{{ groupItem.id }}</span>
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

      <template v-else-if="itemType === 'errand' && errandItem">
        <div class="detail-image"><span class="detail-image__emoji">{{ parseImage(errandItem.image)[0] }}</span><span class="detail-image__label">{{ parseImage(errandItem.image)[1] }}</span></div>
        <div class="row-item">
          <span class="label">编号：</span>
          <span class="value">{{ errandItem.id }}</span>
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

      <template v-else-if="itemType === 'message' && messageItem">
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

      <!-- 收藏按钮：仅对四类业务信息显示 -->
      <div v-if="itemType !== 'message' && itemType !== '' && !notFound" class="favorite-bar">
        <button
          class="favorite-btn-detail"
          :class="{ active: isFavorited }"
          @click="toggleFavorite"
        >
          {{ isFavorited ? '★ 已收藏' : '☆ 点击收藏' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrap {
  padding: 24px 8px;
}
.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px;
  border-left: 5px solid #fb923c;
  padding-left: 14px;
}
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #c2410c;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 16px;
  background: #ffedd5;
  border-radius: 10px;
  transition: background 0.15s ease;
}
.back-link:hover {
  background: #fed7aa;
}
.detail-status {
  padding: 40px 24px;
  color: #64748b;
  text-align: center;
  font-size: 15px;
  background: #fff;
  border-radius: 16px;
  margin-top: 16px;
}
.detail-card {
  max-width: 700px;
  padding: 32px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 32px rgba(251, 146, 60, 0.08);
  border: 1.5px solid rgba(251, 146, 60, 0.15);
}
.detail-image {
  width: 100%;
  height: 320px;
  border-radius: 16px;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
}
.detail-image__emoji {
  font-size: 96px;
  line-height: 1;
}
.detail-image__label {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: #9a3412;
  padding: 0 16px;
}
.row-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
  gap: 16px;
}
.row-item:last-of-type {
  border-bottom: none;
}
.label {
  min-width: 120px;
  font-weight: 600;
  color: #78350f;
  font-size: 14px;
  flex-shrink: 0;
}
.value {
  color: #475569;
  line-height: 1.7;
  font-size: 15px;
  flex: 1;
  word-break: break-word;
}
.price-text {
  color: #c2410c;
  font-weight: 700;
  font-size: 17px;
}

/* 详情页收藏按钮栏 */
.favorite-bar {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px dashed #fed7aa;
  display: flex;
  justify-content: center;
}

.favorite-btn-detail {
  padding: 12px 36px;
  border-radius: 999px;
  border: 1.5px solid #fb923c;
  background: #fff;
  color: #ea580c;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.favorite-btn-detail:hover {
  background: #fff7ed;
  transform: translateY(-1px);
}

.favorite-btn-detail.active {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
}

@media (max-width: 600px) {
  .detail-card {
    padding: 20px;
    border-radius: 16px;
  }
  .detail-image {
    height: 240px;
  }
  .detail-image__emoji {
    font-size: 72px;
  }
  .detail-image__label {
    font-size: 18px;
  }
  .label {
    min-width: 90px;
  }
  .favorite-btn-detail {
    width: 100%;
    padding: 14px 24px;
  }
}
</style>
