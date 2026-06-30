<template>
  <article class="item-card">
    <div class="item-card__image"><span class="emoji">{{ imageText[0] || '📷' }}</span><span class="label">{{ imageText[1] || '暂无图片' }}</span></div>

    <div class="item-card__header">
      <div>
        <h3>{{ title }}</h3>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <span v-if="tag" class="tag">{{ tag }}</span>
    </div>

    <p class="description">{{ description }}</p>

    <div class="meta">
      <span v-if="location">地点：{{ location }}</span>
      <span v-if="time">时间：{{ time }}</span>
    </div>

    <div v-if="$slots.footer" class="footer">
      <slot name="footer" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description: string
  tag?: string
  subtitle?: string
  image?: string
  location?: string
  time?: string
}>()

// 安全地解析 "emoji 文字" 格式
const imageText = computed(() => {
  if (!props.image) return ['📦', '商品图片']
  const parts = props.image.split(' ')
  if (parts.length >= 2) {
    return [parts[0] || '📦', parts.slice(1).join(' ')]
  }
  return ['📦', props.image]
})
</script>

<style scoped>
.item-card {
  overflow: hidden;
  border-radius: 20px;
  border: 1.5px solid rgba(226, 232, 240, 0.8);
  background: #ffffff;
  box-shadow: 0 12px 34px rgba(15, 23, 42, 0.06);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 48px rgba(251, 146, 60, 0.18);
  border-color: #fb923c;
}

.item-card__image {
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
  padding: 20px;
}
.item-card__image .emoji {
  font-size: 64px;
  line-height: 1;
}
.item-card__image .label {
  font-size: 16px;
  font-weight: 600;
  color: #9a3412;
  text-align: center;
  padding: 0 8px;
}

.item-card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding: 22px 22px 12px;
}

.item-card h3 {
  margin: 0;
  font-size: 18px;
  color: #1e293b;
  font-weight: 600;
}

.subtitle {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
}

.tag {
  padding: 6px 14px;
  border-radius: 999px;
  background: #ffedd5;
  color: #9a3412;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.description {
  margin: 10px 22px;
  padding: 10px 0;
  color: #475569;
  line-height: 1.7;
  border-top: 1px dashed #e2e8f0;
  font-size: 14px;
}

.meta {
  display: flex;
  gap: 18px;
  color: #64748b;
  font-size: 13px;
  padding: 0 22px;
  margin-bottom: 12px;
}

.footer {
  padding: 12px 22px 22px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
}
</style>
