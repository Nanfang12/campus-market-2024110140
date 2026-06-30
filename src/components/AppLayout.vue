<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-main">
      <RouterView :key="$route.fullPath" />
    </main>

    <footer class="app-footer">
      <span>© 2026 校园轻集市 · 轻量、可信、面向校园生活</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: linear-gradient(180deg, #fffbeb 0%, #fff7ed 100%);
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 28px 24px 40px;
}

.app-footer {
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  border-top: 1px solid rgba(229, 231, 235, 0.6);
}
</style>
