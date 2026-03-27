import { useParams, Link } from 'react-router-dom'
import { useMindMap, useTopics } from '@/hooks/useTopicData'
import { useDarkMode } from '@/hooks/useDarkMode'
import { MindMapViewer } from '@/components/mindmap/MindMapViewer'

export function MindMapPage() {
  const { slug } = useParams<{ slug: string }>()
  const { mindmap, loading, error } = useMindMap(slug!)
  const { topics } = useTopics()
  const { isDark } = useDarkMode()
  const topic = topics?.topics.find(t => t.slug === slug)

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100dvh - 56px)',
      }}>
        <div style={{
          width: '56px', height: '56px',
          border: '4px solid',
          borderColor: isDark ? 'rgba(99,102,241,0.2)' : '#c7d2fe',
          borderTopColor: '#4f46e5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error || !mindmap) {
    return (
      <div style={{
        maxWidth: '600px', margin: '0 auto',
        padding: '80px 24px', textAlign: 'center' as const,
      }}>
        <div style={{ marginBottom: '16px', color: isDark ? '#6b7280' : '#9ca3af' }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><circle cx="4" cy="6" r="2" /><circle cx="20" cy="6" r="2" /><circle cx="4" cy="18" r="2" /><circle cx="20" cy="18" r="2" /><path d="M9.5 10.5L6 8" /><path d="M14.5 10.5L18 8" /><path d="M9.5 13.5L6 16" /><path d="M14.5 13.5L18 16" /></svg></div>
        <p style={{
          fontSize: '16px',
          color: isDark ? '#9ca3af' : '#6b7280',
          marginBottom: '20px', fontFamily: 'var(--font-body)',
        }}>
          Mind map not available for this topic.
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
    <div style={{ position: 'relative', height: 'calc(100dvh - 56px)' }}>
      {/* Floating breadcrumb overlay */}
      {topic && (
        <div style={{
          position: 'absolute', top: '16px', left: '16px', zIndex: 10,
          padding: '10px 16px',
          borderRadius: '14px',
          background: isDark ? 'rgba(31,41,55,0.92)' : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          boxShadow: isDark
            ? '0 4px 16px rgba(0,0,0,0.4)'
            : '0 4px 16px rgba(0,0,0,0.08)',
          border: isDark ? '1px solid rgba(55,65,81,0.6)' : '1px solid rgba(229,231,235,0.8)',
        }}>
          <Link
            to={`/topic/${slug}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', fontWeight: 500,
              color: isDark ? '#9ca3af' : '#6b7280',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              minHeight: '28px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            {topic.chapter} / {topic.title}
          </Link>
          <h2 style={{
            fontSize: '15px', fontWeight: 700,
            color: isDark ? '#f9fafb' : '#111827',
            fontFamily: 'var(--font-display)',
          }}>
            Mind Map <svg style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><circle cx="4" cy="6" r="2" /><circle cx="20" cy="6" r="2" /><circle cx="4" cy="18" r="2" /><circle cx="20" cy="18" r="2" /><path d="M9.5 10.5L6 8" /><path d="M14.5 10.5L18 8" /><path d="M9.5 13.5L6 16" /><path d="M14.5 13.5L18 16" /></svg>
          </h2>
        </div>
      )}
      <MindMapViewer data={mindmap} />
    </div>
  )
}
