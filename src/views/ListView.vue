<template>
  <div class="page-wrap">
    <h1 class="page-title">商品列表页</h1>

    <!-- 数据为空展示空状态 -->
    <EmptyState
      v-if="trades.length === 0"
      text="暂无二手交易信息"
    />

    <!-- 有数据渲染卡片列表 -->
    <div class="goods-wrap" v-else>
      <div class="goods-card" v-for="item in trades" :key="item.id">
        <div class="goods-name">{{ item.title }}</div>
        <div class="goods-price">售价：¥{{ item.price }}</div>
        <div class="goods-pub">发布人：{{ item.publisher }}</div>
        <div class="goods-desc">{{ item.description }}</div>
        <div class="card-bottom">
          <router-link :to="`/detail/${item.id}`" class="detail-btn">查看详情</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// 引入空状态组件
import EmptyState from '@/components/EmptyState.vue'
// 引入接口请求方法 + 类型定义
import { getTrades, type TradeItem } from '@/api/trade'

// 定义接收接口数据的数组
const trades = ref<TradeItem[]>([])

// 页面挂载时请求后端数据
onMounted(async () => {
  const res = await getTrades()
  trades.value = res.data
})
</script>

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
.goods-wrap {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.goods-card {
  width: 250px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.25s ease;
  background: #ffffff;
}
.goods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(64, 158, 255, 0.16);
  border-color: #409eff;
}
.goods-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}
.goods-price {
  font-size: 16px;
  color: #f56c6c;
  font-weight: 500;
  margin-bottom: 6px;
}
.goods-pub {
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
}
.goods-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}
.detail-btn {
  display: inline-block;
  padding: 7px 16px;
  background-color: #409eff;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
}
.detail-btn:hover {
  background-color: #337ecc;
}
</style>
