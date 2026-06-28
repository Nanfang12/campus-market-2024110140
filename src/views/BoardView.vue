<script setup lang="ts"></script>

<template>
  <div class="page-wrap">
    <h1 class="page-title">数据看板 · 统计概览</h1>
    <div class="stat-wrap">
      <div class="stat-card">
        <div class="stat-label">商品总数量</div>
        <div class="stat-num">128</div>
        <div class="stat-unit">件</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">发布用户总数</div>
        <div class="stat-num">36</div>
        <div class="stat-unit">人</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">未读消息总数</div>
        <div class="stat-num">9</div>
        <div class="stat-unit">条</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">本周新增发布</div>
        <div class="stat-num">23</div>
        <div class="stat-unit">条</div>
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
  margin-bottom: 28px;
  border-left: 5px solid #409eff;
  padding-left: 12px;
}
.stat-wrap {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.stat-card {
  width: 200px;
  padding: 24px 16px;
  background: linear-gradient(135deg, #409eff 0%, #7cbfff 100%);
  border-radius: 12px;
  color: #fff;
  text-align: center;
  box-shadow: 0 3px 12px rgba(64, 158, 255, 0.2);
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-4px);
}
.stat-label {
  font-size: 15px;
  opacity: 0.9;
  margin-bottom: 10px;
}
.stat-num {
  font-size: 36px;
  font-weight: bold;
  line-height: 1;
}
.stat-unit {
  font-size: 14px;
  margin-top: 6px;
  opacity: 0.85;
}
</style>
