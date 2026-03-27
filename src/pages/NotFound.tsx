import { Link } from 'react-router-dom'
import { useDarkMode } from '@/hooks/useDarkMode'

export function NotFound() {
  const { isDark } = useDarkMode()

  return (
    <div style={{
      maxWidth: '480px', margin: '0 auto',
      padding: '80px 24px',
      textAlign: 'center' as const,
      minHeight: 'calc(100dvh - 56px)',
      display: 'flex', flexDirection: 'column' as const,
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ marginBottom: '12px', color: isDark ? '#6b7280' : '#9ca3af' }}><svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></div>
      <h1 style={{
        fontSize: '64px', fontWeight: 800,
        color: isDark ? 'rgba(249,250,251,0.1)' : 'rgba(17,24,39,0.08)',
        fontFamily: 'var(--font-display)',
        lineHeight: 1, marginBottom: '8px',
        letterSpacing: '-0.04em',
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '22px', fontWeight: 700,
        color: isDark ? '#f9fafb' : '#111827',
        fontFamily: 'var(--font-display)',
        marginBottom: '8px',
      }}>
        Page not found
      </h2>
      <p style={{
        fontSize: '16px', lineHeight: 1.6,
        color: isDark ? '#9ca3af' : '#6b7280',
        fontFamily: 'var(--font-body)',
        marginBottom: '32px',
        maxWidth: '320px',
      }}>
        Looks like this page wandered off. Let's get you back to studying!
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '14px 28px', borderRadius: '14px',
          background: '#4f46e5', color: 'white',
          fontSize: '16px', fontWeight: 700,
          fontFamily: 'var(--font-display)',
          textDecoration: 'none',
          minHeight: '52px',
          boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
        Back to Home
      </Link>
    </div>
  )
}
