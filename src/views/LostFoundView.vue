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
        <div class="goods-image"><span class="goods-image__emoji">{{ parseImage(item.image)[0] }}</span><span class="goods-image__label">{{ parseImage(item.image)[1] }}</span></div>
        <div class="goods-body">
          <div class="goods-name">{{ item.title }}</div>
          <div class="goods-tag">{{ item.type === 'lost' ? '寻物启事' : '拾物招领' }}</div>
          <div class="goods-meta">昵称：{{ item.nickname || item.publisher || '失主' }}</div>
          <div class="goods-meta">地点：{{ item.location }}</div>
          <div class="goods-desc">{{ item.description }}</div>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'

// 安全地解析图片字符串
function parseImage(img: string | null | undefined): [string, string] {
  if (!img || typeof img !== 'string') return ['🔍', '失物招领']
  const parts = img.split(' ')
  if (parts.length >= 2) {
    return [parts[0] || '🔍', parts.slice(1).join(' ')]
  }
  return ['🔍', img]
}

const lostList = ref<LostFoundItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    lostList.value = await getLostFounds()
  } catch {
    // 静默处理
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
  content: '🔍';
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
.goods-card {
  display: block;
  border: 1.5px solid rgba(226, 232, 240, 0.8);
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  background: #ffffff;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.04);
}
.goods-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(251, 146, 60, 0.18);
  border-color: #fb923c;
}
.goods-image {
  width: 100%;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
  padding: 20px;
}
.goods-image__emoji {
  font-size: 56px;
  line-height: 1;
}
.goods-image__label {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #9a3412;
  padding: 0 8px;
}
.goods-body {
  padding: 22px;
}
.goods-name {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
}
.goods-tag {
  display: inline-block;
  font-size: 12px;
  color: #9a3412;
  background: #ffedd5;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 500;
  margin-bottom: 12px;
}
.goods-meta {
  font-size: 14px;
  color: #475569;
  margin-bottom: 6px;
  line-height: 1.6;
}
.goods-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e2e8f0;
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
