// Header.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../../store/authSlice'
import axios from '../../api/axios'
import 'bootstrap-icons/font/bootstrap-icons.css'
import watermelonIcon from '../../assets/watermelon-icon-1.png'

import './Header.css'

export default function Header() {
  const { isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true })
      dispatch(clearUser())
      navigate('/')
    } catch (err) {
      console.log(err)
      alert('로그아웃 실패')
    }
  }

  return (
    <header className="header">
      <div className="header-main">
        <p className="header-subtitle">기록과 성장이 담긴 공간</p>
        <h1 className="logo" onClick={() => navigate('/')}>
          Kenco Blog
          <img src={watermelonIcon} alt="수박" />
        </h1>
      </div>

      <div className="header-actions">
        {isAuthenticated ? (
          <>
            <i onClick={() => navigate('/mypage')} className="bi bi-person-fill"></i>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button>로그인</button>
            </Link>
            <Link to="/signup">
              <button>회원가입</button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
