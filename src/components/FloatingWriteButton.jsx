import { useNavigate } from 'react-router-dom'
import './FloatingWriteButton.css'

export default function FloatingWriteButton() {
  const navigate = useNavigate()

  return (
    <button className="floating-write-btn" onClick={() => navigate('/write')}>
      ✍️<div>글쓰기</div>
    </button>
  )
}
