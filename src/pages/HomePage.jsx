// src/pages/HomePage.jsx
import { useEffect, useState } from 'react'
import axios from '../api/axios'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../store/authSlice'

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.auth)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts')
        setPosts(res.data)
      } catch (err) {
        console.error('글 목록 불러오기 실패', err)
      }
    }

    fetchPosts()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true })
      dispatch(clearUser())
      alert('로그아웃 되었습니다.')
    } catch (err) {
      alert('로그아웃 실패: ' + err.response?.data?.message)
    }
  }

  return (
    <div>
      <h2>🏠 홈 페이지</h2>

      {/* ✅ 로그인 여부에 따라 인사 및 로그아웃 */}
      {isAuthenticated ? (
        <div>
          <p>👋 {user.username}님 환영합니다!</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <div>
          <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
        </div>
      )}

      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <Link to={`/posts/${post._id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>작성자: {post.author.username}</p>
            <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
