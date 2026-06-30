<script setup lang="ts">
import { getMessages, type MessageItem } from '../api/message'
import { computed } from 'vue'

const messages = computed<MessageItem[]>(() => getMessages())
</script>

<template>
  <div class="page-wrap">
    <h1 class="page-title">我的消息</h1>
    <div class="msg-list">
      <router-link
        class="msg-item"
        v-for="item in messages"
        :key="item.id"
        :to="`/message/${item.id}`"
      >
        <div class="msg-top">
          <span class="msg-head">{{ item.sender }}</span>
          <span class="msg-time">{{ item.time }}</span>
        </div>
        <div class="msg-title">{{ item.title }}</div>
        <div class="msg-content">{{ item.content }}</div>
      </router-link>
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
  border-left: 5px solid #fb923c;
  padding-left: 12px;
}
.msg-list {
  display: grid;
  gap: 16px;
  max-width: 700px;
}
.msg-item {
  display: block;
  padding: 22px 24px;
  background: #ffffff;
  border-radius: 18px;
  border: 1.5px solid rgba(251, 146, 60, 0.18);
  box-shadow: 0 10px 28px rgba(251, 146, 60, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  color: inherit;
  text-decoration: none;
}
.msg-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(251, 146, 60, 0.18);
  border-color: #fb923c;
}
.msg-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}
.msg-head {
  font-weight: 700;
  color: #1f2937;
}
.msg-title {
  font-size: 16px;
  color: #0f172a;
  margin-bottom: 10px;
}
.msg-content {
  font-size: 15px;
  color: #475569;
  line-height: 1.7;
}
.msg-time {
  white-space: nowrap;
  font-size: 13px;
  color: #64748b;
}
</style>
