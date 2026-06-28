<script setup lang="ts"></script>

<template>
  <div class="page-wrap">
    <h1 class="page-title">个人中心</h1>
    <div class="profile-card">
      <div class="avatar-box">
        <div class="avatar">U</div>
      </div>
      <div class="info-row">
        <span class="info-label">用户名</span>
        <span class="info-value">校园集市用户</span>
      </div>
      <div class="info-row">
        <span class="info-label">注册身份</span>
        <span class="info-value">在校学生</span>
      </div>
      <div class="info-row">
        <span class="info-label">发布商品总数</span>
        <span class="info-value">12 件</span>
      </div>
      <div class="info-row">
        <span class="info-label">成交订单</span>
        <span class="info-value">5 笔</span>
      </div>
      <div class="btn-group">
        <button class="edit-btn">编辑资料</button>
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
.profile-card {
  max-width: 420px;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  text-align: center;
}
.avatar-box {
  margin-bottom: 22px;
}
.avatar {
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  background: #409eff;
  color: #fff;
  font-size: 32px;
  margin: 0 auto;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f2f3f5;
}
.info-row:last-of-type {
  border-bottom: none;
}
.info-label {
  color: #909399;
}
.info-value {
  color: #303133;
  font-weight: 500;
}
.btn-group {
  margin-top: 26px;
}
.edit-btn {
  padding: 9px 24px;
  border: 1px solid #409eff;
  background: #fff;
  color: #409eff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.edit-btn:hover {
  background-color: #409eff;
  color: #fff;
}
</style>
