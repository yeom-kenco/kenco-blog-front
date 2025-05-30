import { useState } from 'react'
import axios from '../api/axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

import watermelonIcon from '../assets/watermelon-icon-2.png' // ✅ 이미지 import

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
      dispatch(setUser(res.data.user))
      alert(res.data.message)
      navigate('/')
    } catch (err) {
      alert('로그인 실패: ' + err.response?.data?.message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-title">
            <img src={watermelonIcon} alt="수박" />
          </div>
          <input name="email" placeholder="이메일" onChange={handleChange} required />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            required
          />
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  )
}
