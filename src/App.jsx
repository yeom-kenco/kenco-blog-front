import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser, clearUser } from './store/authSlice'
import axios from './api/axios'
import HomePage from './pages/HomePage'
import WritePage from './pages/WritePage'
import PostDetailPage from './pages/PostDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import PrivateRoute from './routes/PrivateRoute'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/check', { withCredentials: true })
        dispatch(setUser(res.data.user)) // ✅ 토큰 유효 → 로그인 유지
      } catch (err) {
        console.log(err)
        dispatch(clearUser()) // ❌ 토큰 만료 → 강제 로그아웃
      }
    }
    checkAuth()
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* ✅ 마이페이지 보호 라우팅 */}
        <Route
          path="/mypage"
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
