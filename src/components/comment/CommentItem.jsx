import { useState } from 'react'
import axios from '../../api/axios'
import { useSelector } from 'react-redux'

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
    } catch (err) {
      alert('삭제 실패: ' + err.response?.data?.message)
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
    } catch (err) {
      alert('수정 실패: ' + err.response?.data?.message)
    }
  }

  return (
    <div style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
      <strong>{comment.author.username}</strong>
      {editMode ? (
        <>
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            rows={2}
            style={{ width: '100%', resize: 'none' }}
          />
          <button onClick={handleUpdate}>💾 저장</button>
          <button onClick={() => setEditMode(false)}>❌ 취소</button>
        </>
      ) : (
        <p>{comment.content}</p>
      )}

      {isMyComment && !editMode && (
        <div>
          <button onClick={() => setEditMode(true)}>✏️ 수정</button>
          <button onClick={handleDelete}>🗑️ 삭제</button>
        </div>
      )}
    </div>
  )
}
