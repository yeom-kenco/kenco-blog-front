import { Link } from 'react-router-dom'
import './PostCard.css'
import defaultThumbnail from '../../assets/default-thumbnail.jpeg'

export default function PostCard({ post }) {
  const thumbnail = extractThumbnail(post.content) || defaultThumbnail
  const likeCount = post.likes?.length || 0
  const commentCount = post.commentCount || 0

  return (
    <Link to={`/posts/${post._id}`} className="post-card">
      {thumbnail && <img src={thumbnail} alt="썸네일" className="post-thumbnail" />}
      {!thumbnail && <div className="thumbnail-placeholder">No Image</div>}
      <div className="post-content">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-meta">
          <div>
            작성자: {post.author.username} · {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="post-stats">
            🩷 {likeCount} 💬 {commentCount}
          </div>
        </div>
      </div>
    </Link>
  )
}

function extractThumbnail(content) {
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/)
  return match ? match[1] : null
}
