import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth)
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('로그인 후 이용해주세요.')
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
