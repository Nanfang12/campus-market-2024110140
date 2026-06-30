<script setup lang="ts">
</script>

<template>
  <div class="home">
    <!-- 顶部欢迎横幅 -->
    <section class="hero" style="background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到<span class="highlight">校园轻集市</span></h1>
        <p class="hero-subtitle">轻量 · 可信 · 面向校园生活的便捷交易平台</p>
        <div class="hero-actions">
          <RouterLink to="/trade" class="btn-main">📦 逛二手</RouterLink>
          <RouterLink to="/publish" class="btn-ghost">✏️ 发布新信息</RouterLink>
        </div>
      </div>
      <div class="hero-visual">
        <div class="emoji-big">🏪</div>
      </div>
    </section>

    <!-- 功能模块入口 -->
    <section class="modules">
      <RouterLink to="/trade" class="module-card module-blue">
        <div class="module-icon">📚</div>
        <h3 class="module-title">二手交易</h3>
        <p class="module-desc">闲置书籍、电子产品、生活用品</p>
        <span class="module-link">去看看 →</span>
      </RouterLink>

      <RouterLink to="/lost-found" class="module-card module-orange">
        <div class="module-icon">🔍</div>
        <h3 class="module-title">失物招领</h3>
        <p class="module-desc">寻找丢失物品，帮助他人寻回</p>
        <span class="module-link">去看看 →</span>
      </RouterLink>

      <RouterLink to="/group-buy" class="module-card module-green">
        <div class="module-icon">🧋</div>
        <h3 class="module-title">拼单搭子</h3>
        <p class="module-desc">奶茶、外卖、团购一起更划算</p>
        <span class="module-link">去看看 →</span>
      </RouterLink>

      <RouterLink to="/errand" class="module-card module-purple">
        <div class="module-icon">🏃</div>
        <h3 class="module-title">跑腿委托</h3>
        <p class="module-desc">取快递、跨校区、代办事项</p>
        <span class="module-link">去看看 →</span>
      </RouterLink>
    </section>

    <!-- 底部提示 -->
    <section class="tips">
      <div class="tip-item">💡 小提示：所有信息需遵守校园规范，保持诚信友善</div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Hero 横幅 */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 48px;
  background: linear-gradient(135deg, #ffffff 0%, #eef2ff 100%);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(30, 41, 59, 0.06);
  border: 1px solid rgba(148, 163, 184, 0.15);
  gap: 24px;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
  line-height: 1.3;
}

.highlight {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-left: 8px;
}

.hero-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0 0 24px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-main {
  padding: 12px 24px;
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: #fff;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 14px rgba(251, 146, 60, 0.3);
}

.btn-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(251, 146, 60, 0.4);
}

.btn-ghost {
  padding: 12px 24px;
  background: #fff;
  color: #78350f;
  border: 1.5px solid #fed7aa;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-ghost:hover {
  border-color: #fb923c;
  color: #c2410c;
  background: #fff7ed;
}

.hero-visual {
  flex-shrink: 0;
}

.emoji-big {
  font-size: 120px;
  line-height: 1;
  filter: drop-shadow(0 10px 20px rgba(251, 146, 60, 0.15));
}

/* 功能模块 */
.modules {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.module-card {
  padding: 28px 20px;
  background: #fff;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1.5px solid rgba(226, 232, 240, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(30, 41, 59, 0.1);
}

.module-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  margin-bottom: 4px;
}

.module-blue .module-icon {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
}
.module-orange .module-icon {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
}
.module-green .module-icon {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
}
.module-purple .module-icon {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
}

.module-title {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin: 6px 0 4px;
}

.module-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

.module-link {
  margin-top: 12px;
  font-size: 13px;
  color: #c2410c;
  font-weight: 500;
}

/* 提示区 */
.tips {
  display: flex;
  justify-content: center;
}

.tip-item {
  padding: 14px 24px;
  background: #fff7ed;
  color: #9a3412;
  border-radius: 12px;
  font-size: 13px;
  border: 1px solid rgba(251, 146, 60, 0.3);
}

/* 响应式 */
@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    padding: 32px 24px;
    text-align: center;
  }
  .hero-actions {
    justify-content: center;
  }
  .emoji-big {
    font-size: 80px;
  }
  .modules {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .modules {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 24px;
  }
}
</style>
