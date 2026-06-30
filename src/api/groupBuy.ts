import http from './http'

export interface GroupBuyItem {
  id?: number
  title: string
  type: string
  targetCount: number
  currentCount: number
  deadline: string
  location: string
  publisher: string
  activityInfo?: string
  status: string
  description: string
  image: string
}

const STORAGE_KEY = 'campus_market_group_buys'

export const fallbackGroupBuys: GroupBuyItem[] = [
  { id: 1, title: '周五晚火锅拼单', type: '拼餐', targetCount: 6, currentCount: 3, deadline: '2026-06-05 17:00', location: '学校南门', publisher: '计算机学院学生', status: 'open', description: 'AA 制，人数够后统一预约。', activityInfo: '拼单活动：周五晚火锅拼单，请在截止日期前参与，达到人数后统一组织。', image: '🍲 火锅拼单' },
  { id: 2, title: '四六级资料团购', type: '学习资料', targetCount: 10, currentCount: 7, deadline: '2026-06-06 22:00', location: '线上确认', publisher: '外国语学院学生', status: 'open', description: '达到人数后统一下单。', activityInfo: '拼单活动：四六级资料团购，请在截止日期前参与，达到人数后统一组织。', image: '📖 四六级资料' },
  { id: 3, title: '夏日西瓜团购批发', type: '生鲜团购', targetCount: 8, currentCount: 4, deadline: '2026-06-07 18:00', location: '东门自提点', publisher: '生活班委', status: 'open', description: '整车拿货更便宜，按需拼团购买。', activityInfo: '拼单活动：夏日西瓜团购批发，请在截止日期前参与，达到人数后统一组织。', image: '🍉 西瓜团购' },
  { id: 4, title: '奶茶拼单满减活动', type: '拼餐', targetCount: 5, currentCount: 2, deadline: '2026-06-05 20:30', location: '学校北门奶茶店', publisher: '宿舍团长', status: 'open', description: '满30减12，凑单下单更划算。', activityInfo: '拼单活动：奶茶拼单满减活动，请在截止日期前参与，达到人数后统一组织。', image: '🧋 奶茶拼单' },
  { id: 5, title: '考研英语真题团购', type: '学习资料', targetCount: 12, currentCount: 9, deadline: '2026-06-08 12:00', location: '图书馆门口分发', publisher: '考研互助小组', status: 'open', description: '批量采购价格更低，全套真题带解析。', activityInfo: '拼单活动：考研英语真题团购，请在截止日期前参与，达到人数后统一组织。', image: '📚 考研真题' },
  { id: 6, title: '宿舍桶装水拼订', type: '生活用品团购', targetCount: 7, currentCount: 6, deadline: '2026-06-06 11:00', location: '各宿舍楼下配送', publisher: '楼栋生活干事', status: 'closed', description: '一次性订十桶有优惠，凑单配送上门。', activityInfo: '拼单活动：宿舍桶装水拼订，请在截止日期前参与，达到人数后统一组织。', image: '💧 桶装水' },
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

export function getGroupBuys(): GroupBuyItem[] {
  return readFromStorage(STORAGE_KEY, fallbackGroupBuys)
}

export async function createGroupBuy(data: GroupBuyItem): Promise<GroupBuyItem> {
  const list = getGroupBuys()
  const newId = list.length > 0 ? Math.max(...list.map(x => Number(x.id) || 0)) + 1 : 1
  const newItem: GroupBuyItem = { ...data, id: newId }
  list.unshift(newItem)
  writeToStorage(STORAGE_KEY, list)

  try {
    await http.post<GroupBuyItem>('/groupBuys', data)
  } catch {
    // 静默忽略
  }

  return newItem
}
