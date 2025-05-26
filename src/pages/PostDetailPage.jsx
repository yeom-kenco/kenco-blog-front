import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from '../api/axios'

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${id}`)
        setPost(res.data)
      } catch (err) {
        console.error('게시글 조회 실패', err)
      }
    }

    fetchPost()
  }, [id])

  if (!post) return <p>로딩 중...</p>

  return (
    <div>
      <h2>{post.title}</h2>
      <p>작성자: {post.author.username}</p>
      <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}
