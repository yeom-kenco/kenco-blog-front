import axios from 'axios'

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // ✅ 환경변수 사용
  withCredentials: true,
})

export default instance
