import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from '../api/axios'
import CommentItem from '../components/CommentItem'

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState('')

  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()

  // 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`/posts/${id}`)
      setPost(res.data)
    }
    fetchPost()
  }, [id])

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/comments/${id}`)
      setComments(res.data)
    }
    fetchComments()
  }, [id])

  // 댓글 작성
  const handleAddComment = async () => {
    if (!commentInput.trim()) return
    try {
      const res = await axios.post(
        '/comments',
        { content: commentInput, postId: id },
        { withCredentials: true }
      )

      // ✅ 여기서 author 정보 수동으로 덧붙이기
      const newComment = {
        ...res.data.comment,
        author: {
          _id: user._id,
          username: user.username,
        },
      }

      setComments(prev => [newComment, ...prev])
      setCommentInput('')
    } catch (err) {
      alert('댓글 작성 실패: ' + err.response?.data?.message)
    }
  }

  const handleDeleteComment = id => {
    setComments(prev => prev.filter(c => c._id !== id))
  }

  const handleUpdateComment = (id, newContent) => {
    setComments(prev => prev.map(c => (c._id === id ? { ...c, content: newContent } : c)))
  }

  const isAuthor = user && String(user._id) === String(post?.author?._id)

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

  if (!post) return <p>로딩 중...</p>

  return (
    <div>
      <h2>{post.title}</h2>
      <p>작성자: {post.author.username}</p>
      <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {isAuthor && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleEdit}>✏️ 수정</button>
          <button onClick={handleDelete}>🗑️ 삭제</button>
        </div>
      )}

      <hr />
      <h3>댓글</h3>

      {user ? (
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows={3}
            style={{ width: '100%', resize: 'none' }}
          />
          <button onClick={handleAddComment}>댓글 작성</button>
        </div>
      ) : (
        <p>댓글을 작성하려면 로그인하세요.</p>
      )}

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <p>아직 댓글이 없습니다.</p>
      ) : (
        comments.map(c => (
          <CommentItem
            key={c._id}
            comment={c}
            onDelete={handleDeleteComment}
            onUpdate={handleUpdateComment}
          />
        ))
      )}
    </div>
  )
}
