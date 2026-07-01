<template>
  <section class="page">
    <!-- 个人资料卡 -->
    <div class="profile-card">
      <div class="avatar">{{ (editing ? tempName : userStore.name).slice(0, 1) || '我' }}</div>
      <div class="profile-info">
        <template v-if="!editing">
          <div class="profile-name-row">
            <h1>{{ userStore.name || '当前用户' }}</h1>
            <span class="profile-badge">校园用户</span>
            <button class="edit-btn" @click="startEdit">编辑资料</button>
          </div>

          <div class="profile-details">
            <div class="detail-item">
              <span class="detail-label">学号</span>
              <span class="detail-value">{{ userStore.studentId || '未设置' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">学院</span>
              <span class="detail-value">{{ userStore.college || '未设置' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">专业</span>
              <span class="detail-value">{{ userStore.major || '未设置' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">年级</span>
              <span class="detail-value">{{ userStore.grade || '未设置' }}</span>
            </div>
          </div>

          <p class="profile-desc">{{ userStore.description || '暂无个人描述' }}</p>
        </template>

        <template v-else>
          <div class="edit-row">
            <label class="edit-label">姓名</label>
            <input v-model="tempName" type="text" class="edit-input" maxlength="20" placeholder="请输入姓名" />
          </div>
          <div class="edit-row">
            <label class="edit-label">学号</label>
            <input v-model="tempStudentId" type="text" class="edit-input" maxlength="20" placeholder="请输入学号" />
          </div>
          <div class="edit-row">
            <label class="edit-label">学院</label>
            <input v-model="tempCollege" type="text" class="edit-input" maxlength="30" placeholder="请输入学院" />
          </div>
          <div class="edit-row">
            <label class="edit-label">专业</label>
            <input v-model="tempMajor" type="text" class="edit-input" maxlength="30" placeholder="请输入专业" />
          </div>
          <div class="edit-row">
            <label class="edit-label">年级</label>
            <input v-model="tempGrade" type="text" class="edit-input" maxlength="10" placeholder="如：2023级" />
          </div>
          <div class="edit-row">
            <label class="edit-label">个人描述</label>
            <input v-model="tempDescription" type="text" class="edit-input" maxlength="50" placeholder="一句话介绍自己" />
          </div>
          <div class="edit-actions">
            <button class="save-btn" @click="saveEdit">保存修改</button>
            <button class="cancel-btn" @click="cancelEdit">取消</button>
          </div>
        </template>

        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-num">{{ favoriteStore.favorites.length }}</span>
            <span class="stat-label">收藏</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ myPublications.length }}</span>
            <span class="stat-label">发布</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的收藏 -->
    <div class="panel">
      <div class="panel-header">
        <h2>我的收藏</h2>
        <span class="panel-count">{{ favoriteStore.favorites.length }} 项</span>
      </div>

      <EmptyState v-if="favoriteStore.favorites.length === 0" text="暂无收藏内容，去列表页点击 ⭐ 收藏吧" />

      <div v-else class="compact-list">
        <router-link
          v-for="item in favoriteStore.favorites"
          :key="item.type + '-' + String(item.id)"
          :to="getDetailPath(item.type, item.id)"
          class="compact-item"
        >
          <div class="compact-item__icon">{{ getTypeEmoji(item.type) }}</div>
          <div class="compact-item__content">
            <div class="compact-item__title">{{ item.title }}</div>
            <div class="compact-item__desc">{{ item.description }}</div>
            <div class="compact-item__meta">
              <span class="compact-item__tag">{{ getTypeLabel(item.type) }}</span>
              <span v-if="item.location" class="compact-item__loc">📍 {{ item.location }}</span>
            </div>
          </div>
          <button
            class="compact-item__remove"
            @click.stop.prevent="favoriteStore.removeFavorite(item.type, item.id)"
            title="取消收藏"
          >✕</button>
        </router-link>
      </div>
    </div>

    <!-- 我的发布 -->
    <div class="panel">
      <div class="panel-header">
        <h2>我的发布</h2>
        <span class="panel-count">{{ myPublications.length }} 项</span>
      </div>

      <EmptyState v-if="myPublications.length === 0" text="暂无发布内容，去发布你的第一条校园信息吧" />

      <div v-else class="compact-list">
        <router-link
          v-for="item in myPublications"
          :key="item.type + '-' + String(item.id)"
          :to="getDetailPath(item.type, item.id)"
          class="compact-item"
        >
          <div class="compact-item__icon">{{ getTypeEmoji(item.type) }}</div>
          <div class="compact-item__content">
            <div class="compact-item__title">{{ item.title }}</div>
            <div class="compact-item__desc">{{ item.description }}</div>
            <div class="compact-item__meta">
              <span class="compact-item__tag">{{ getTypeLabel(item.type) }}</span>
              <span v-if="item.location" class="compact-item__loc">📍 {{ item.location }}</span>
              <span v-if="item.time" class="compact-item__time">🕒 {{ item.time }}</span>
            </div>
          </div>
          <button
            class="compact-item__delete"
            @click.stop.prevent="handleDelete(item)"
            title="删除发布"
          >🗑️</button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import { useFavoriteStore, type FavoriteType } from '../stores/favorite'
import { useUserStore } from '../stores/user'
import { getTrades, deleteTrade, type TradeItem } from '../api/trade'
import { getLostFounds, deleteLostFound, type LostFoundItem } from '../api/lostFound'
import { getGroupBuys, deleteGroupBuy, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, deleteErrand, type ErrandItem } from '../api/errand'

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const trades = ref<TradeItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])

const editing = ref(false)
const tempName = ref('')
const tempStudentId = ref('')
const tempCollege = ref('')
const tempMajor = ref('')
const tempGrade = ref('')
const tempDescription = ref('')

function startEdit() {
  tempName.value = userStore.name
  tempStudentId.value = userStore.studentId
  tempCollege.value = userStore.college
  tempMajor.value = userStore.major
  tempGrade.value = userStore.grade
  tempDescription.value = userStore.description
  editing.value = true
}

function saveEdit() {
  const name = tempName.value.trim() || userStore.name
  userStore.updateProfile({
    name,
    studentId: tempStudentId.value.trim(),
    college: tempCollege.value.trim(),
    major: tempMajor.value.trim(),
    grade: tempGrade.value.trim(),
    description: tempDescription.value.trim(),
  })
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}

interface PublicationItem {
  id: number | string
  type: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  title: string
  description: string
  location?: string
  time?: string
}

const myPublications = computed<PublicationItem[]>(() => {
  const currentUser = userStore.displayName
  const list: PublicationItem[] = []

  trades.value
    .filter((item) => item.publisher === currentUser)
    .forEach((item) => {
      list.push({
        id: item.id,
        type: 'trade',
        title: item.title,
        description: item.description,
        location: item.location,
        time: item.publishTime,
      })
    })

  lostFounds.value
    .filter((item) => (item.publisher || '') === currentUser)
    .forEach((item) => {
      list.push({
        id: item.id,
        type: 'lostFound',
        title: item.title,
        description: item.description,
        location: item.location,
        time: item.eventTime,
      })
    })

  groupBuys.value
    .filter((item) => item.publisher === currentUser)
    .forEach((item) => {
      list.push({
        id: item.id,
        type: 'groupBuy',
        title: item.title,
        description: item.description,
        location: item.location,
        time: item.deadline,
      })
    })

  errands.value
    .filter((item) => item.publisher === currentUser)
    .forEach((item) => {
      list.push({
        id: item.id,
        type: 'errand',
        title: item.title,
        description: item.description,
        location: item.from + ' → ' + item.to,
        time: item.deadline,
      })
    })

  return list
})

async function handleDelete(item: PublicationItem) {
  const ok = window.confirm('确认删除《' + item.title + '》？删除后不可恢复。')
  if (!ok) return

  try {
    switch (item.type) {
      case 'trade':
        await deleteTrade(item.id)
        trades.value = trades.value.filter((x) => String(x.id) !== String(item.id))
        break
      case 'lostFound':
        await deleteLostFound(item.id)
        lostFounds.value = lostFounds.value.filter((x) => String(x.id) !== String(item.id))
        break
      case 'groupBuy':
        await deleteGroupBuy(item.id)
        groupBuys.value = groupBuys.value.filter((x) => String(x.id) !== String(item.id))
        break
      case 'errand':
        await deleteErrand(item.id)
        errands.value = errands.value.filter((x) => String(x.id) !== String(item.id))
        break
    }
  } catch (e) {
    console.error('删除失败：', e)
    alert('删除失败，请稍后重试')
  }
}

function getDetailPath(type: FavoriteType, id: number | string): string {
  const map: Record<FavoriteType, string> = {
    trade: '/trade',
    lostFound: '/lost-found',
    groupBuy: '/group-buy',
    errand: '/errand',
  }
  return map[type] + '/' + String(id)
}

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    trade: '二手交易',
    lostFound: '失物招领',
    groupBuy: '拼单搭子',
    errand: '跑腿委托',
  }
  return map[type] || '校园信息'
}

