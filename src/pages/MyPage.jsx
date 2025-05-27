import { useEffect, useState } from 'react'
import axios from '../api/axios'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../store/authSlice'

export default function MyPage() {
  const [myPosts, setMyPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [myComments, setMyComments] = useState([])
  const { user } = useSelector(state => state.auth)
  const [username, setUsername] = useState(user?.username || '')
  const dispatch = useDispatch()

  const handleUpdate = async () => {
    try {
      const res = await axios.patch('/users/me', { username }, { withCredentials: true })
      dispatch(setUser(res.data.user))
      alert('이름 수정 완료!')
    } catch (err) {
      alert('수정 실패: ' + err.response?.data?.message)
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      const res1 = await axios.get('/users/me/posts', { withCredentials: true })
      const res2 = await axios.get('/users/me/liked', { withCredentials: true })
      const res3 = await axios.get('/users/me/comments', { withCredentials: true })

      setMyPosts(res1.data)
      setLikedPosts(res2.data)
      setMyComments(res3.data)
    }
    fetchAll()
  }, [])

  return (
    <div>
      <h2>마이페이지</h2>

      <h3>📌 내가 쓴 글</h3>
      {myPosts.map(p => (
        <p key={p._id}>📝 {p.title}</p>
      ))}

      <h3>❤️ 좋아요한 글</h3>
      {likedPosts.map(p => (
        <p key={p._id}>💖 {p.title}</p>
      ))}

      <h3>💬 내가 단 댓글</h3>
      {myComments.map(c => (
        <p key={c._id}>
          🔹 [{c.post.title}] {c.content}
        </p>
      ))}

      <h3>⚙️ 내 정보 수정</h3>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="새 사용자 이름"
      />
      <button onClick={handleUpdate}>수정 완료</button>
    </div>
  )
}
