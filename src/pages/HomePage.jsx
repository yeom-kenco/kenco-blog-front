// src/pages/HomePage.jsx
import { useEffect, useState } from 'react'
import axios from '../api/axios'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts')
        setPosts(res.data)
      } catch (err) {
        console.error('글 목록 불러오기 실패', err)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div>
      <h2>게시글 목록</h2>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <Link to={`/posts/${post._id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>작성자: {post.author.username}</p>
            <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
