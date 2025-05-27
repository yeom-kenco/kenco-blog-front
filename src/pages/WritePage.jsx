import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function WritePage() {
  const navigate = useNavigate()

  const location = useLocation()
  const editingPost = location.state?.post

  const [title, setTitle] = useState(editingPost?.title || '')
  const [content, setContent] = useState(editingPost?.content || '')

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (editingPost) {
        // 수정
        await axios.put(`/posts/${editingPost._id}`, { title, content })
        alert('수정 완료!')
        navigate(`/posts/${editingPost._id}`)
      } else {
        // 새 글
        await axios.post('/posts', { title, content })
        alert('게시글 작성 완료!')
        navigate('/')
      }
    } catch (err) {
      alert('작성 실패: ' + err.response?.data?.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>글쓰기</h2>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목"
        style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
      />
      <ReactQuill value={content} onChange={setContent} />
      <button type="submit" style={{ marginTop: '20px' }}>
        작성 완료
      </button>
    </form>
  )
}
