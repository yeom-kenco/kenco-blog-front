// components/post/PostList.jsx
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from '../../api/axios'
import PostCard from './PostCard'
import Pagination from './Pagination'

export default function PostList() {
  const [posts, setPosts] = useState([])
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
      }
    }

    fetchPosts()
  }, [page])

  return (
    <section>
      {posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
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
      )}
    </section>
  )
}
