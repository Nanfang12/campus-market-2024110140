<script setup lang="ts">
// 表单数据
const formData = {
  name: '',
  price: '',
  publisherId: '',
  desc: ''
}
const submit = () => {
  console.log('发布商品', formData)
  alert('商品提交成功（模拟）')
}
</script>

<template>
  <div class="page-wrap">
    <h1 class="page-title">发布闲置商品</h1>
    <div class="simple-form">
      <div class="form-item">
        <label>商品名称</label>
        <input v-model="formData.name" type="text" placeholder="例：遮光床帘">
      </div>
      <div class="form-item">
        <label>商品价格（元）</label>
        <input v-model="formData.price" type="number" placeholder="输入售价">
      </div>
      <div class="form-item">
        <label>发布人ID</label>
        <input v-model="formData.publisherId" type="text" placeholder="输入你的学号/账号ID">
      </div>
      <div class="form-item">
        <label>简单描述</label>
        <input v-model="formData.desc" type="text" placeholder="简单写成色、交易说明">
      </div>
      <button class="submit-btn" @click="submit">提交发布</button>
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
.simple-form {
  max-width: 450px;
  gap: 16px;
  display: flex;
  flex-direction: column;
}
.form-item label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}
.form-item input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.submit-btn {
  width: fit-content;
  padding: 9px 22px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.submit-btn:hover {
  background: #337ecc;
}
</style>
