import { useState } from 'react'
import axios from '../api/axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/authSlice'

export default function LoginPage() {
  const dispatch = useDispatch()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/login', form)
      dispatch(setUser({ email: form.email }))
      alert(res.data.message)
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
