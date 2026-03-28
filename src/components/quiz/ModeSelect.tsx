interface ModeSelectProps {
  onSelect: (mode: 'practice' | 'test') => void
  isShuffled: boolean
  onToggleShuffle: () => void
}

export default function ModeSelect({ onSelect, isShuffled, onToggleShuffle }: ModeSelectProps) {
  return (
    <div className="mx-auto w-full card-enter">
      <div className="card-container" style={{ textAlign: 'center' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h2 className="page-title" style={{ fontSize: 'clamp(22px, 5vw, 28px)' }}>
            Choose Your Mode
          </h2>
          <p className="mode-select-subtitle">
            How would you like to study?
          </p>
        </div>

        {/* Shuffle toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <button
            className={`shuffle-btn${isShuffled ? ' active' : ''}`}
            onClick={onToggleShuffle}
            aria-label="Toggle shuffle questions"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
            Shuffle questions
          </button>
        </div>

        {/* Mode cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          width: '100%',
        }}>
          {/* Practice Mode Card */}
          <button
            onClick={() => onSelect('practice')}
            className="mode-card"
          >
            {/* Icon in soft circle */}
            <div className="mode-card-icon mode-card-icon-practice">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '32px', height: '32px' }}
              >
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
              </svg>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 className="mode-card-title">
                Practice Mode
              </h3>
              <p className="mode-card-desc">
                Get instant feedback after each answer
              </p>
            </div>
          </button>

          {/* Test Mode Card */}
          <button
            onClick={() => onSelect('test')}
            className="mode-card"
          >
            {/* Icon in soft circle */}
            <div className="mode-card-icon mode-card-icon-test">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '32px', height: '32px' }}
              >
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="m9 14 2 2 4-4" />
              </svg>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 className="mode-card-title">
                Test Mode
              </h3>
              <p className="mode-card-desc">
                See your score at the end
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
