import { useState, useRef, useEffect } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'

interface HintAccordionProps {
  hint: string
}

export default function HintAccordion({ hint }: HintAccordionProps) {
  const { isDark } = useDarkMode()
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [hint, open])

  return (
    <div
      className="w-full rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: open
          ? (isDark ? 'rgba(49, 46, 129, 0.2)' : 'rgba(238, 242, 255, 0.8)')
          : (isDark ? 'rgba(55, 65, 81, 0.4)' : '#f9fafb'),
        boxShadow: open
          ? (isDark ? 'inset 0 0 0 1px rgba(99, 102, 241, 0.3)' : 'inset 0 0 0 1px #c7d2fe')
          : 'none',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors rounded-xl"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5 text-sm font-medium">
          {/* Lightbulb icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 transition-colors duration-200"
            style={{
              color: open
                ? (isDark ? '#818cf8' : '#4f46e5')
                : (isDark ? '#6b7280' : '#9ca3af'),
            }}
          >
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
          </svg>
          <span
            className="font-[family-name:var(--font-display)] transition-colors duration-200"
            style={{
              color: open
                ? (isDark ? '#a5b4fc' : '#4338ca')
                : (isDark ? '#9ca3af' : '#4b5563'),
            }}
          >
            Hint
          </span>
        </span>

        {/* Chevron that rotates */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-all duration-300 ease-out"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: open
              ? '#6366f1'
              : (isDark ? '#6b7280' : '#9ca3af'),
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: open ? `${height}px` : '0px' }}
      >
        <div
          ref={contentRef}
          className="px-5 pb-4 pt-0"
        >
          <p
            className="font-[family-name:var(--font-body)] text-sm leading-relaxed"
            style={{ color: isDark ? '#d1d5db' : '#374151' }}
          >
            {hint}
          </p>
        </div>
      </div>
    </div>
  )
}
