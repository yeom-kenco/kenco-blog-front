import { useEffect, useState } from 'react'
import axios from '../api/axios'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, clearUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import PostCard from '../components/post/PostCard'
import './MyPage.css'

export default function MyPage() {
  const [myPosts, setMyPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [myComments, setMyComments] = useState([])
  const { user } = useSelector(state => state.auth)
  const [username, setUsername] = useState(user?.username || '')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [activeTab, setActiveTab] = useState('posts') // posts | comments | likes | settings
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAll = async () => {
      const res1 = await axios.get(`/posts?author=${user._id}`)
      const res2 = await axios.get('/users/me/liked', { withCredentials: true })
      const res3 = await axios.get('/users/me/comments', { withCredentials: true })

      setMyPosts(res1.data.posts)
      setLikedPosts(res2.data)
      setMyComments(res3.data)
    }
    fetchAll()
  }, [user._id])

  const handleUpdate = async () => {
    try {
      const res = await axios.patch('/users/me', { username }, { withCredentials: true })
      dispatch(setUser(res.data.user))
      toast.success('이름 수정 완료!')
    } catch (err) {
      toast.error('수정 실패: ' + err.response?.data?.message)
    }
  }

  const handleChangePassword = async () => {
    try {
      await axios.patch('/users/me/password', { currentPw, newPw }, { withCredentials: true })
      toast.success('비밀번호가 성공적으로 변경되었습니다.')
      setCurrentPw('')
      setNewPw('')
    } catch (err) {
      toast.error('변경 실패: ' + err.response?.data?.message)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까?')) return
    try {
      await axios.delete('/users/me', { withCredentials: true })
      dispatch(clearUser())
      toast.success('회원 탈퇴 완료')
      navigate('/')
    } catch (err) {
      toast.error('회원 탈퇴 실패: ' + err.response?.data?.message)
    }
  }

  const groupByPost = comments => {
    const grouped = {}
    comments.forEach(c => {
      const postId = c.post?._id
      if (!postId) return
      if (!grouped[postId]) grouped[postId] = { post: c.post, comments: [] }
      grouped[postId].comments.push(c.content)
    })
    return Object.values(grouped)
  }

  return (
    <div className="mypage-wrapper">
      <div className="mypage-card">
        <h1>
          <i className="bi bi-person-fill"></i> 마이페이지
        </h1>

        {/* 탭 메뉴 */}
        <div className="mypage-tabs">
          <button
            className={activeTab === 'posts' ? 'active' : ''}
            onClick={() => setActiveTab('posts')}
          >
            <span className="desktop">📝 내가 쓴 글</span>
            <span className="mobile">글</span>
          </button>
          <button
            className={activeTab === 'comments' ? 'active' : ''}
            onClick={() => setActiveTab('comments')}
          >
            <span className="desktop">💬 댓글 단 글</span>
            <span className="mobile">댓글</span>
          </button>
          <button
            className={activeTab === 'likes' ? 'active' : ''}
            onClick={() => setActiveTab('likes')}
          >
            <span className="desktop">❤️ 좋아요</span>
            <span className="mobile">좋아요</span>
          </button>
          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            <span className="desktop">⚙️ 설정</span>
            <span className="mobile">설정</span>
          </button>
        </div>

        {/* 탭 내용 */}
        <div className="mypage-tab-content">
          {activeTab === 'posts' && (
            <div className="post-list">
              {myPosts.length === 0 ? (
                <p>작성한 글이 없습니다.</p>
              ) : (
                myPosts.map(p => <PostCard key={p._id} post={p} />)
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="post-list">
              {myComments.length === 0 ? (
                <p>댓글 단 글이 없습니다.</p>
              ) : (
                groupByPost(myComments).map(({ post, comments }) => (
                  <div key={post._id} className="comment-post-card">
                    <PostCard post={post} />
                    <div className="comment-preview-group">
                      {comments.map((text, i) => (
                        <p key={i} className="comment-preview">
                          💬 {text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="post-list">
              {likedPosts.length === 0 ? (
                <p>좋아요한 글이 없습니다.</p>
              ) : (
                likedPosts.map(p => <PostCard key={p._id} post={p} />)
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="mypage-settings">
              <div className="mypage-profile">
                <div className="name-edit-row">
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="사용자 이름"
                  />
                  <button onClick={handleUpdate} className="mypage-btn">
                    이름 변경
                  </button>
                </div>
              </div>

              <h3>비밀번호 변경</h3>
              <div className="password-change">
                <input
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                />
                <button onClick={handleChangePassword} className="mypage-btn">
                  변경하기
                </button>
              </div>

              <div className="mypage-footer">
                <button className="mypage-danger" onClick={handleDeleteAccount}>
                  회원 탈퇴
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
