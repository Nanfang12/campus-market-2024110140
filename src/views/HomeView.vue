<script setup lang="ts"></script>

<template>
  <div class="page-wrap">
    <h1 class="page-title">首页</h1>
    <div class="welcome-card">
      <h2>项目启动成功</h2>
      <p>请按照每日任务要求，完成代码、证据卡和自动化检测。</p>
      <div class="tip-text">校园轻集市 · 二手物品交易前端实践项目</div>
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
.welcome-card {
  padding: 36px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  max-width: 700px;
}
.welcome-card h2 {
  font-size: 24px;
  color: #303133;
  margin: 0 0 16px;
}
.welcome-card p {
  font-size: 16px;
  color: #606266;
  line-height: 1.7;
  margin: 0 0 12px;
}
.tip-text {
  font-size: 14px;
  color: #909399;
}
</style>
