import { useParams, Link } from 'react-router-dom'
import { useTopics } from '@/hooks/useTopicData'
import { useDarkMode } from '@/hooks/useDarkMode'

export function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const { topics, loading } = useTopics()
  const { isDark } = useDarkMode()

  if (loading) {
    return (
      <div style={{
        maxWidth: '680px', margin: '0 auto',
        padding: 'clamp(24px, 5vw, 48px) clamp(20px, 5vw, 32px)',
      }}>
        <div className="animate-pulse" style={{ height: '24px', width: '120px', borderRadius: '8px', marginBottom: '16px' }} />
        <div className="animate-pulse" style={{ height: '40px', width: '280px', borderRadius: '12px', marginBottom: '12px' }} />
        <div className="animate-pulse" style={{ height: '20px', width: '100%', maxWidth: '400px', borderRadius: '8px', marginBottom: '40px' }} />
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
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
      <div style={{
        maxWidth: '680px', margin: '0 auto',
        padding: '80px 24px', textAlign: 'center' as const,
      }}>
        <div style={{ marginBottom: '16px', color: isDark ? '#6b7280' : '#9ca3af' }}><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></div>
        <h2 style={{
          fontSize: '24px', fontWeight: 700,
          color: isDark ? '#f9fafb' : '#111827',
          fontFamily: 'var(--font-display)', marginBottom: '8px',
        }}>
          Topic not found
        </h2>
        <p style={{
          fontSize: '16px',
          color: isDark ? '#9ca3af' : '#6b7280',
          marginBottom: '24px', fontFamily: 'var(--font-body)',
        }}>
          This topic doesn't exist or hasn't been added yet.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '14px',
            background: '#4f46e5', color: 'white',
            fontSize: '15px', fontWeight: 600,
            fontFamily: 'var(--font-display)',
            textDecoration: 'none',
            minHeight: '48px',
          }}
        >
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
      gradientBg: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      lightBg: '#fffbeb',
      darkBg: 'rgba(245,158,11,0.1)',
      lightBorder: '#fef3c7',
      darkBorder: 'rgba(245,158,11,0.2)',
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
      gradientBg: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
      lightBg: '#ecfdf5',
      darkBg: 'rgba(16,185,129,0.1)',
      lightBorder: '#d1fae5',
      darkBorder: 'rgba(16,185,129,0.2)',
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
      gradientBg: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      lightBg: '#f5f3ff',
      darkBg: 'rgba(139,92,246,0.1)',
      lightBorder: '#ede9fe',
      darkBorder: 'rgba(139,92,246,0.2)',
    },
  ]

  return (
    <div style={{
      maxWidth: '680px', margin: '0 auto',
      padding: 'clamp(24px, 5vw, 48px) clamp(20px, 5vw, 32px)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', fontWeight: 500,
            color: isDark ? '#9ca3af' : '#6b7280',
            textDecoration: 'none', marginBottom: '16px',
            fontFamily: 'var(--font-body)',
            minHeight: '48px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          All Topics
        </Link>

        <div style={{
          display: 'inline-block', padding: '5px 14px', borderRadius: '10px',
          background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff',
          border: isDark ? '1px solid rgba(99,102,241,0.25)' : '1px solid #e0e7ff',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: isDark ? '#a5b4fc' : '#4f46e5',
          fontFamily: 'var(--font-display)', marginBottom: '12px',
        }}>
          {topic.chapter}
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 800,
          color: isDark ? '#f9fafb' : '#111827',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em', lineHeight: 1.15,
          marginBottom: '10px',
        }}>
          {topic.title}
        </h1>
        <p style={{
          fontSize: '16px', lineHeight: 1.6,
          color: isDark ? '#9ca3af' : '#6b7280',
          fontFamily: 'var(--font-body)',
        }}>
          {topic.description}
        </p>
      </div>

      {/* Content type buttons */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
        {contentTypes.map((ct, i) => {
          if (!ct.available) return null
          return (
            <Link
              key={ct.key}
              to={`/topic/${slug}/${ct.key}`}
              className="card-enter"
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px',
                borderRadius: '18px',
                background: isDark ? ct.darkBg : ct.lightBg,
                border: `1px solid ${isDark ? ct.darkBorder : ct.lightBorder}`,
                textDecoration: 'none',
                minHeight: '80px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                animationDelay: `${i * 100}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = isDark
                  ? '0 8px 24px rgba(0,0,0,0.3)'
                  : '0 8px 24px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Icon in gradient circle */}
              <div style={{
                flexShrink: 0,
                width: '52px', height: '52px',
                borderRadius: '14px',
                background: ct.gradientBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
                {ct.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                  <h3 style={{
                    fontSize: '17px', fontWeight: 700,
                    color: isDark ? '#f9fafb' : '#111827',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {ct.label}
                  </h3>
                  <span style={{
                    fontSize: '13px', fontWeight: 500,
                    color: isDark ? '#6b7280' : '#9ca3af',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {ct.subtitle}
                  </span>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.4,
                }}>
                  {ct.description}
                </p>
              </div>

              {/* Arrow */}
              <div style={{
                flexShrink: 0,
                width: '36px', height: '36px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                transition: 'background 0.2s ease',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#9ca3af' : '#9ca3af'} strokeWidth="2.5">
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
