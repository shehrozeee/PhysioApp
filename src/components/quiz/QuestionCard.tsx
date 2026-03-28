interface QuestionCardProps {
  question: string
  current: number
  total: number
}

export default function QuestionCard({ question, current, total }: QuestionCardProps) {
  const progressPct = (current / total) * 100

  return (
    <div style={{ width: '100%' }}>
      {/* Progress row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <p className="question-progress-label">
          <span className="question-progress-current">{current}</span>
          {' '}/{' '}
          {total}
        </p>
        {/* Mini progress bar */}
        <div className="question-progress-track">
          <div
            className="question-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question text */}
      <h3 className="page-title" style={{ fontSize: 'clamp(20px, 5vw, 24px)', lineHeight: 1.5 }}>
        {question}
      </h3>
    </div>
  )
}
