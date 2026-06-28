<script setup lang="ts"></script>

<template>
  <main class="app">
    <h1>校园轻集市</h1>
    <p>AI 辅助前端工程实践种子项目</p>

    <el-menu mode="horizontal" router class="nav-menu">
      <el-menu-item index="/home">首页</el-menu-item>
      <el-menu-item index="/list">列表页</el-menu-item>
      <el-menu-item index="/publish">发布页</el-menu-item>
      <el-menu-item index="/message">消息页</el-menu-item>
      <el-menu-item index="/profile">个人中心</el-menu-item>
      <el-menu-item index="/board">看板页</el-menu-item>
    </el-menu>

    <router-view />
  </main>
</template>

<style scoped>
.app {
  padding: 32px;
}
.nav-menu {
  margin: 20px 0;
}
</style>
