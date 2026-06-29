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
          :image="item.image || placeholderImage"
          :description="item.description"
          :tag="item.category"
          :location="item.location"
          :time="item?.publishTime || item?.publishTime"
        >
          <template #footer>
            <strong>￥{{ item.price }}</strong>
            <span class="condition">{{ item.condition }}</span>
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

const trades = ref<TradeItem[]>([])
const placeholderImage = 'https://via.placeholder.com/520x320/ebf4ff/7c7c7c?text=暂无+图片'

onMounted(async () => {
  const res = await getTrades()
  trades.value = res.data
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.page-header h1 {
  margin: 0 0 8px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}

.list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.card-link:hover .item-card {
  transform: translateY(-4px);
}

.condition {
  margin-left: 12px;
  color: #6b7280;
}
</style>
