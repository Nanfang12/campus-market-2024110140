<template>
  <section class="page">
    <div class="page-header">
      <h1>跑腿代办</h1>
      <p>发布代取快递、代买代办任务，互帮互助赚小额酬劳。</p>
    </div>
    <div class="list">
      <div class="goods-card" v-for="item in errandList" :key="item.id">
        <div class="goods-name">{{ item.title }}</div>
        <div class="goods-price">酬劳：¥{{ item.reward }}</div>
        <div class="goods-pub">路线：{{ item.from }} → {{ item.to }}</div>
        <div class="goods-desc">{{ item.description }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getErrands, type ErrandItem } from '@/api/errand'
const errandList = ref<ErrandItem[]>([])
onMounted(async () => {
  const res = await getErrands()
  errandList.value = res.data
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
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
.goods-card {
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
}
</style>
