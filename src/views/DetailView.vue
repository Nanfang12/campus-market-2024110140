<script setup lang="ts">
// useRoute 属于 vue-router
import { useRoute } from 'vue-router'
// ref、onMounted 属于 vue
import { onMounted, ref } from 'vue'
import { getTrades } from '@/api/trade'
import type { TradeItem } from '@/api/trade'

const route = useRoute()
const targetId = Number(route.params.id)
const currentGoods = ref<TradeItem | null>(null)

onMounted(async () => {
  const res = await getTrades()
  // find 找不到返回 undefined，用 ?? 转为 null，匹配类型
  const foundItem = res.data.find(item => item.id === targetId)
  currentGoods.value = foundItem ?? null
})
</script>

<template>
  <div class="page-wrap" v-if="currentGoods">
    <h1 class="page-title">商品详情页</h1>
    <div class="detail-card">
      <div class="row-item">
        <span class="label">商品编号：</span>
        <span class="value">{{ currentGoods.id }}</span>
      </div>
      <div class="row-item">
        <span class="label">商品名称：</span>
        <span class="value">{{ currentGoods.title }}</span>
      </div>
      <div class="row-item">
        <span class="label">售价：</span>
        <span class="value price-text">¥{{ currentGoods.price }}</span>
      </div>
      <div class="row-item">
        <span class="label">成色：</span>
        <span class="value">{{ currentGoods.condition }}</span>
      </div>
      <div class="row-item">
        <span class="label">交易地点：</span>
        <span class="value">{{ currentGoods.location }}</span>
      </div>
      <div class="row-item">
        <span class="label">发布人：</span>
        <span class="value">{{ currentGoods.publisher }}</span>
      </div>
      <div class="row-item">
        <span class="label">发布时间：</span>
        <span class="value">{{ currentGoods.publishTime }}</span>
      </div>
      <div class="row-item">
        <span class="label">详细描述：</span>
        <span class="value">{{ currentGoods.description }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrap {
  padding: 20px 0;
}
.page-title {
  font-size: 26px;
  color: #1f2937;
  margin-bottom: 24px;
  border-left: 5px solid #409eff;
  padding-left: 12px;
}
.detail-card {
  max-width: 600px;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.row-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f2f3f5;
}
.row-item:last-child {
  border-bottom: none;
}
.label {
  width: 110px;
  font-weight: 500;
  color: #303133;
}
.value {
  color: #606266;
}
.price-text {
  color: #f56c6c;
  font-weight: bold;
  font-size: 17px;
}
</style>
