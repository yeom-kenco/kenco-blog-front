import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // JWT 쿠키 자동 포함
})

export default instance