function getTypeEmoji(type: string): string {
  const map: Record<string, string> = {
    trade: '📦',
    lostFound: '🔍',
    groupBuy: '🧋',
    errand: '🏃',
  }
  return map[type] || '📋'
}

onMounted(async () => {
  try {
    const [resTrades, resLostFounds, resGroupBuys, resErrands] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])
    trades.value = resTrades
    lostFounds.value = resLostFounds
    groupBuys.value = resGroupBuys
    errands.value = resErrands
  } catch (e) {
    console.error('加载我的发布失败：', e)
  }
})
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }

.profile-card {
  padding: 28px;
  border-radius: 20px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 1.5px solid rgba(251, 146, 60, 0.2);
  display: flex; align-items: flex-start; gap: 24px;
  box-shadow: 0 8px 24px rgba(251, 146, 60, 0.1);
}
.avatar {
  width: 80px; height: 80px; border-radius: 50%;
  display: grid; place-items: center; background: #fff;
  color: #ea580c; font-size: 32px; font-weight: 700;
  border: 3px solid #fff; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.15);
  flex-shrink: 0; margin-top: 4px;
}
.profile-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.profile-name-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.profile-name-row h1 { margin: 0; font-size: 24px; color: #7c2d12; font-weight: 700; }
.profile-badge {
  padding: 4px 12px; border-radius: 999px; background: #fff; color: #ea580c;
  font-size: 12px; font-weight: 600; border: 1px solid rgba(234, 88, 12, 0.3);
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 20px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #fed7aa;
}
.detail-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.detail-label { flex-shrink: 0; color: #ea580c; font-weight: 600; min-width: 36px; }
.detail-value { color: #7c2d12; }

.profile-desc {
  margin: 0; color: #9a3412; font-size: 14px;
  padding: 10px 14px; background: #fff; border-radius: 10px;
  border: 1px dashed #fed7aa; word-break: break-word;
}

.edit-row { display: flex; align-items: center; gap: 12px; }
.edit-label { flex-shrink: 0; font-size: 14px; color: #7c2d12; font-weight: 600; width: 68px; }
.edit-input {
  flex: 1; min-width: 0; padding: 8px 14px;
  border: 1.5px solid rgba(234, 88, 12, 0.25); border-radius: 10px;
  background: #fff; color: #7c2d12; font-size: 14px; outline: none;
  transition: all 0.15s ease;
}
.edit-input:focus { border-color: #fb923c; box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.12); }
.edit-actions { display: flex; gap: 10px; margin-top: 4px; }

.edit-btn, .save-btn, .cancel-btn {
  padding: 7px 18px; border-radius: 10px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.15s ease; border: 1.5px solid transparent;
}
.edit-btn { background: linear-gradient(135deg, #fb923c 0%, #f97316 100%); color: #fff; box-shadow: 0 3px 8px rgba(251, 146, 60, 0.25); }
.save-btn { background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%); color: #fff; box-shadow: 0 3px 8px rgba(234, 88, 12, 0.25); }
.cancel-btn { background: #fff; color: #ea580c; border-color: rgba(234, 88, 12, 0.35); }

.profile-stats {
  display: flex; align-items: center; gap: 20px; padding-top: 12px;
  border-top: 1px dashed rgba(234, 88, 12, 0.2);
}
.stat-item { display: flex; flex-direction: column; gap: 2px; }
.stat-num { font-size: 22px; font-weight: 700; color: #c2410c; }
.stat-label { font-size: 12px; color: #9a3412; }
.stat-divider { width: 1px; height: 28px; background: rgba(234, 88, 12, 0.2); }

.panel {
  padding: 24px; border-radius: 20px; background: #fff;
  border: 1.5px solid rgba(251, 146, 60, 0.15);
  box-shadow: 0 4px 16px rgba(251, 146, 60, 0.06);
}
.panel-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px dashed #fed7aa;
}
.panel-header h2 {
  margin: 0; font-size: 18px; color: #7c2d12; font-weight: 700;
  display: flex; align-items: center; gap: 10px;
}
.panel-header h2::before {
  content: ''; display: inline-block; width: 4px; height: 18px;
  border-radius: 4px; background: linear-gradient(180deg, #fb923c, #f97316);
}
.panel-count {
  font-size: 13px; color: #ea580c; font-weight: 600;
  padding: 4px 12px; background: #fff7ed; border-radius: 999px;
}

.compact-list { display: flex; flex-direction: column; gap: 10px; }
.compact-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px; border-radius: 12px; background: #fff7ed;
  border: 1px solid #fed7aa; text-decoration: none; color: inherit;
  transition: all 0.15s ease; cursor: pointer;
}
.compact-item:hover {
  background: #ffedd5; border-color: #fb923c;
  transform: translateX(3px); box-shadow: 0 2px 8px rgba(251, 146, 60, 0.15);
}
.compact-item__icon {
  flex-shrink: 0; width: 44px; height: 44px; border-radius: 10px;
  background: #fff; display: grid; place-items: center; font-size: 22px;
  box-shadow: 0 2px 6px rgba(234, 88, 12, 0.1);
}
.compact-item__content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.compact-item__title { font-size: 15px; font-weight: 600; color: #7c2d12; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.compact-item__desc { font-size: 13px; color: #78716c; line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.compact-item__meta { display: flex; align-items: center; gap: 12px; margin-top: 2px; flex-wrap: wrap; }
.compact-item__tag { font-size: 11px; font-weight: 600; color: #ea580c; padding: 2px 8px; background: #fff; border-radius: 999px; border: 1px solid #fed7aa; }
.compact-item__loc, .compact-item__time { font-size: 12px; color: #9a3412; }

.compact-item__remove {
  flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%;
  border: 1.5px solid #fed7aa; background: #fff; color: #c2410c;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.15s ease; display: grid; place-items: center;
}
.compact-item__remove:hover {
  background: #c2410c; color: #fff; border-color: #c2410c; transform: scale(1.08);
}

.compact-item__delete {
  flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px;
  border: 1.5px solid #fecaca; background: #fef2f2; color: #b91c1c;
  font-size: 16px; cursor: pointer;
  transition: all 0.15s ease; display: grid; place-items: center;
}
.compact-item__delete:hover {
  background: #dc2626; color: #fff; border-color: #dc2626; transform: scale(1.08);
}

@media (max-width: 560px) {
  .profile-card { padding: 20px; flex-direction: column; text-align: center; align-items: center; }
  .profile-info { width: 100%; align-items: stretch; text-align: left; }
  .profile-name-row { justify-content: center; }
  .profile-stats { justify-content: center; }
  .profile-details { grid-template-columns: 1fr; text-align: left; }
  .edit-row { flex-direction: column; align-items: stretch; gap: 6px; }
  .edit-label { width: auto; text-align: left; }
  .edit-actions { justify-content: center; }
  .compact-item { padding: 12px 14px; }
  .compact-item__icon { width: 38px; height: 38px; font-size: 18px; }
  .compact-item__title { font-size: 14px; }
}
</style>
