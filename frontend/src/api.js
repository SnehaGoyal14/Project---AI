import axios from 'axios'

const api = axios.create({
  baseURL: 'https://project-ai-production-a429.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' }
})

export default api
