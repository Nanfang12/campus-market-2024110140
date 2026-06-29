import http from './http'

export interface TradeItem {
  id: number
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

export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}
