import PostCard from './PostCard'

const samplePosts = [
  {
    id: 1,
    title: 'React로 블로그 만들기',
    snippet: 'React와 Express를 이용해 블로그를 만들면서 배운 점들...',
    author: 'ken',
    date: '2025.05.27',
    thumbnail: 'https://source.unsplash.com/random/300x200?blog',
  },
  {
    id: 2,
    title: '개발자 포트폴리오 작성 팁',
    snippet: '채용자 입장에서 보는 포트폴리오, 이렇게 구성하세요!',
    author: 'ken',
    date: '2025.05.26',
    thumbnail: 'https://source.unsplash.com/random/300x200?code',
  },
]

export default function PostList() {
  return (
    <div className="post-list">
      {samplePosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
