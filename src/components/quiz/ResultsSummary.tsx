import { useDarkMode } from '@/hooks/useDarkMode'

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

function getScoreColor(pct: number, isDark: boolean) {
  if (pct >= 70) return {
    ring: '#22c55e',
    text: isDark ? '#4ade80' : '#16a34a',
    label: isDark ? '#86efac' : '#15803d',
    ringBg: isDark ? 'rgba(22, 101, 52, 0.4)' : '#dcfce7',
  }
  if (pct >= 50) return {
    ring: '#f59e0b',
    text: isDark ? '#fbbf24' : '#d97706',
    label: isDark ? '#fcd34d' : '#b45309',
    ringBg: isDark ? 'rgba(120, 53, 15, 0.4)' : '#fef3c7',
  }
  return {
    ring: '#ef4444',
    text: isDark ? '#f87171' : '#dc2626',
    label: isDark ? '#fca5a5' : '#b91c1c',
    ringBg: isDark ? 'rgba(127, 29, 29, 0.4)' : '#fee2e2',
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
  const { isDark } = useDarkMode()
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const colors = getScoreColor(pct, isDark)

  // SVG circle calculations
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="mx-auto w-full max-w-2xl card-enter">
      <div
        className="rounded-2xl p-8 sm:p-10"
        style={{
          background: isDark ? '#1f2937' : 'white',
          border: isDark ? '1px solid #374151' : '1px solid #f3f4f6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {/* Score section */}
        <div
          className="flex flex-col items-center gap-6 pb-8"
          style={{ borderBottom: isDark ? '1px solid #374151' : '1px solid #f3f4f6' }}
        >
          {/* Score donut ring */}
          <div className="relative flex h-40 w-40 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
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
                className="transition-all duration-1000 ease-out"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="text-center z-10">
              <p
                className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight"
                style={{ color: colors.text }}
              >
                {pct}%
              </p>
              <p
                className="font-[family-name:var(--font-body)] text-sm mt-0.5"
                style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
              >
                {score}/{total}
              </p>
            </div>
          </div>

          {/* Result label */}
          <div className="text-center">
            <p
              className="font-[family-name:var(--font-display)] text-xl font-semibold"
              style={{ color: colors.label }}
            >
              {getScoreMessage(pct)}
            </p>
          </div>
        </div>

        {/* Wrong answers review */}
        {wrongQuestions.length > 0 && (
          <div className="pt-8">
            <h4
              className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
            >
              Review Incorrect Answers
            </h4>
            <div className="flex flex-col gap-3">
              {wrongQuestions.map((wq, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5"
                  style={{ background: isDark ? 'rgba(55, 65, 81, 0.4)' : '#f9fafb' }}
                >
                  <p
                    className="font-[family-name:var(--font-body)] text-sm font-medium leading-snug mb-3"
                    style={{ color: isDark ? '#e5e7eb' : '#1f2937' }}
                  >
                    {wq.question}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#f87171' }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
                      </svg>
                      <span
                        className="font-[family-name:var(--font-body)]"
                        style={{ color: isDark ? '#f87171' : '#dc2626' }}
                      >
                        {wq.yourAnswer}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#22c55e' }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                      </svg>
                      <span
                        className="font-[family-name:var(--font-body)]"
                        style={{ color: isDark ? '#4ade80' : '#16a34a' }}
                      >
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
          <div className="pt-8 text-center">
            <p
              className="font-[family-name:var(--font-body)] text-sm"
              style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
            >
              You answered every question correctly. Well done!
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3 pt-8 mt-2">
          <button
            onClick={onBack}
            className="w-full sm:w-auto rounded-xl px-6 py-3 text-sm font-semibold
                       font-[family-name:var(--font-display)]
                       transition-all duration-200 hover:shadow-sm
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
                       active:scale-[0.98]"
            style={{
              background: isDark ? 'rgba(55, 65, 81, 0.5)' : 'white',
              border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
              color: isDark ? '#d1d5db' : '#374151',
              minHeight: '48px',
            }}
          >
            Back to Topic
          </button>
          <button
            onClick={onRetry}
            className="w-full sm:w-auto rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white
                       font-[family-name:var(--font-display)]
                       shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
                       active:scale-[0.98]"
            style={{ minHeight: '48px' }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
