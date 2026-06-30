import http from './http'

export interface LostFoundItem {
  id?: number | string
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

export async function getLostFounds(): Promise<LostFoundItem[]> {
  const response = await http.get<LostFoundItem[]>('/lostFounds')
  return response.data
}

export async function createLostFound(data: Omit<LostFoundItem, 'id'>): Promise<LostFoundItem> {
  const response = await http.post<LostFoundItem>('/lostFounds', data)
  return response.data
}
