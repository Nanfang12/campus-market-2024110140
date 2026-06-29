<template>
  <section class="page">
    <div class="page-header">
      <h1>失物招领</h1>
      <p>查看校园内寻物、拾物信息，互帮互助找回物品。</p>
    </div>
    <div class="list">
      <router-link
        v-for="item in lostList"
        :key="item.id"
        :to="`/lost-found/${item.id}`"
        class="goods-card"
      >
        <img :src="item.image || placeholderImage" alt="失物图片" class="goods-image" />
        <div class="goods-body">
          <div class="goods-name">{{ item.title }}</div>
          <div class="goods-tag">{{ item.type === 'lost' ? '寻物启事' : '拾物招领' }}</div>
          <div class="goods-meta">昵称：{{ item.nickname || item.publisher || '失主' }}</div>
          <div class="goods-pub">地点：{{ item.location }}</div>
          <div class="goods-desc">{{ item.description }}</div>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
const lostList = ref<LostFoundItem[]>([])
const placeholderImage = 'https://via.placeholder.com/520x320/fff7ed/7c5d4a?text=暂无+图片'
onMounted(async () => {
  const res = await getLostFounds()
  lostList.value = res.data
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
  display: block;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  background: #ffffff;
  text-decoration: none;
  color: inherit;
}
.goods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 34px rgba(64, 158, 255, 0.18);
  border-color: #409eff;
}
.goods-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
.goods-body {
  padding: 18px;
}
.goods-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}
.goods-price {
  font-size: 14px;
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 10px;
}
.goods-tag {
  font-size: 13px;
  color: #475569;
  margin-bottom: 8px;
}
.goods-meta {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
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
