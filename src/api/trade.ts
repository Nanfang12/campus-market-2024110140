import http from './http'

export interface TradeItem {
  id: number | string
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

export async function getTrades(): Promise<TradeItem[]> {
  const response = await http.get<TradeItem[]>('/trades')
  return response.data
}

export async function createTrade(data: Omit<TradeItem, 'id'>): Promise<TradeItem> {
  const response = await http.post<TradeItem>('/trades', data)
  return response.data
}
export async function deleteTrade(id: number | string) {
  await http.delete('/trades/' + String(id))
}
