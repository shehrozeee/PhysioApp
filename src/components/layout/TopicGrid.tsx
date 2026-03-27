import type { Topic } from '@/lib/types'
import { TopicCard } from './TopicCard'
import { useDarkMode } from '@/hooks/useDarkMode'

interface TopicGridProps {
  topics: Topic[]
}

export function TopicGrid({ topics }: TopicGridProps) {
  const { isDark } = useDarkMode()

  if (topics.length === 0) {
    return (
      <div style={{
        textAlign: 'center' as const,
        padding: '60px 20px',
      }}>
        <div style={{ marginBottom: '12px', color: isDark ? '#6b7280' : '#9ca3af' }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></div>
        <p style={{
          fontSize: '16px',
          color: isDark ? '#6b7280' : '#9ca3af',
          fontFamily: 'var(--font-body)',
        }}>
          No topics available yet.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    }}>
      {topics.map((topic, i) => (
        <TopicCard key={topic.slug} topic={topic} index={i} />
      ))}
    </div>
  )
}
