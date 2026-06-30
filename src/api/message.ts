import http from './http'

export interface MessageItem {
  id?: number | string
  sender: string
  title: string
  content: string
  time: string
}

export async function getMessages(): Promise<MessageItem[]> {
  const response = await http.get<MessageItem[]>('/messages')
  return response.data
}

export async function pushMessage(data: Omit<MessageItem, 'id' | 'time'>): Promise<MessageItem> {
  const newItem: MessageItem = {
    ...data,
    time: new Date().toLocaleString('zh-CN', { hour12: false }),
  }
  const response = await http.post<MessageItem>('/messages', newItem)
  return response.data
}
