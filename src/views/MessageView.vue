<script setup lang="ts"></script>

<template>
  <div class="page-wrap">
    <h1 class="page-title">我的消息</h1>
    <div class="msg-list">
      <div class="msg-item" v-for="n in 4" :key="n">
        <div class="msg-head">用户{{ 100 + n }}</div>
        <div class="msg-content">你发布的商品有人咨询，快来回复议价~</div>
        <div class="msg-time">今天 1{{ n }}:0{{ n }}</div>
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
  margin-bottom: 24px;
  border-left: 5px solid #409eff;
  padding-left: 12px;
}
.msg-list {
  max-width: 650px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.msg-item {
  padding: 18px 24px;
  border-bottom: 1px solid #f2f3f5;
  transition: background 0.2s;
}
.msg-item:last-child {
  border-bottom: none;
}
.msg-item:hover {
  background-color: #f8fafc;
}
.msg-head {
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}
.msg-content {
  font-size: 14px;
  color: #606266;
  margin-bottom: 6px;
}
.msg-time {
  font-size: 12px;
  color: #909399;
}
</style>
