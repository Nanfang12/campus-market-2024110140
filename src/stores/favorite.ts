import { defineStore } from 'pinia'

export type FavoriteType = 'trade' | 'lostFound' | 'groupBuy' | 'errand'
export type FavoriteId = number | string

export interface FavoriteItem {
  id: FavoriteId
  type: FavoriteType
  title: string
  description: string
  location?: string
}

// 统一将 id 转为字符串比较，避免 number 与 string 不匹配
function sameId(a: FavoriteId, b: FavoriteId): boolean {
  return String(a) === String(b)
}

// 从 localStorage 读取收藏数据
function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem('campus-market-favorites')
    if (raw) return JSON.parse(raw) as FavoriteItem[]
  } catch {
    // 解析失败时静默忽略
  }
  return []
}

// 将收藏数据写入 localStorage
function saveFavorites(list: FavoriteItem[]) {
  try {
    localStorage.setItem('campus-market-favorites', JSON.stringify(list))
  } catch {
    // 存储失败时静默忽略
  }
}

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: loadFavorites() as FavoriteItem[],
  }),

  getters: {
    favoriteCount: (state) => state.favorites.length,
  },

  actions: {
    isFavorite(type: FavoriteType, id: FavoriteId) {
      return this.favorites.some((item) => item.type === type && sameId(item.id, id))
    },

    addFavorite(item: FavoriteItem) {
      if (!this.isFavorite(item.type, item.id)) {
        this.favorites.push(item)
        saveFavorites(this.favorites)
      }
    },

    removeFavorite(type: FavoriteType, id: FavoriteId) {
      this.favorites = this.favorites.filter((item) => {
        return !(item.type === type && sameId(item.id, id))
      })
      saveFavorites(this.favorites)
    },

    toggleFavorite(item: FavoriteItem) {
      if (this.isFavorite(item.type, item.id)) {
        this.removeFavorite(item.type, item.id)
      } else {
        this.addFavorite(item)
      }
    },
  },
})
