<template>
  <section class="page">
    <div class="page-header">
      <h1>拼团活动</h1>
      <p>参与校园拼单，分摊成本，团购更划算。</p>
    </div>
    <div class="list">
      <router-link
        v-for="item in groupList"
        :key="item.id"
        :to="`/group-buy/${item.id}`"
        class="goods-card"
      >
        <div class="goods-image"><span class="goods-image__emoji">{{ parseImage(item.image)[0] }}</span><span class="goods-image__label">{{ parseImage(item.image)[1] }}</span></div>
        <div class="goods-name">{{ item.title }}</div>
        <div class="goods-tag">{{ item.type }}</div>
        <div class="goods-info">发起人：{{ item.publisher }}</div>
        <div class="goods-info">人数：{{ item.currentCount }}/{{ item.targetCount }} 人</div>
        <div class="goods-info">截止时间：{{ item.deadline }}</div>
        <div class="goods-desc">{{ item.description }}</div>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'

// 安全地解析图片字符串
function parseImage(img: string | null | undefined): [string, string] {
  if (!img || typeof img !== 'string') return ['🧋', '拼单搭子']
  const parts = img.split(' ')
  if (parts.length >= 2) {
    return [parts[0] || '🧋', parts.slice(1).join(' ')]
  }
  return ['🧋', img]
}

const groupList = ref<GroupBuyItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    groupList.value = await getGroupBuys()
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
  content: '🧋';
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
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  border: 1.5px solid rgba(226, 232, 240, 0.8);
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  background: #ffffff;
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
  border-radius: 0;
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
.goods-name {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin: 20px 20px 8px;
}
.goods-tag {
  display: inline-block;
  font-size: 12px;
  color: #9a3412;
  background: #ffedd5;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 500;
  margin: 0 20px 10px;
  align-self: flex-start;
}
.goods-info {
  font-size: 14px;
  color: #334155;
  margin: 4px 20px;
  padding: 4px 0;
}
.goods-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin: 12px 20px 20px;
  padding-top: 10px;
  border-top: 1px dashed #e2e8f0;
}

@media (max-width: 720px) {
  .list {
    grid-template-columns: 1fr;
  }
  .page-header {
    padding: 24px;
  }
  .goods-name {
    margin: 18px 16px 8px;
  }
  .goods-tag {
    margin: 0 16px 10px;
  }
  .goods-info {
    margin: 4px 16px;
  }
  .goods-desc {
    margin: 10px 16px 18px;
  }
}
</style>
