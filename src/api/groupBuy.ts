import http from './http'

export interface GroupBuyItem {
  id: number | string
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

export async function getGroupBuys(): Promise<GroupBuyItem[]> {
  const response = await http.get<GroupBuyItem[]>('/groupBuys')
  return response.data
}

export async function createGroupBuy(data: Omit<GroupBuyItem, 'id'>): Promise<GroupBuyItem> {
  const response = await http.post<GroupBuyItem>('/groupBuys', data)
  return response.data
}
export async function deleteGroupBuy(id: number | string) {
  await http.delete('/groupBuys/' + String(id))
}
