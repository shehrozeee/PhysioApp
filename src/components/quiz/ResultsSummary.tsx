interface WrongAnswer {
  question: string
  yourAnswer: string
  correctAnswer: string
}

interface ResultsSummaryProps {
  score: number
  total: number
  wrongQuestions: WrongAnswer[]
  onRetry: () => void
  onBack: () => void
}

function getScoreColor(pct: number) {
  if (pct >= 70) return {
    ring: '#22c55e',
    text: 'var(--results-score-text-green)',
    label: 'var(--results-label-green)',
    ringBg: 'var(--results-ring-bg-green)',
  }
  if (pct >= 50) return {
    ring: '#f59e0b',
    text: 'var(--results-score-text-amber)',
    label: 'var(--results-label-amber)',
    ringBg: 'var(--results-ring-bg-amber)',
  }
  return {
    ring: '#ef4444',
    text: 'var(--results-score-text-red)',
    label: 'var(--results-label-red)',
    ringBg: 'var(--results-ring-bg-red)',
  }
}

function getScoreMessage(pct: number) {
  if (pct === 100) return 'Perfect score!'
  if (pct >= 80) return 'Excellent work!'
  if (pct >= 70) return 'Great job!'
  if (pct >= 50) return 'Good effort!'
  if (pct >= 30) return 'Keep practicing!'
  return 'Room for improvement'
}

export default function ResultsSummary({ score, total, wrongQuestions, onRetry, onBack }: ResultsSummaryProps) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const colors = getScoreColor(pct)

  // SVG circle calculations
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="mx-auto w-full card-enter" style={{ maxWidth: '640px' }}>
      <div className="card-container">
        {/* Score section */}
        <div className="results-score-section">
          {/* Score donut ring */}
          <div style={{ position: 'relative', display: 'flex', height: '160px', width: '160px', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
              {/* Background ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={colors.ringBg}
                strokeWidth={10}
              />
              {/* Score ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                strokeWidth={10}
                strokeLinecap="round"
                stroke={colors.ring}
                style={{ transition: 'all 1s ease-out' }}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div style={{ textAlign: 'center', zIndex: 10 }}>
              <p className="results-pct" style={{ color: colors.text }}>
                {pct}%
              </p>
              <p className="results-fraction">
                {score}/{total}
              </p>
            </div>
          </div>

          {/* Result label */}
          <div style={{ textAlign: 'center' }}>
            <p className="results-message" style={{ color: colors.label }}>
              {getScoreMessage(pct)}
            </p>
          </div>
        </div>

        {/* Wrong answers review */}
        {wrongQuestions.length > 0 && (
          <div style={{ paddingTop: '32px' }}>
            <h4 className="results-review-heading">
              Review Incorrect Answers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {wrongQuestions.map((wq, i) => (
                <div
                  key={i}
                  className="results-wrong-card"
                >
                  <p className="results-wrong-question">
                    {wq.question}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ height: '16px', width: '16px', marginTop: '2px', flexShrink: 0, color: '#f87171' }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
                      </svg>
                      <span className="results-your-answer">
                        {wq.yourAnswer}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ height: '16px', width: '16px', marginTop: '2px', flexShrink: 0, color: '#22c55e' }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                      </svg>
                      <span className="results-correct-answer">
                        {wq.correctAnswer}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All correct celebration */}
        {wrongQuestions.length === 0 && (
          <div style={{ paddingTop: '32px', textAlign: 'center' }}>
            <p className="results-all-correct">
              You answered every question correctly. Well done!
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{
          display: 'flex', flexDirection: 'column-reverse', alignItems: 'center',
          justifyContent: 'center', gap: '12px', paddingTop: '32px', marginTop: '8px',
        }}>
          <button
            onClick={onBack}
            className="btn-secondary"
            style={{ width: '100%', maxWidth: '280px' }}
          >
            Back to Topic
          </button>
          <button
            onClick={onRetry}
            className="btn-primary"
            style={{ width: '100%', maxWidth: '280px' }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
