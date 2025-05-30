import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { toast } from 'react-toastify'

export default function WritePage() {
  const navigate = useNavigate()
  const quillRef = useRef()
  const location = useLocation()
  const editingPost = location.state?.post

  const [title, setTitle] = useState(editingPost?.title || '')
  const [content, setContent] = useState(editingPost?.content || '')

  const imageHandler = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files[0]
      const formData = new FormData()
      formData.append('image', file)

      try {
        const res = await axios.post('/uploads/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        })

        const range = quillRef.current.getEditor().getSelection()
        const imageUrl = `http://localhost:5000${res.data.url}`
        quillRef.current.getEditor().insertEmbed(range.index, 'image', imageUrl)

        // 이미지 삽입 후 수동으로 content 업데이트
        setContent(quillRef.current.getEditor().root.innerHTML)
      } catch (err) {
        alert('이미지 업로드 실패: ' + err.response?.data?.message)
      }
    }
  }

  const modules = {
    toolbar: {
      container: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline'], ['image']],
      handlers: {
        image: imageHandler,
      },
    },
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // 에디터에서 최종 HTML 수동 추출
    const finalContent = quillRef.current.getEditor().root.innerHTML
    setContent(finalContent)

    try {
      if (editingPost) {
        await axios.put(`/posts/${editingPost._id}`, { title, content: finalContent })
        toast.success('수정 완료!')
        navigate(`/posts/${editingPost._id}`)
      } else {
        await axios.post('/posts', { title, content: finalContent })
        toast.success('게시글 작성 완료!')
        navigate('/')
      }
    } catch (err) {
      toast.error('작성 실패: ' + err.response?.data?.message)
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
      <ReactQuill
        ref={quillRef}
        defaultValue={content}
        modules={modules}
        onBlur={() => {
          setContent(quillRef.current.getEditor().root.innerHTML)
        }}
      />
      <button type="submit" style={{ marginTop: '20px' }}>
        작성 완료
      </button>
    </form>
  )
}
