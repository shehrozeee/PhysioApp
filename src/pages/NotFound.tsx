import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="not-found-wrapper">
      <div className="empty-state-icon" style={{ marginBottom: '12px' }}><svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></div>
      <h1 className="not-found-404">
        404
      </h1>
      <h2 className="page-title" style={{ marginBottom: '8px' }}>
        Page not found
      </h2>
      <p className="not-found-text">
        Looks like this page wandered off. Let's get you back to studying!
      </p>
      <Link to="/" className="btn-primary" style={{ boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
        Back to Home
      </Link>
    </div>
  )
}
