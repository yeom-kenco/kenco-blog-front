import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from '../api/axios'

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const { user } = useSelector(state => state.auth)
  console.log('로그인된 유저 정보:', user)
  console.log('게시글 정보:', post)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`/posts/${id}`)
      setPost(res.data)
    }
    fetchPost()
  }, [id])

  if (!post) return <p>로딩 중...</p>

  const isAuthor = user && user._id === post.author._id

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제할까요?')) return
    try {
      await axios.delete(`/posts/${id}`)
      alert('삭제되었습니다')
      navigate('/')
    } catch (err) {
      alert('삭제 실패: ' + err.response?.data?.message)
    }
  }

  const handleEdit = () => {
    navigate(`/write?id=${post._id}`, { state: { post } })
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>작성자: {post.author.username}</p>
      <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* ✅ 본인 글일 때만 노출 */}
      {isAuthor && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleEdit}>✏️ 수정</button>
          <button onClick={handleDelete}>🗑️ 삭제</button>
        </div>
      )}
    </div>
  )
}
