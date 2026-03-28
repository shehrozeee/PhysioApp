interface ScoreBarProps {
  correctCount: number
  wrongCount: number
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export default function ScoreBar({
  correctCount,
  wrongCount,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: ScoreBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      {/* Main controls row */}
      <div className="score-bar">
        {/* Previous button */}
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          aria-label="Previous card"
          className="score-nav-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ width: '20px', height: '20px' }}
          >
            <path
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Score display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {/* Wrong count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="score-icon-wrong">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ width: '16px', height: '16px', color: '#ef4444' }}
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </span>
            <span className="score-count-wrong">
              {wrongCount}
            </span>
          </div>

          {/* Correct count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="score-icon-correct">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ width: '16px', height: '16px', color: '#22c55e' }}
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="score-count-correct">
              {correctCount}
            </span>
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          aria-label="Next card"
          className="score-nav-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ width: '20px', height: '20px' }}
          >
            <path
              fillRule="evenodd"
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
