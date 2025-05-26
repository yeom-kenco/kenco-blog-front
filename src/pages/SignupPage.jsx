import { useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'

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
      alert('회원가입 성공!')
      navigate('/login')
    } catch (err) {
      alert('회원가입 실패: ' + err.response?.data?.message)
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <h2>회원가입</h2>
      <input name="username" placeholder="사용자 이름" onChange={handleChange} />
      <input name="email" placeholder="이메일" onChange={handleChange} />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} />
      <button type="submit">회원가입</button>
    </form>
  )
}
