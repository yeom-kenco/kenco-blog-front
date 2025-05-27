import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const { isAuthenticated, authChecked } = useSelector(state => state.auth)

  if (!authChecked) {
    // 아직 인증 확인 안 끝났으면 아무것도 안 보여줌
    return <p>⏳ 인증 확인 중...</p>
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}
