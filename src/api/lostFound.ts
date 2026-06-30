import http from './http'

export interface LostFoundItem {
  id?: number
  title: string
  type: 'lost' | 'found'
  itemName: string
  location: string
  eventTime: string
  contact: string
  publisher?: string
  nickname?: string
  image: string
  status: string
  description: string
}

const STORAGE_KEY = 'campus_market_lost_founds'

export const fallbackLostFounds: LostFoundItem[] = [
  { id: 1, title: '寻找黑色校园卡', type: 'lost', itemName: '校园卡', location: '一食堂附近', eventTime: '2026-06-02 12:10', contact: '站内消息联系', status: 'open', description: '校园卡卡套为黑色，内有学生证。', publisher: '校园用户', nickname: '失主', image: '💳 黑色校园卡' },
  { id: 2, title: '拾到蓝色雨伞', type: 'found', itemName: '雨伞', location: '教学楼 A 区', eventTime: '2026-06-02 18:40', contact: '站内消息联系', status: 'open', description: '雨伞放在 A 区一楼值班室。', publisher: '校园用户', nickname: '失主', image: '☂️ 蓝色雨伞' },
  { id: 3, title: '丢失白色有线耳机', type: 'lost', itemName: '有线耳机', location: '图书馆三楼自习区', eventTime: '2026-06-03 08:55', contact: '站内消息联系', status: 'open', description: '白色Type-C接口耳机，放在桌面遗忘带走。', publisher: '校园用户', nickname: '失主', image: '🎧 白色有线耳机' },
  { id: 4, title: '捡到一把钥匙串', type: 'found', itemName: '钥匙', location: '二食堂门口长椅', eventTime: '2026-06-03 12:30', contact: '站内消息联系核对信息', status: 'open', description: '包含宿舍钥匙+柜子钥匙，带小熊挂件。', publisher: '校园用户', nickname: '失主', image: '🔑 钥匙串' },
  { id: 5, title: '遗失透明水杯', type: 'lost', itemName: '塑料水杯', location: '操场看台', eventTime: '2026-06-03 17:20', contact: '站内私信认领', status: 'closed', description: '500ml透明水杯，杯身有贴纸装饰。', publisher: '校园用户', nickname: '失主', image: '🥤 透明水杯' },
  { id: 6, title: '捡到一本笔记本', type: 'found', itemName: '笔记本', location: '教学楼C区205教室', eventTime: '2026-06-04 09:10', contact: '核对姓名后认领', status: 'open', description: '封面黑色，里面记有高数课堂笔记。', publisher: '校园用户', nickname: '失主', image: '📓 笔记本' },
]

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

export function getLostFounds(): LostFoundItem[] {
  return readFromStorage(STORAGE_KEY, fallbackLostFounds)
}

export async function createLostFound(data: LostFoundItem): Promise<LostFoundItem> {
  const list = getLostFounds()
  const newId = list.length > 0 ? Math.max(...list.map(x => Number(x.id) || 0)) + 1 : 1
  const newItem: LostFoundItem = { ...data, id: newId }
  list.unshift(newItem)
  writeToStorage(STORAGE_KEY, list)

  try {
    await http.post<LostFoundItem>('/lostFounds', data)
  } catch {
    // 静默忽略
  }

  return newItem
}
