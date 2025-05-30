import { useState } from 'react'
import axios from '../../api/axios'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function CommentItem({ comment, onDelete, onUpdate }) {
  const { user } = useSelector(state => state.auth)
  const isMyComment = user && String(user._id) === String(comment.author._id)

  const [editMode, setEditMode] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  const handleDelete = async () => {
    if (!window.confirm('댓글을 삭제할까요?')) return
    try {
      await axios.delete(`/comments/${comment._id}`, { withCredentials: true })
      onDelete(comment._id)
      toast.success('댓글을 삭제했습니다.')
    } catch (err) {
      toast.error('삭제 실패: ' + err.response?.data?.message)
    }
  }

  const handleUpdate = async () => {
    try {
      await axios.put(
        `/comments/${comment._id}`,
        { content: editContent },
        { withCredentials: true }
      )
      onUpdate(comment._id, editContent)
      setEditMode(false)
      toast.success('댓글을 수정했습니다.')
    } catch (err) {
      toast.error('수정 실패: ' + err.response?.data?.message)
    }
  }

  return (
    <div className="comment-item">
      <div className="comment-item-header">
        <span className="comment-author">🍉 {comment.author.username}</span>
        <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>

      {editMode ? (
        <>
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            rows={2}
            style={{ width: '100%', resize: 'none' }}
          />
          <div className="comment-actions">
            <button onClick={handleUpdate}>💾</button>
            <button onClick={() => setEditMode(false)}>❌</button>
          </div>
        </>
      ) : (
        <>
          <p className="comment-content">{comment.content}</p>
          {isMyComment && (
            <div className="comment-actions">
              <button onClick={() => setEditMode(true)}>✏️</button>
              <button onClick={handleDelete}>🗑️</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
