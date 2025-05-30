// components/post/Pagination.jsx
import './Pagination.css'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={page === i + 1 ? 'active' : ''}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}
