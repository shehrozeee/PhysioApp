import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { SearchModal } from './SearchModal'
import { useDarkMode } from '@/hooks/useDarkMode'

export function AppShell() {
  const { isDark, toggle } = useDarkMode()
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isHome = location.pathname === '/'

  return (
    <div style={{
      minHeight: '100dvh',
      background: isDark ? '#111827' : '#ffffff',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>
      {/* Header - compact 56px on mobile */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: isDark ? 'rgba(17,24,39,0.85)' : 'rgba(255,255,255,0.85)',
        borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        // Safe area for notch phones
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: Back + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isHome && (
              <Link
                to="/"
                aria-label="Back to home"
                style={{
                  width: '40px', height: '40px',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  textDecoration: 'none',
                  marginRight: '4px',
                  minHeight: '48px', minWidth: '48px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Link>
            )}
            <Link to="/" style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              textDecoration: 'none',
              minHeight: '48px',
            }}>
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '10px',
                background: '#4f46e5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span style={{
                fontSize: '18px', fontWeight: 700,
                color: isDark ? '#f9fafb' : '#111827',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.01em',
              }}>
                PhysioApp
              </span>
            </Link>
          </div>

          {/* Right: Search + Theme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              style={{
                width: '44px', height: '44px',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDark ? '#1f2937' : '#f9fafb',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                cursor: 'pointer',
                color: isDark ? '#9ca3af' : '#6b7280',
                minHeight: '48px', minWidth: '48px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <ThemeToggle isDark={isDark} onToggle={toggle} />
          </div>
        </div>
      </header>

      <main className="page-enter">
        <Outlet />
      </main>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
