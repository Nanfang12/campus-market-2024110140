import http from './http'

export interface TradeItem {
  id?: number
  title: string
  category: string
  price: number
  condition: string
  location: string
  publisher: string
  nickname?: string
  publishTime: string
  image: string
  status: string
  description: string
}

const STORAGE_KEY = 'campus_market_trades'

export const fallbackTrades: TradeItem[] = [
  { id: 1, title: '九成新机械键盘', category: '数码配件', price: 100, condition: '九成新', location: '东区宿舍', publisher: '软件工程 2023 级学生', publishTime: '2026-06-01 10:20', image: '⌨️ 机械键盘', status: 'open', description: '键盘使用正常，因更换设备转让。', nickname: '软件工程 2023 级学生' },
  { id: 2, title: '高等数学教材', category: '教材资料', price: 18, condition: '八成新', location: '图书馆门口', publisher: '数学学院学生', publishTime: '2026-06-01 14:30', image: '📖 高等数学教材', status: 'open', description: '教材有少量笔记，不影响使用。', nickname: '数学学院学生' },
  { id: 3, title: '蓝牙耳机半入耳式', category: '数码配件', price: 75, condition: '九成新', location: '南区3栋宿舍', publisher: '计算机2班学生', publishTime: '2026-06-02 09:15', image: '🎧 蓝牙耳机', status: 'open', description: '续航完好，无磕碰，配件齐全。', nickname: '计算机2班学生' },
  { id: 4, title: '大学英语四级真题全套', category: '教材资料', price: 12, condition: '七成新', location: '教学楼B区大厅', publisher: '经管学院学生', publishTime: '2026-06-02 16:40', image: '📚 四级真题', status: 'closed', description: '真题卷+解析册，适合备考四级。', nickname: '经管学院学生' },
  { id: 5, title: '折叠懒人书桌床上款', category: '生活用品', price: 35, condition: '八成新', location: '西区7栋宿舍', publisher: '汉语言专业学生', publishTime: '2026-06-03 11:22', image: '🛏️ 懒人书桌', status: 'open', description: '稳固不晃，宿舍床上看书追剧很合适。', nickname: '汉语言专业学生' },
  { id: 6, title: '羽毛球拍单支带球', category: '运动器材', price: 42, condition: '八成新', location: '学校羽毛球场', publisher: '体育选修课学生', publishTime: '2026-06-03 15:10', image: '🏸 羽毛球拍', status: 'open', description: '拍子线完好，附赠3个羽毛球。', nickname: '体育选修课学生' },
]

// —— localStorage 工具函数 —— //
function readFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return [...fallback]
    }
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : [...fallback]
  } catch {
    return [...fallback]
  }
}

function writeToStorage<T>(key: string, list: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // 忽略写入错误
  }
}

// 获取交易列表（优先本地缓存，不依赖网络）
export function getTrades(): TradeItem[] {
  return readFromStorage(STORAGE_KEY, fallbackTrades)
}

// 发布新商品（写入本地缓存 + 尝试写入 JSON Server）
export async function createTrade(data: TradeItem): Promise<TradeItem> {
  const list = getTrades()
  // 用当前时间作为唯一 ID
  const newId = list.length > 0 ? Math.max(...list.map(x => Number(x.id) || 0)) + 1 : 1
  const newItem: TradeItem = { ...data, id: newId }
  list.unshift(newItem) // 新发布的放在最前面
  writeToStorage(STORAGE_KEY, list)

  // 尝试写入 JSON Server（失败不影响）
  try {
    await http.post<TradeItem>('/trades', data)
  } catch {
    // 静默忽略
  }

  return newItem
}
