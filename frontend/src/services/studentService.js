import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const studentService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (student) => api.post('/students', student),
  update: (id, student) => api.put(`/students/${id}`, student),
  remove: (id) => api.delete(`/students/${id}`),
  searchByName: (query) => api.get('/students/search/name', { params: { query } }),
  searchByCourse: (query) => api.get('/students/search/course', { params: { query } })
}

export default studentService
