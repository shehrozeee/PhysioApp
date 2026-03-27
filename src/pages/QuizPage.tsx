import { useParams, Link } from 'react-router-dom'
import { useQuiz, useTopics } from '@/hooks/useTopicData'
import { useDarkMode } from '@/hooks/useDarkMode'
import QuizEngine from '@/components/quiz/QuizEngine'

export function QuizPage() {
  const { slug } = useParams<{ slug: string }>()
  const { quiz, loading, error } = useQuiz(slug!)
  const { topics } = useTopics()
  const { isDark } = useDarkMode()
  const topic = topics?.topics.find(t => t.slug === slug)

  if (loading) {
    return (
      <div style={{
        maxWidth: '600px', margin: '0 auto',
        padding: 'clamp(20px, 4vw, 40px) clamp(16px, 5vw, 32px)',
      }}>
        <div className="animate-pulse" style={{ height: '16px', width: '200px', borderRadius: '6px', marginBottom: '8px' }} />
        <div className="animate-pulse" style={{ height: '32px', width: '120px', borderRadius: '8px', marginBottom: '32px' }} />
        <div className="animate-pulse" style={{ height: '360px', borderRadius: '24px' }} />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div style={{
        maxWidth: '600px', margin: '0 auto',
        padding: '80px 24px', textAlign: 'center' as const,
      }}>
        <div style={{ marginBottom: '16px', color: isDark ? '#6b7280' : '#9ca3af' }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 7h6" /><path d="M9 11h6" /><path d="M9 15h4" /></svg></div>
        <p style={{
          fontSize: '16px',
          color: isDark ? '#9ca3af' : '#6b7280',
          marginBottom: '20px', fontFamily: 'var(--font-body)',
        }}>
          Quiz not available for this topic.
        </p>
        <Link
          to={`/topic/${slug}`}
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
          Back to topic
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '600px', margin: '0 auto',
      padding: 'clamp(20px, 4vw, 40px) clamp(16px, 5vw, 32px)',
    }}>
      {topic && (
        <div style={{ marginBottom: '24px' }}>
          <Link
            to={`/topic/${slug}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 500,
              color: isDark ? '#9ca3af' : '#6b7280',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              minHeight: '48px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            {topic.chapter} / {topic.title}
          </Link>
          <h2 style={{
            fontSize: '28px', fontWeight: 800,
            color: isDark ? '#f9fafb' : '#111827',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            marginTop: '2px',
          }}>
            Quiz <svg style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 7h6" /><path d="M9 11h6" /><path d="M9 15h4" /></svg>
          </h2>
        </div>
      )}
      <QuizEngine questions={quiz.questions} slug={slug!} />
    </div>
  )
}
