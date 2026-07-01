import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '当前用户',
    studentId: '',
    college: '',
    major: '',
    grade: '',
    description: '',
  }),

  getters: {
    displayName: (state) => state.name || '当前用户',
  },

  actions: {
    updateProfile(data: {
      name?: string
      studentId?: string
      college?: string
      major?: string
      grade?: string
      description?: string
    }) {
      if (data.name !== undefined) this.name = data.name
      if (data.studentId !== undefined) this.studentId = data.studentId
      if (data.college !== undefined) this.college = data.college
      if (data.major !== undefined) this.major = data.major
      if (data.grade !== undefined) this.grade = data.grade
      if (data.description !== undefined) this.description = data.description
    },
  },
})
