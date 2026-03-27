import { Link } from 'react-router-dom'
import type { Topic } from '@/lib/types'
import { useDarkMode } from '@/hooks/useDarkMode'

interface TopicCardProps {
  topic: Topic
  index: number
}

export function TopicCard({ topic, index }: TopicCardProps) {
  const { isDark } = useDarkMode()
  const totalCards = topic.content.flashcards?.count ?? 0
  const totalQs = topic.content.quiz?.count ?? 0

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
        textDecoration: 'none',
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
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        padding: '24px 20px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10px', left: '30%',
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
        }} />

        <span style={{
          display: 'inline-block', padding: '3px 10px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.9)',
          fontFamily: 'var(--font-display)', marginBottom: '10px',
        }}>
          {topic.chapter}
        </span>
        <h3 style={{
          fontSize: '22px', fontWeight: 700, color: 'white',
          fontFamily: 'var(--font-display)', lineHeight: 1.2,
        }}>
          {topic.title}
        </h3>
        <p style={{
          fontSize: '13px', color: 'rgba(255,255,255,0.75)',
          marginTop: '6px', lineHeight: 1.4,
          fontFamily: 'var(--font-body)',
        }}>
          {topic.description}
        </p>
      </div>

      {/* Content badges */}
      <div style={{
        padding: '16px 20px',
        display: 'flex', gap: '8px', flexWrap: 'wrap' as const,
      }}>
        {topic.content.flashcards && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '10px',
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
            padding: '6px 12px', borderRadius: '10px',
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
            padding: '6px 12px', borderRadius: '10px',
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
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '12px', borderRadius: '12px',
          background: '#4f46e5', color: 'white',
          fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-display)',
          minHeight: '48px',
        }}>
          Study Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  )
}
