<template>
  <header class="app-header">
    <div class="container">
      <RouterLink to="/" class="brand">
        <span class="logo-icon">🎓</span>
        <span class="logo-text">校园轻集市</span>
      </RouterLink>

      <nav class="nav-center">
        <RouterLink to="/" class="nav-item">首页</RouterLink>
        <RouterLink to="/trade" class="nav-item">二手交易</RouterLink>
        <RouterLink to="/lost-found" class="nav-item">失物招领</RouterLink>
        <RouterLink to="/group-buy" class="nav-item">拼单搭子</RouterLink>
        <RouterLink to="/errand" class="nav-item">跑腿委托</RouterLink>
      </nav>

      <div class="nav-right">
        <RouterLink to="/publish" class="btn-primary">发布</RouterLink>
        <RouterLink to="/message" class="btn-icon" title="消息">
          <span class="icon">💬</span>
        </RouterLink>
        <RouterLink to="/user" class="btn-icon" title="我的">👤</RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 58px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.7);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.container {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: inherit;
  font-weight: 700;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 17px;
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  padding: 8px 16px;
  font-size: 14px;
  color: #475569;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.nav-item.router-link-active {
  color: #c2410c;
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.10) 0%, rgba(249, 115, 22, 0.10) 100%);
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  padding: 8px 18px;
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(251, 146, 60, 0.28);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(251, 146, 60, 0.4);
}

.btn-icon {
  position: relative;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  text-decoration: none;
  font-size: 18px;
  transition: background 0.15s ease;
}

.btn-icon:hover {
  background: #fff7ed;
}
</style>
