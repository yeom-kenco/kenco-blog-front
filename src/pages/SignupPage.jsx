import { useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
import watermelonIcon from '../assets/watermelon-icon-2.png'
import './SignupPage.css'
import { toast } from 'react-toastify'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async e => {
    e.preventDefault()
    try {
      await axios.post('/auth/register', form)
      toast.success('회원가입 성공!')
      navigate('/login')
    } catch (err) {
      toast.error('회원가입 실패: ' + err.response?.data?.message)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <form onSubmit={handleSignup} className="signup-form">
          <div className="signup-title">
            <img src={watermelonIcon} alt="수박" />
          </div>
          <input name="username" placeholder="이름 (닉네임)" onChange={handleChange} required />
          <input name="email" placeholder="이메일" onChange={handleChange} required />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            required
          />
          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>
  )
}
