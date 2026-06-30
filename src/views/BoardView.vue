<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTrades } from '@/api/trade'
import { getLostFounds } from '@/api/lostFound'
import { getGroupBuys } from '@/api/groupBuy'
import { getErrands } from '@/api/errand'

// 统计变量
const tradeTotal = ref(0)
const lostFoundTotal = ref(0)
const groupBuyTotal = ref(0)
const errandTotal = ref(0)

onMounted(async () => {
  // 并行请求四个接口
  const [resTrade, resLost, resGroup, resErrand] = await Promise.all([
    getTrades(),
    getLostFounds(),
    getGroupBuys(),
    getErrands()
  ])
  tradeTotal.value = resTrade.data.length
  lostFoundTotal.value = resLost.data.length
  groupBuyTotal.value = resGroup.data.length
  errandTotal.value = resErrand.data.length
})
</script>

<template>
  <div class="page-wrap">
    <h1 class="page-title">数据看板 · 统计概览</h1>
    <div class="stat-wrap">
      <div class="stat-card">
        <div class="stat-label">二手商品总数</div>
        <div class="stat-num">{{ tradeTotal }}</div>
        <div class="stat-unit">件</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">失物招领总数</div>
        <div class="stat-num">{{ lostFoundTotal }}</div>
        <div class="stat-unit">条</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">拼团活动总数</div>
        <div class="stat-num">{{ groupBuyTotal }}</div>
        <div class="stat-unit">条</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">跑腿订单总数</div>
        <div class="stat-num">{{ errandTotal }}</div>
        <div class="stat-unit">条</div>
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
  margin-bottom: 28px;
  border-left: 5px solid #409eff;
  padding-left: 12px;
}
.stat-wrap {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.stat-card {
  width: 200px;
  padding: 24px 16px;
  background: linear-gradient(135deg, #409eff 0%, #7cbfff 100%);
  border-radius: 12px;
  color: #fff;
  text-align: center;
  box-shadow: 0 3px 12px rgba(64, 158, 255, 0.2);
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-4px);
}
.stat-label {
  font-size: 15px;
  opacity: 0.9;
  margin-bottom: 10px;
}
.stat-num {
  font-size: 36px;
  font-weight: bold;
  line-height: 1;
}
.stat-unit {
  font-size: 14px;
  margin-top: 6px;
  opacity: 0.85;
}
</style>