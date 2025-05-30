import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from '../api/axios'
import CommentItem from '../components/comment/CommentItem'
import { toast } from 'react-toastify'
import watermelon from '../assets/watermelon-icon-3.png'

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()

  // 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`/posts/${id}`)
      setPost(res.data)
      setLikeCount(res.data.likes.length)
      setLiked(user && res.data.likes.includes(user._id))
    }
    fetchPost()
  }, [id, user])

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/comments/${id}`)
      setComments(res.data)
    }
    fetchComments()
  }, [id])

  // 좋아요 토글 핸들러
  const handleToggleLike = async () => {
    try {
      const res = await axios.post(`/posts/${id}/like`, null, { withCredentials: true })
      setLiked(res.data.liked)
      setLikeCount(prev => (res.data.liked ? prev + 1 : prev - 1))
    } catch (err) {
      toast.error('좋아요 실패: ' + err.response?.data?.message)
    }
  }

  // 댓글 작성
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
    <div>
      <h2>{post.title}</h2>
      <p>작성자: {post.author.username}</p>
      <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>

      {/* 이미지 깨짐 방지 스타일 */}
      <style>
        {`
          .ql-editor img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1rem 0;
          }
        `}
      </style>

      {/* 글 본문 렌더링 */}
      <div className="ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} />

      {isAuthor && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleEdit}>✏️ 수정</button>
          <button onClick={handleDelete}>🗑️ 삭제</button>
        </div>
      )}

      <button onClick={handleToggleLike}>{liked ? '💔 좋아요 취소' : '❤️ 좋아요'}</button>
      <p>좋아요 수: {likeCount}</p>

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
