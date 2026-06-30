export interface MessageItem {
  id: number
  sender: string
  title: string
  content: string
  time: string
}

const STORAGE_KEY = 'campus_market_messages'

export const fallbackMessages: MessageItem[] = [
  {
    id: 1,
    sender: '系统通知',
    title: '欢迎来到校园轻集市，我们已为你开启消息中心。',
    content: '你可以点击消息查看详情，和同学进行快速沟通。',
    time: '今天 14:35',
  },
  {
    id: 2,
    sender: '买家小李',
    title: '你好，这个商品还能便宜一点吗？',
    content: '我对你发布的二手书很感兴趣，想了解一下成色。',
    time: '今天 13:12',
  },
  {
    id: 3,
    sender: '拼单发起人',
    title: '拼单进度更新：已有 3 人参加',
    content: '当前拼单人数已达 3 人，还剩 2 个名额，快来参加吧。',
    time: '昨天 18:02',
  },
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

export function getMessages(): MessageItem[] {
  return readFromStorage(STORAGE_KEY, fallbackMessages)
}

function getCurrentTime(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function pushMessage(data: Omit<MessageItem, 'id' | 'time'>): MessageItem {
  const list = getMessages()
  const newItem: MessageItem = {
    ...data,
    id: list.length > 0 ? Math.max(...list.map((m) => Number(m.id) || 0)) + 1 : 1,
    time: getCurrentTime(),
  }
  list.unshift(newItem)
  writeToStorage(STORAGE_KEY, list)
  return newItem
}
