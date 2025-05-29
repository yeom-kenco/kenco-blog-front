import { Link } from 'react-router-dom'
import './PostCard.css'
import defaultThumbnail from '../../assets/default-thumbnail.jpeg' // 기본 이미지 경로

export default function PostCard({ post }) {
  const thumbnail = extractThumbnail(post.content) || defaultThumbnail

  return (
    <Link to={`/posts/${post._id}`} className="post-card">
      {thumbnail && <img src={thumbnail} alt="썸네일" className="post-thumbnail" />}
      {!thumbnail && <div className="thumbnail-placeholder">No Image</div>}
      <div className="post-content">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-meta">
          작성자: {post.author.username} · {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}

// content에서 첫 번째 <img> 태그의 src 추출
function extractThumbnail(content) {
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/)
  return match ? match[1] : null
}
