// PostDetailPage.jsx
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from '../api/axios'
import CommentItem from '../components/comment/CommentItem'
import { toast } from 'react-toastify'
import watermelon from '../assets/watermelon-icon-3.png'
import './PostDetailPage.css'

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`/posts/${id}`)
      setPost(res.data)
      setLikeCount(res.data.likes.length)
      setLiked(user && res.data.likes.includes(user._id))
    }
    fetchPost()
  }, [id, user])

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/comments/${id}`)
      setComments(res.data)
    }
    fetchComments()
  }, [id])

  const handleToggleLike = async () => {
    try {
      const res = await axios.post(`/posts/${id}/like`, null, { withCredentials: true })
      setLiked(res.data.liked)
      setLikeCount(prev => (res.data.liked ? prev + 1 : prev - 1))
    } catch (err) {
      toast.error('좋아요 실패: ' + err.response?.data?.message)
    }
  }

  const handleAddComment = async () => {
    if (!commentInput.trim()) return
    try {
      const res = await axios.post(
        '/comments',
        { content: commentInput, postId: id },
        { withCredentials: true }
      )
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
      toast.error('댓글 작성 실패: ' + err.response?.data?.message)
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
      toast.success('삭제되었습니다')
      navigate('/')
    } catch (err) {
      toast.error('삭제 실패: ' + err.response?.data?.message)
    }
  }

  const handleEdit = () => {
    navigate(`/write?id=${post._id}`, { state: { post } })
  }

  if (!post)
    return (
      <div className="loading-wrapper">
        <img src={watermelon} alt="수박 로딩" className="loading-watermelon" />
        <p className="loading-text">열심히 수박 따는 중</p>
      </div>
    )

  return (
    <div className="post-detail-wrapper">
      <div className="post-detail-card">
        <div className="post-detail-header">
          <h2 className="post-detail-title">{post.title}</h2>
          {isAuthor && (
            <div className="post-detail-actions">
              <button onClick={handleEdit}>✏️수정</button>
              <button onClick={handleDelete}>🗑️삭제</button>
            </div>
          )}
        </div>

        <div className="post-detail-meta">
          <span>{post.author.username}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <div
          className="post-detail-content ql-editor"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="post-detail-footer">
          <button onClick={handleToggleLike}>{liked ? '🤍' : '❤️'}</button>
          <span>{likeCount}</span>
        </div>

        <div className="post-detail-comments">
          <h3>댓글</h3>
          {user ? (
            <div className="comment-input">
              <textarea
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="댓글을 입력하세요."
                rows={3}
              />
              <button onClick={handleAddComment}>댓글 작성</button>
            </div>
          ) : (
            <p>댓글을 작성하려면 로그인하세요.</p>
          )}

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
      </div>
    </div>
  )
}
