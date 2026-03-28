import { useTopics } from '@/hooks/useTopicData'
import { Link } from 'react-router-dom'
import type { Topic } from '@/lib/types'

const gradients = [
  'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
  'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
  'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
  'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
]

function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const totalCards = topic.content.flashcards?.count ?? 0
  const totalQs = topic.content.quiz?.count ?? 0
  const gradient = gradients[index % gradients.length]

  return (
    <Link
      to={`/topic/${topic.slug}`}
      className="card-enter topic-card"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient header */}
      <div style={{
        background: gradient,
        padding: '28px 24px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-24px', right: '-24px',
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-16px', left: '25%',
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '20%',
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />

        <span className="topic-card-chapter">
          {topic.chapter}
        </span>
        <h3 className="topic-card-title">
          {topic.title}
        </h3>
        <p className="topic-card-desc">
          {topic.description}
        </p>
      </div>

      {/* Content badges */}
      <div className="topic-card-badges">
        {topic.content.flashcards && (
          <div className="topic-badge topic-badge-flashcards">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 4v16" /></svg>
            {totalCards} cards
          </div>
        )}
        {topic.content.quiz && (
          <div className="topic-badge topic-badge-quiz">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            {totalQs} quiz
          </div>
        )}
        {topic.content.mindmap && (
          <div className="topic-badge topic-badge-mindmap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /></svg>
            mind map
          </div>
        )}
      </div>

      {/* Study now CTA */}
      <div style={{ padding: '0 24px 20px' }}>
        <div className="topic-card-cta">
          Study Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  )
}

export function Home() {
  const { topics, loading } = useTopics()

  return (
    <div className="page-wrapper" style={{ maxWidth: '680px' }}>
      {/* Welcome header */}
      <div style={{ marginBottom: '36px' }}>
        <div className="home-physiology-badge">
          <div className="home-pulse-dot" />
          <span className="home-badge-text">
            Physiology
          </span>
        </div>

        <h1 className="page-title" style={{ fontSize: 'clamp(30px, 7vw, 44px)' }}>
          Ready to study? <span style={{ display: 'inline-block', verticalAlign: 'middle' }}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></span>
        </h1>
        <p className="home-subtitle">
          Tap a topic below to start with flashcards, quizzes, or mind maps.
        </p>
      </div>

      {/* Topics */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse" style={{
              height: '240px', borderRadius: '20px',
            }} />
          ))}
        </div>
      ) : topics ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {topics.topics.map((topic, i) => (
            <TopicCard key={topic.slug} topic={topic} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state-container">
          <div className="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 15s1.5-2 4-2 4 2 4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg></div>
          <p className="empty-state-text">
            Failed to load topics. Please try again later.
          </p>
        </div>
      )}
    </div>
  )
}
