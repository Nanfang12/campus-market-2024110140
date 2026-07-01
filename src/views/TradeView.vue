<template>
  <section class="page">
    <div class="page-header">
      <h1>二手交易</h1>
      <p>浏览同学发布的闲置物品，发现校园内的实用好物。</p>
    </div>

    <div class="list">
      <router-link
        v-for="item in trades"
        :key="item.id"
        :to="`/trade/${item.id}`"
        class="card-link"
      >
        <ItemCard
          :title="item.title"
          :subtitle="item.nickname || item.publisher"
          :image="item.image"
          :description="item.description"
          :tag="item.category"
          :location="item.location"
          :time="item.publishTime"
        >
          <template #footer>
            <strong>￥{{ item.price }}</strong>
            <span class="condition">{{ item.condition }}</span>
            <button
              class="favorite-btn"
              :class="{ active: favoriteStore.isFavorite('trade', item.id) }"
              @click.stop.prevent="favoriteStore.toggleFavorite({
                id: item.id,
                type: 'trade',
                title: item.title,
                description: item.description,
                location: item.location
              })"
            >
              {{ favoriteStore.isFavorite('trade', item.id) ? '★ 已收藏' : '☆ 收藏' }}
            </button>
          </template>
        </ItemCard>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import { getTrades, type TradeItem } from '../api/trade'
import { useFavoriteStore } from '../stores/favorite'

const favoriteStore = useFavoriteStore()

const trades = ref<TradeItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    trades.value = await getTrades()
  } catch {
    // 加载失败时静默处理
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 8px;
}

.page-header {
  padding: 28px 32px;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #fed7aa 100%);
  border: 1px solid rgba(251, 146, 60, 0.15);
  box-shadow: 0 2px 12px rgba(251, 146, 60, 0.06);
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-header::before {
  content: '📦';
  font-size: 44px;
}

.page-header h1 {
  margin: 0 0 4px;
  font-size: 22px;
  color: #9a3412;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  color: #78716c;
  font-size: 14px;
}

.list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.condition {
  margin-left: 12px;
  color: #64748b;
  font-size: 13px;
  padding: 3px 10px;
  background: #f1f5f9;
  border-radius: 8px;
  font-weight: 500;
}

.favorite-btn {
  margin-left: auto;
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.favorite-btn:hover {
  background: #e5e7eb;
}

.favorite-btn.active {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: #fff;
}

@media (max-width: 720px) {
  .list {
    grid-template-columns: 1fr;
  }
  .page-header {
    padding: 24px;
  }
}
</style>
