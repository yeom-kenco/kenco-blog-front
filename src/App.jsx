import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from './store/authSlice'
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

function AppContent() {
  const dispatch = useDispatch()
  const location = useLocation() // ✅ 수정된 부분

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/check', { withCredentials: true })
        dispatch(setUser(res.data.user))
      } catch (err) {
        // 로그인 안 된 상태는 정상 → user 없음으로 간주
        console.log('🔒 로그인 안 되어 있음. 무시:', err.response?.status)
        // ❌ dispatch(clearUser()) 제거!
      }
    }

    checkAuth()
  }, [dispatch])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
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

      {/* ✅ React Router의 location 사용 */}
      {!location.pathname.startsWith('/write') && <FloatingWriteButton />}
    </>
  )
}

// 🔁 App에 BrowserRouter 래핑
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
