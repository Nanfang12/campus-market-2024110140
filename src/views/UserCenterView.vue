<template>
  <div class="page-wrap">
    <h1 class="page-title">个人中心</h1>
    <div class="profile-card">
      <div class="avatar-box">
        <div class="avatar">{{ avatarText }}</div>
      </div>
      <div class="info-row">
        <span class="info-label">用户名</span>
        <template v-if="!isEditing">
          <span class="info-value">{{ profile.username }}</span>
        </template>
        <input
          v-else
          v-model="profile.username"
          class="info-input"
          placeholder="请输入用户名"
        />
      </div>
      <div class="info-row">
        <span class="info-label">注册身份</span>
        <template v-if="!isEditing">
          <span class="info-value">{{ profile.identity }}</span>
        </template>
        <input
          v-else
          v-model="profile.identity"
          class="info-input"
          placeholder="请输入身份信息"
        />
      </div>
      <div class="info-row">
        <span class="info-label">联系电话</span>
        <template v-if="!isEditing">
          <span class="info-value">{{ profile.phone }}</span>
        </template>
        <input
          v-else
          v-model="profile.phone"
          class="info-input"
          placeholder="请输入联系电话"
        />
      </div>
      <div class="info-row">
        <span class="info-label">邮箱地址</span>
        <template v-if="!isEditing">
          <span class="info-value">{{ profile.email }}</span>
        </template>
        <input
          v-else
          v-model="profile.email"
          class="info-input"
          placeholder="请输入邮箱地址"
        />
      </div>
      <div class="info-row">
        <span class="info-label">发布商品总数</span>
        <span class="info-value">{{ profile.itemCount }} 件</span>
      </div>
      <div class="info-row">
        <span class="info-label">成交订单</span>
        <span class="info-value">{{ profile.orders }} 笔</span>
      </div>
      <div class="btn-group">
        <button
          v-if="!isEditing"
          class="edit-btn"
          @click="isEditing = true"
        >
          编辑资料
        </button>
        <div v-else class="action-row">
          <button class="save-btn" @click="saveProfile">保存修改</button>
          <button class="cancel-btn" @click="cancelEdit">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

type UserProfile = {
  username: string
  identity: string
  phone: string
  email: string
  itemCount: number
  orders: number
}

const isEditing = ref<boolean>(false)
const originalProfile = reactive<UserProfile>({
  username: '校园集市用户',
  identity: '在校学生',
  phone: '135****8888',
  email: 'user@example.com',
  itemCount: 12,
  orders: 5,
})

const profile = reactive<UserProfile>({
  username: originalProfile.username,
  identity: originalProfile.identity,
  phone: originalProfile.phone,
  email: originalProfile.email,
  itemCount: originalProfile.itemCount,
  orders: originalProfile.orders,
})

const avatarText = computed(() => {
  return profile.username?.trim()?.length > 0
    ? profile.username.trim().charAt(0).toUpperCase()
    : 'U'
})

function saveProfile() {
  originalProfile.username = profile.username
  originalProfile.identity = profile.identity
  originalProfile.phone = profile.phone
  originalProfile.email = profile.email
  isEditing.value = false
}

function cancelEdit() {
  profile.username = originalProfile.username
  profile.identity = originalProfile.identity
  profile.phone = originalProfile.phone
  profile.email = originalProfile.email
  isEditing.value = false
}
</script>

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
  max-width: 520px;
  padding: 32px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  text-align: center;
}
.avatar-box {
  margin-bottom: 22px;
}
.avatar {
  width: 88px;
  height: 88px;
  line-height: 88px;
  border-radius: 50%;
  background: #409eff;
  color: #fff;
  font-size: 34px;
  margin: 0 auto;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 14px 0;
  border-bottom: 1px solid #f2f3f5;
}
.info-row:last-of-type {
  border-bottom: none;
}
.info-label {
  color: #64748b;
}
.info-value {
  color: #334155;
  font-weight: 600;
}
.info-input {
  width: 100%;
  max-width: 240px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-size: 14px;
}
.btn-group {
  margin-top: 28px;
}
.edit-btn,
.save-btn,
.cancel-btn {
  padding: 10px 24px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
.edit-btn {
  background: #ffffff;
  color: #409eff;
  border: 1px solid #409eff;
}
.edit-btn:hover {
  background: #409eff;
  color: #ffffff;
}
.action-row {
  display: flex;
  justify-content: center;
  gap: 14px;
}
.save-btn {
  background: #409eff;
  color: #ffffff;
}
.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}
.cancel-btn:hover {
  background: #e2e8f0;
}
</style>
