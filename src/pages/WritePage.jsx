// src/pages/WritePage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
//import { useSelector } from 'react-redux'

export default function WritePage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post('/posts', { title, content })
      alert('게시글 작성 완료!')
      navigate('/')
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
