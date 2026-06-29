import http from './http'

export interface ErrandItem {
  id: number
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
}

export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}
