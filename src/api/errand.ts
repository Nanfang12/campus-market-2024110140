import http from './http'

export interface ErrandItem {
  id: number | string
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

export async function getErrands(): Promise<ErrandItem[]> {
  const response = await http.get<ErrandItem[]>('/errands')
  return response.data
}

export async function createErrand(data: Omit<ErrandItem, 'id'>): Promise<ErrandItem> {
  const response = await http.post<ErrandItem>('/errands', data)
  return response.data
}
export async function deleteErrand(id: number | string) {
  await http.delete('/errands/' + String(id))
}
