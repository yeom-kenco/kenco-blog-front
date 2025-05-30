import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { toast } from 'react-toastify'
import './WritePage.css'

export default function WritePage() {
  const navigate = useNavigate()
  const quillRef = useRef()
  const location = useLocation()
  const editingPost = location.state?.post

  const [title, setTitle] = useState(editingPost?.title || '')
  const [content, setContent] = useState(editingPost?.content || '')

  // 이미지 업로드 핸들러
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
        const imageUrl = res.data.url // ✅ 서버가 보내준 절대경로를 그대로 사용
        quillRef.current.getEditor().insertEmbed(range.index, 'image', imageUrl)
        setContent(quillRef.current.getEditor().root.innerHTML)
      } catch (err) {
        toast.error('이미지 업로드 실패: ' + err.response?.data?.message)
      }
    }
  }

  const modules = {
    toolbar: {
      container: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline'], ['image']],
      handlers: { image: imageHandler },
    },
  }

  const handleSubmit = async e => {
    e.preventDefault()
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
    <div className="write-wrapper">
      <div className="write-card">
        <h2>{editingPost ? '게시글 수정' : '글쓰기'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="write-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
          <ReactQuill
            ref={quillRef}
            defaultValue={content}
            modules={modules}
            className="quill-editor"
            onBlur={() => {
              setContent(quillRef.current.getEditor().root.innerHTML)
            }}
          />
          <div className="write-submit-wrapper">
            <button type="submit" className="write-submit-btn">
              {editingPost ? '수정 완료' : '작성 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
