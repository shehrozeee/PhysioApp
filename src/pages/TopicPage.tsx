import { useParams, Link } from 'react-router-dom'
import { useTopics } from '@/hooks/useTopicData'

export function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const { topics, loading } = useTopics()

  if (loading) {
    return (
      <div className="page-wrapper" style={{ maxWidth: '680px' }}>
        <div className="animate-pulse" style={{ height: '24px', width: '120px', borderRadius: '8px', marginBottom: '16px' }} />
        <div className="animate-pulse" style={{ height: '40px', width: '280px', borderRadius: '12px', marginBottom: '12px' }} />
        <div className="animate-pulse" style={{ height: '20px', width: '100%', maxWidth: '400px', borderRadius: '8px', marginBottom: '40px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse" style={{ height: '88px', borderRadius: '16px' }} />
          ))}
        </div>
      </div>
    )
  }

  const topic = topics?.topics.find(t => t.slug === slug)
  if (!topic) {
    return (
      <div className="page-wrapper" style={{ maxWidth: '680px', paddingTop: '80px', textAlign: 'center' }}>
        <div className="empty-state-icon"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></div>
        <h2 className="page-title" style={{ marginBottom: '8px' }}>
          Topic not found
        </h2>
        <p className="empty-state-text" style={{ marginBottom: '24px' }}>
          This topic doesn't exist or hasn't been added yet.
        </p>
        <Link to="/" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to topics
        </Link>
      </div>
    )
  }

  const contentTypes = [
    {
      key: 'flashcards' as const,
      label: 'Flashcards',
      available: !!topic.content.flashcards,
      subtitle: topic.content.flashcards ? `${topic.content.flashcards.count} cards` : '',
      description: 'Study with interactive flip cards',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M12 4v16" />
        </svg>
      ),
      gradientBg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      className: 'topic-content-link-flashcards',
    },
    {
      key: 'quiz' as const,
      label: 'Quiz',
      available: !!topic.content.quiz,
      subtitle: topic.content.quiz ? `${topic.content.quiz.count} questions` : '',
      description: 'Test your knowledge',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      gradientBg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      className: 'topic-content-link-quiz',
    },
    {
      key: 'mindmap' as const,
      label: 'Mind Map',
      available: !!topic.content.mindmap,
      subtitle: 'Interactive',
      description: 'Explore topic connections visually',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
        </svg>
      ),
      gradientBg: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
      className: 'topic-content-link-mindmap',
    },
  ]

  return (
    <div className="page-wrapper" style={{ maxWidth: '680px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <Link to="/" className="breadcrumb">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          All Topics
        </Link>

        <div className="topic-chapter-badge">
          {topic.chapter}
        </div>

        <h1 className="page-title" style={{ fontSize: 'clamp(28px, 6vw, 40px)', marginBottom: '10px' }}>
          {topic.title}
        </h1>
        <p className="topic-description">
          {topic.description}
        </p>
      </div>

      {/* Content type buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {contentTypes.map((ct, i) => {
          if (!ct.available) return null
          return (
            <Link
              key={ct.key}
              to={`/topic/${slug}/${ct.key}`}
              className={`card-enter topic-content-link ${ct.className}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Icon in gradient circle */}
              <div className="topic-content-icon" style={{ background: ct.gradientBg }}>
                {ct.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                  <h3 className="topic-content-label">
                    {ct.label}
                  </h3>
                  <span className="topic-content-subtitle">
                    {ct.subtitle}
                  </span>
                </div>
                <p className="topic-content-desc">
                  {ct.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="topic-content-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
