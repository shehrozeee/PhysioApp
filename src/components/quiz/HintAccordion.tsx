import { useState, useRef, useEffect } from 'react'

interface HintAccordionProps {
  hint: string
}

export default function HintAccordion({ hint }: HintAccordionProps) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [hint, open])

  return (
    <div className={`hint-container ${open ? 'open' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="hint-toggle"
        aria-expanded={open}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Lightbulb icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '16px', height: '16px' }}
          >
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
          </svg>
          Hint
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
          style={{
            width: '16px',
            height: '16px',
            transition: 'transform 0.3s ease-out',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
          maxHeight: open ? `${height}px` : '0px',
        }}
      >
        <div
          ref={contentRef}
          className="hint-content"
        >
          {hint}
        </div>
      </div>
    </div>
  )
}
