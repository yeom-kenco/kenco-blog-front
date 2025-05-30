// components/post/PostList.jsx
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from '../../api/axios'
import PostCard from './PostCard'
import Pagination from './Pagination'
import watermelon from '../../assets/watermelon-icon-3.png'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page')) || 1

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/posts?page=${page}&limit=6`)
        setPosts(res.data.posts)
        setTotalPages(res.data.totalPages)
      } catch (err) {
        console.error('글 목록 불러오기 실패:', err)
      } finally {
        setLoading(false) // ✅ 무조건 로딩 종료
      }
    }

    fetchPosts()
  }, [page])

  if (loading) {
    return (
      <div className="loading-wrapper">
        <img src={watermelon} alt="수박 로딩" className="loading-watermelon" />
        <p className="loading-text">열심히 수박 따는 중</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return <p className="no-posts">게시글이 없습니다.</p>
  }

  return (
    <section>
      <>
        <div className="post-list">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={newPage => setSearchParams({ page: newPage })}
        />
      </>
    </section>
  )
}
