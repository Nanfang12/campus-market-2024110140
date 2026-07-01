<template>
  <section class="page">
    <div class="page-header">
      <h1>消息中心</h1>
      <p>查看系统通知、收藏提醒和互动消息。</p>
    </div>

    <div class="message-list">
      <article class="message-card message-card--welcome">
        <h3>欢迎使用校园轻集市</h3>
        <p>你可以在这里发布二手商品、失物招领、拼单搭子和跑腿委托。</p>
        <span class="message-time">{{ welcomeTime }}</span>
      </article>

      <article class="message-card">
        <h3>功能提示</h3>
        <p>收藏的信息可以在个人中心中查看，方便你快速回顾感兴趣的内容。</p>
        <span class="message-time">{{ welcomeTime }}</span>
      </article>

      <article
        v-for="item in dynamicMessages"
        :key="item.id"
        class="message-card"
      >
        <h3>{{ item.title }}</h3>
        <p>{{ item.content }}</p>
        <span class="message-time">{{ item.time }}</span>
      </article>

      <article class="message-card message-card--info">
        <h3>温馨提示</h3>
        <p>校园轻集市当前处于 Day5 阶段，消息推送与互动通知会在后续版本中逐步完善。</p>
        <span class="message-time">系统 · 刚刚</span>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getMessages, type MessageItem } from '../api/message'

const messages = ref<MessageItem[]>([])
const loading = ref(true)

const welcomeTime = computed(() => {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
})

const dynamicMessages = computed(() => messages.value)

onMounted(async () => {
  try {
    messages.value = await getMessages()
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
  gap: 20px;
}

.page-header {
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #7c2d12;
}

.page-header p {
  margin: 0;
  color: #9a3412;
  font-size: 14px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.message-card {
  padding: 20px 24px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #f1f5f9;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  border-color: #e2e8f0;
}

.message-card--welcome {
  background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%);
  border-left: 4px solid #fb923c;
}

.message-card--info {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
}

.message-card h3 {
  margin: 0;
  font-size: 16px;
  color: #0f172a;
  font-weight: 600;
}

.message-card p {
  margin: 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.7;
}

.message-time {
  font-size: 12px;
  color: #94a3b8;
  align-self: flex-end;
}
</style>
