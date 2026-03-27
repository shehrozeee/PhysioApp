import { useTopics } from '@/hooks/useTopicData'
import { useDarkMode } from '@/hooks/useDarkMode'
import { Link } from 'react-router-dom'
import type { Topic } from '@/lib/types'

const gradients = [
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)',
  'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
  'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #e11d48 0%, #f97316 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
]

function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const { isDark } = useDarkMode()
  const totalCards = topic.content.flashcards?.count ?? 0
  const totalQs = topic.content.quiz?.count ?? 0
  const gradient = gradients[index % gradients.length]

  return (
    <Link
      to={`/topic/${topic.slug}`}
      className="card-enter group block"
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: isDark ? '#1f2937' : 'white',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        boxShadow: isDark
          ? '0 4px 16px rgba(0,0,0,0.3)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease',
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = isDark
          ? '0 12px 32px rgba(0,0,0,0.5)'
          : '0 12px 32px rgba(79,70,229,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = isDark
          ? '0 4px 16px rgba(0,0,0,0.3)'
          : '0 2px 12px rgba(0,0,0,0.06)'
      }}
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

        <span style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.9)',
          fontFamily: 'var(--font-display)', marginBottom: '12px',
        }}>
          {topic.chapter}
        </span>
        <h3 style={{
          fontSize: '24px', fontWeight: 700, color: 'white',
          fontFamily: 'var(--font-display)', lineHeight: 1.2,
        }}>
          {topic.title}
        </h3>
        <p style={{
          fontSize: '14px', color: 'rgba(255,255,255,0.8)',
          marginTop: '8px', lineHeight: 1.5,
          fontFamily: 'var(--font-body)',
        }}>
          {topic.description}
        </p>
      </div>

      {/* Content badges */}
      <div style={{
        padding: '16px 24px',
        display: 'flex', gap: '8px', flexWrap: 'wrap' as const,
      }}>
        {topic.content.flashcards && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '10px',
            background: isDark ? 'rgba(251,191,36,0.15)' : '#fef3c7',
            fontSize: '13px', fontWeight: 600,
            color: isDark ? '#fbbf24' : '#92400e',
            fontFamily: 'var(--font-display)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 4v16" /></svg>
            {totalCards} cards
          </div>
        )}
        {topic.content.quiz && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '10px',
            background: isDark ? 'rgba(52,211,153,0.15)' : '#d1fae5',
            fontSize: '13px', fontWeight: 600,
            color: isDark ? '#34d399' : '#065f46',
            fontFamily: 'var(--font-display)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            {totalQs} quiz
          </div>
        )}
        {topic.content.mindmap && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '10px',
            background: isDark ? 'rgba(139,92,246,0.15)' : '#ede9fe',
            fontSize: '13px', fontWeight: 600,
            color: isDark ? '#a78bfa' : '#5b21b6',
            fontFamily: 'var(--font-display)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /></svg>
            mind map
          </div>
        )}
      </div>

      {/* Study now CTA */}
      <div style={{ padding: '0 24px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '14px', borderRadius: '14px',
          background: isDark
            ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
            : '#4f46e5',
          color: 'white',
          fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-display)',
          letterSpacing: '0.02em',
          minHeight: '48px',
        }}>
          Study Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  )
}

export function Home() {
  const { topics, loading } = useTopics()
  const { isDark } = useDarkMode()

  return (
    <div style={{
      minHeight: 'calc(100dvh - 56px)',
      padding: 'clamp(24px, 5vw, 48px) clamp(20px, 5vw, 32px)',
      maxWidth: '680px',
      margin: '0 auto',
    }}>
      {/* Welcome header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '20px',
          background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff',
          border: isDark ? '1px solid rgba(99,102,241,0.25)' : '1px solid #e0e7ff',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#6366f1',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: '12px', fontWeight: 600,
            color: isDark ? '#a5b4fc' : '#4f46e5',
            letterSpacing: '0.04em', textTransform: 'uppercase' as const,
            fontFamily: 'var(--font-display)',
          }}>
            Physiology
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(30px, 7vw, 44px)', fontWeight: 800,
          color: isDark ? '#f9fafb' : '#111827',
          lineHeight: 1.15,
          fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
        }}>
          Ready to study? <span style={{ display: 'inline-block', verticalAlign: 'middle' }}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></span>
        </h1>
        <p style={{
          fontSize: '17px',
          color: isDark ? '#9ca3af' : '#6b7280',
          lineHeight: 1.6,
          marginTop: '10px', maxWidth: '420px',
          fontFamily: 'var(--font-body)',
        }}>
          Tap a topic below to start with flashcards, quizzes, or mind maps.
        </p>
      </div>

      {/* Topics */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse" style={{
              height: '240px', borderRadius: '20px',
            }} />
          ))}
        </div>
      ) : topics ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
          {topics.topics.map((topic, i) => (
            <TopicCard key={topic.slug} topic={topic} index={i} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center' as const, padding: '60px 20px',
          color: isDark ? '#6b7280' : '#9ca3af',
        }}>
          <div style={{ marginBottom: '16px', color: isDark ? '#6b7280' : '#9ca3af' }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 15s1.5-2 4-2 4 2 4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg></div>
          <p style={{ fontSize: '16px', fontFamily: 'var(--font-body)' }}>
            Failed to load topics. Please try again later.
          </p>
        </div>
      )}
    </div>
  )
}
