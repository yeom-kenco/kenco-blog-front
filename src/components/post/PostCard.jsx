import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import watermelonLoading from '../../assets/watermelon-icon-3.png'
import defaultThumbnail from '../../assets/default-thumbnail.jpeg'
import './PostCard.css'

// 썸네일 추출 유틸
function extractThumbnail(content) {
  const match = content?.match(/<img[^>]+src="([^">]+)"/)
  return match ? match[1] : null
}

export default function PostCard({ post }) {
  const navigate = useNavigate()
  const [imgLoaded, setImgLoaded] = useState(false)

  const thumbnail = extractThumbnail(post.content) || defaultThumbnail

  return (
    <div className="post-card" onClick={() => navigate(`/posts/${post._id}`)}>
      <div className="post-thumbnail-wrapper">
        {!imgLoaded && (
          <div className="image-skeleton">
            <img src={watermelonLoading} alt="로딩 중" className="skeleton-watermelon" />
          </div>
        )}
        <img
          src={thumbnail}
          alt={post.title}
          className={`post-thumbnail ${imgLoaded ? 'fade-in' : 'hidden'}`}
          onLoad={() => setImgLoaded(true)}
        />
      </div>

      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-meta">
          <span>{post.author?.username}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="post-stats">
          ❤️ {post.likes?.length || 0} 💬 {post.commentCount || 0}
        </div>
      </div>
    </div>
  )
}
