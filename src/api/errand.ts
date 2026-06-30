import http from './http'

export interface ErrandItem {
  id?: number
  title: string
  taskType: string
  reward: number
  from: string
  to: string
  deadline: string
  publisher: string
  nickname?: string
  status: string
  description: string
  image: string
}

const STORAGE_KEY = 'campus_market_errands'

export const fallbackErrands: ErrandItem[] = [
  { id: 1, title: '帮取快递到宿舍楼下', taskType: '取快递', reward: 3, from: '菜鸟驿站', to: '西区 5 栋', deadline: '2026-06-03 19:00', publisher: '西区学生', status: 'open', description: '快递较轻，送到宿舍楼下即可。', nickname: '西区学生', image: '📦 取快递' },
  { id: 2, title: '帮买一份晚餐', taskType: '代买', reward: 5, from: '二食堂', to: '实验楼 302', deadline: '2026-06-03 18:30', publisher: '实验室学生', status: 'open', description: '需要在 18:30 前送到。', nickname: '实验室学生', image: '🍱 代买晚餐' },
  { id: 3, title: '图书馆还书代办', taskType: '代办跑腿', reward: 2, from: '南区2栋宿舍', to: '图书馆还书口', deadline: '2026-06-04 17:00', publisher: '有事外出学生', status: 'open', description: '两本书，帮忙归还避免超期扣费。', nickname: '有事外出学生', image: '📚 还书代办' },
  { id: 4, title: '代取美团外卖送至教室', taskType: '取外卖', reward: 4, from: '学校南门外卖柜', to: '教学楼B区401', deadline: '2026-06-04 12:20', publisher: '上课赶不及学生', status: 'open', description: '饭点走不开，帮忙取上楼。', nickname: '上课赶不及学生', image: '🥡 取外卖' },
  { id: 5, title: '代买文具送到宿舍', taskType: '代买', reward: 3.5, from: '校内文具店', to: '东区1栋406', deadline: '2026-06-05 10:00', publisher: '早起赶作业学生', status: 'open', description: '需要中性笔、草稿本，买完送货上门。', nickname: '早起赶作业学生', image: '✏️ 买文具' },
  { id: 6, title: '帮忙送物品到隔壁校区', taskType: '跨校跑腿', reward: 8, from: '本部校门口', to: '分校区宿舍区', deadline: '2026-06-05 15:00', publisher: '跨校区同学', status: 'closed', description: '小件文件，需要往返两校区递送。', nickname: '跨校区同学', image: '🏫 跨校区跑腿' },
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

export function getErrands(): ErrandItem[] {
  return readFromStorage(STORAGE_KEY, fallbackErrands)
}

export async function createErrand(data: ErrandItem): Promise<ErrandItem> {
  const list = getErrands()
  const newId = list.length > 0 ? Math.max(...list.map(x => Number(x.id) || 0)) + 1 : 1
  const newItem: ErrandItem = { ...data, id: newId }
  list.unshift(newItem)
  writeToStorage(STORAGE_KEY, list)

  try {
    await http.post<ErrandItem>('/errands', data)
  } catch {
    // 静默忽略
  }

  return newItem
}
