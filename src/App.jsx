import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser, clearUser } from './store/authSlice'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import axios from './api/axios'
import HomePage from './pages/HomePage'
import WritePage from './pages/WritePage'
import PostDetailPage from './pages/PostDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import PrivateRoute from './routes/PrivateRoute'
import Layout from './components/layout/Layout'
import FloatingWriteButton from './components/FloatingWriteButton'
import './styles/reset.css'
import './styles/variables.css'
import './styles/global.css'
import './styles/media.css'

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route
            path="/write"
            element={
              <PrivateRoute>
                <WritePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
      {/* ✅ write 페이지가 아닐 때만 FloatingWriteButton 노출 */}
      {!location.pathname.startsWith('/write') && <FloatingWriteButton />}
    </BrowserRouter>
  )
}

export default App
