import { useState } from 'react'
import axios from '../api/axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/login', form, { withCredentials: true })
      dispatch(setUser(res.data.user)) // ✅ 전체 유저 정보 저장
      alert(res.data.message)
      navigate('/')
    } catch (err) {
      alert('로그인 실패: ' + err.response?.data?.message)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>로그인</h2>
      <input name="email" placeholder="이메일" onChange={handleChange} />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} />
      <button type="submit">로그인</button>
    </form>
  )
}
