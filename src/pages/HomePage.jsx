// src/pages/HomePage.jsx
import { useEffect, useState } from 'react'
import axios from '../api/axios'
import { Link } from 'react-router-dom'
import PostCard from '../components/post/PostCard'
import './HomePage.css'

export default function HomePage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts')
        setPosts(res.data) // 실제 게시글
      } catch (err) {
        console.error('글 목록 불러오기 실패', err)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="homepage-container">
      <section className="post-list">
        {posts.length === 0 ? (
          <p>아직 게시글이 없습니다.</p>
        ) : (
          posts.map(post => <PostCard key={post._id} post={post} />)
        )}
      </section>
    </div>
  )
}
