import { useParams, Link } from 'react-router-dom'
import { useMindMap, useTopics } from '@/hooks/useTopicData'
import { MindMapViewer } from '@/components/mindmap/MindMapViewer'

export function MindMapPage() {
  const { slug } = useParams<{ slug: string }>()
  const { mindmap, loading, error } = useMindMap(slug!)
  const { topics } = useTopics()
  const topic = topics?.topics.find(t => t.slug === slug)

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100dvh - 56px)',
      }}>
        <div className="mindmap-spinner" />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error || !mindmap) {
    return (
      <div className="page-wrapper" style={{ paddingTop: '80px', textAlign: 'center' }}>
        <div className="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><circle cx="4" cy="6" r="2" /><circle cx="20" cy="6" r="2" /><circle cx="4" cy="18" r="2" /><circle cx="20" cy="18" r="2" /><path d="M9.5 10.5L6 8" /><path d="M14.5 10.5L18 8" /><path d="M9.5 13.5L6 16" /><path d="M14.5 13.5L18 16" /></svg></div>
        <p className="empty-state-text">
          Mind map not available for this topic.
        </p>
        <Link to={`/topic/${slug}`} className="btn-primary" style={{ marginTop: '20px' }}>
          Back to topic
        </Link>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', height: 'calc(100dvh - 56px)' }}>
      {/* Floating breadcrumb overlay */}
      {topic && (
        <div className="mindmap-breadcrumb-overlay">
          <Link to={`/topic/${slug}`} className="breadcrumb" style={{ minHeight: '28px', fontSize: '12px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            {topic.chapter} / {topic.title}
          </Link>
          <h2 className="page-title" style={{ fontSize: '15px', marginTop: '0' }}>
            Mind Map <svg style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><circle cx="4" cy="6" r="2" /><circle cx="20" cy="6" r="2" /><circle cx="4" cy="18" r="2" /><circle cx="20" cy="18" r="2" /><path d="M9.5 10.5L6 8" /><path d="M14.5 10.5L18 8" /><path d="M9.5 13.5L6 16" /><path d="M14.5 13.5L18 16" /></svg>
          </h2>
        </div>
      )}
      <MindMapViewer data={mindmap} />
    </div>
  )
}
