import { useEffect, useRef, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '@/hooks/useSearch'
import type { SearchResult } from '@/hooks/useSearch'
import { useDarkMode } from '@/hooks/useDarkMode'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const typeBadge: Record<SearchResult['type'], { label: string; bg: string; darkBg: string; text: string; darkText: string }> = {
  flashcard: { label: 'Flashcard', bg: '#dbeafe', darkBg: 'rgba(59,130,246,0.2)', text: '#1d4ed8', darkText: '#60a5fa' },
  quiz: { label: 'Quiz', bg: '#d1fae5', darkBg: 'rgba(16,185,129,0.2)', text: '#047857', darkText: '#34d399' },
  mindmap: { label: 'Mind Map', bg: '#ede9fe', darkBg: 'rgba(139,92,246,0.2)', text: '#6d28d9', darkText: '#a78bfa' },
}

function groupByTopic(results: SearchResult[]): Map<string, SearchResult[]> {
  const groups = new Map<string, SearchResult[]>()
  for (const r of results) {
    const existing = groups.get(r.topicSlug)
    if (existing) existing.push(r)
    else groups.set(r.topicSlug, [r])
  }
  return groups
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate()
  const { query, setQuery, results, loading } = useSearch()
  const { isDark } = useDarkMode()
  const inputRef = useRef<HTMLInputElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const resultsRef = useRef<HTMLDivElement>(null)
  const flatResults = results

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus())
      setActiveIndex(-1)
    } else {
      setQuery('')
    }
  }, [isOpen, setQuery])

  useEffect(() => { setActiveIndex(-1) }, [results])

  const navigateToResult = useCallback((result: SearchResult) => {
    const typeMap = { flashcard: 'flashcards', quiz: 'quiz', mindmap: 'mindmap' } as const
    onClose()
    navigate(`/topic/${result.topicSlug}/${typeMap[result.type]}`)
  }, [navigate, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(p => Math.min(p + 1, flatResults.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(p => Math.max(p - 1, -1)) }
    else if (e.key === 'Enter' && activeIndex >= 0 && activeIndex < flatResults.length) { e.preventDefault(); navigateToResult(flatResults[activeIndex]) }
    else if (e.key === 'Escape') { e.preventDefault(); onClose() }
  }, [activeIndex, flatResults, navigateToResult, onClose])

  useEffect(() => {
    if (activeIndex < 0) return
    const items = resultsRef.current?.querySelectorAll('[data-search-item]')
    ;(items?.[activeIndex] as HTMLElement)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!isOpen) return null

  const grouped = groupByTopic(results)
  let flatIndex = -1

  return (
    <div
      className="search-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
        padding: '12vh 24px 24px',
      }}
    >
      <div
        className="search-modal"
        onKeyDown={handleKeyDown}
        style={{
          width: '100%', maxWidth: '560px',
          borderRadius: '20px', overflow: 'hidden',
          background: isDark ? '#1f2937' : 'white',
          boxShadow: isDark
            ? '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(55,65,81,0.5)'
            : '0 24px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
        }}
      >
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '18px 24px',
          borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flashcards, quizzes, mind maps..."
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: '16px', fontFamily: 'var(--font-body)',
              color: isDark ? '#f9fafb' : '#111827',
            }}
          />
          <kbd style={{
            padding: '2px 8px', borderRadius: '6px',
            background: isDark ? '#374151' : '#f3f4f6', fontSize: '11px',
            fontFamily: 'monospace', color: '#9ca3af',
          }}>ESC</kbd>
        </div>

        {/* Results area */}
        <div ref={resultsRef} style={{ maxHeight: '55vh', overflowY: 'auto' }}>
          {loading && (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: isDark ? '#6b7280' : '#9ca3af', fontSize: '14px' }}>
              Loading search index...
            </div>
          )}

          {!loading && query.trim().length > 0 && results.length === 0 && (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: isDark ? '#6b7280' : '#9ca3af', fontSize: '14px' }}>
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && query.trim().length === 0 && (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: isDark ? '#6b7280' : '#9ca3af', fontSize: '14px' }}>
              Start typing to search across all content
            </div>
          )}

          {!loading && results.length > 0 &&
            Array.from(grouped.entries()).map(([topicSlug, items]) => (
              <div key={topicSlug}>
                <div style={{
                  position: 'sticky', top: 0, padding: '10px 24px',
                  background: isDark ? 'rgba(31,41,55,0.95)' : 'rgba(249,250,251,0.95)', backdropFilter: 'blur(4px)',
                  fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
                  textTransform: 'uppercase', color: isDark ? '#9ca3af' : '#6b7280',
                  fontFamily: 'var(--font-display)',
                }}>
                  {items[0].topicTitle}
                </div>
                {items.map((result) => {
                  flatIndex++
                  const idx = flatIndex
                  const isActive = idx === activeIndex
                  const badge = typeBadge[result.type]
                  return (
                    <button
                      key={result.id}
                      data-search-item
                      onClick={() => navigateToResult(result)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        width: '100%', padding: '12px 24px', textAlign: 'left',
                        border: 'none', cursor: 'pointer',
                        background: isActive ? (isDark ? '#1e3a5f' : '#eef2ff') : 'transparent',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: '6px',
                        fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap',
                        background: isDark ? badge.darkBg : badge.bg,
                        color: isDark ? badge.darkText : badge.text,
                        marginTop: '2px',
                      }}>
                        {badge.label}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{
                          display: 'block', fontSize: '14px', fontWeight: 500,
                          color: isDark ? '#f9fafb' : '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          fontFamily: 'var(--font-body)',
                        }}>
                          {result.title}
                        </span>
                        <span style={{
                          display: 'block', fontSize: '12px', color: isDark ? '#6b7280' : '#9ca3af', marginTop: '2px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {result.text.length > 120 ? result.text.slice(0, 120) + '...' : result.text}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '10px 24px', borderTop: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            fontSize: '11px', color: '#9ca3af',
          }}>
            <span><kbd style={{ padding: '1px 5px', borderRadius: '4px', background: isDark ? '#374151' : '#f3f4f6', fontFamily: 'monospace', fontSize: '10px' }}>&uarr;&darr;</kbd> Navigate</span>
            <span><kbd style={{ padding: '1px 5px', borderRadius: '4px', background: isDark ? '#374151' : '#f3f4f6', fontFamily: 'monospace', fontSize: '10px' }}>&crarr;</kbd> Open</span>
            <span><kbd style={{ padding: '1px 5px', borderRadius: '4px', background: isDark ? '#374151' : '#f3f4f6', fontFamily: 'monospace', fontSize: '10px' }}>esc</kbd> Close</span>
          </div>
        )}
      </div>
    </div>
  )
}
