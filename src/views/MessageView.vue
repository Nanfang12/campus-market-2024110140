<script setup lang="ts">
import { ref } from 'vue'

type MessageItem = {
  id: number
  sender: string
  title: string
  content: string
  time: string
}

const messages = ref<MessageItem[]>([
  {
    id: 1,
    sender: '系统通知',
    title: '欢迎来到校园轻集市，我们已为你开启消息中心。',
    content: '你可以点击消息查看详情，和同学进行快速沟通。',
    time: '今天 14:35',
  },
  {
    id: 2,
    sender: '买家小李',
    title: '你好，这个商品还能便宜一点吗？',
    content: '我对你发布的二手书很感兴趣，想了解一下成色。',
    time: '今天 13:12',
  },
  {
    id: 3,
    sender: '拼单发起人',
    title: '拼单进度更新：已有 3 人参加',
    content: '当前拼单人数已达 3 人，还剩 2 个名额，快来参加吧。',
    time: '昨天 18:02',
  },
])
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
  border-left: 5px solid #409eff;
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
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: inherit;
  text-decoration: none;
}
.msg-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12);
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
