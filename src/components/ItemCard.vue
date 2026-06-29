<template>
  <article class="item-card">
    <img v-if="image" :src="image" alt="卡片图片" class="item-card__image" />

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
defineProps<{
  title: string
  description: string
  tag?: string
  subtitle?: string
  image?: string
  location?: string
  time?: string
}>()
</script>

<style scoped>
.item-card {
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: #ffffff;
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.06);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.12);
}

.item-card__image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.item-card__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  padding: 18px 18px 8px;
}

.item-card h3 {
  margin: 0;
  font-size: 18px;
}

.subtitle {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}

.tag {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(51, 102, 255, 0.12);
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
}

.description {
  margin: 12px 0;
  color: #4b5563;
  line-height: 1.6;
}

.meta {
  display: flex;
  gap: 16px;
  color: #6b7280;
  font-size: 13px;
}

.footer {
  margin-top: 12px;
}
</style>
