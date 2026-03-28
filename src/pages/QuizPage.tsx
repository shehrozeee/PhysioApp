import { useParams, Link } from 'react-router-dom'
import { useQuiz, useTopics } from '@/hooks/useTopicData'
import QuizEngine from '@/components/quiz/QuizEngine'

export function QuizPage() {
  const { slug } = useParams<{ slug: string }>()
  const { quiz, loading, error } = useQuiz(slug!)
  const { topics } = useTopics()
  const topic = topics?.topics.find(t => t.slug === slug)

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="animate-pulse" style={{ height: '16px', width: '200px', borderRadius: '6px', marginBottom: '8px' }} />
        <div className="animate-pulse" style={{ height: '32px', width: '120px', borderRadius: '8px', marginBottom: '32px' }} />
        <div className="animate-pulse" style={{ height: '360px', borderRadius: '24px' }} />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="page-wrapper" style={{ paddingTop: '80px', textAlign: 'center' }}>
        <div className="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 7h6" /><path d="M9 11h6" /><path d="M9 15h4" /></svg></div>
        <p className="empty-state-text">
          Quiz not available for this topic.
        </p>
        <Link to={`/topic/${slug}`} className="btn-primary" style={{ marginTop: '20px' }}>
          Back to topic
        </Link>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      {topic && (
        <div className="page-header">
          <Link to={`/topic/${slug}`} className="breadcrumb">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            {topic.chapter} / {topic.title}
          </Link>
          <h2 className="page-title">
            Quiz <svg style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 7h6" /><path d="M9 11h6" /><path d="M9 15h4" /></svg>
          </h2>
        </div>
      )}
      <QuizEngine questions={quiz.questions} slug={slug!} />
    </div>
  )
}
