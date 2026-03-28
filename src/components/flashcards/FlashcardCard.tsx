import { useDarkMode } from '@/hooks/useDarkMode'

interface FlashcardCardProps {
  question: string
  answer: string
  isFlipped: boolean
  onFlip: () => void
  currentIndex: number
  total: number
  feedbackState: 'correct' | 'wrong' | null
}

export default function FlashcardCard({
  question,
  answer,
  isFlipped,
  onFlip,
  currentIndex,
  total,
  feedbackState,
}: FlashcardCardProps) {
  const { isDark } = useDarkMode()

  // Determine the card background based on feedback state
  const feedbackBgStyle =
    feedbackState === 'correct'
      ? { background: isDark ? 'rgba(34, 197, 94, 0.3)' : '#f0fdf4' }
      : feedbackState === 'wrong'
        ? { background: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fef2f2' }
        : {}

  const feedbackTextColor =
    feedbackState === 'correct'
      ? (isDark ? '#4ade80' : '#22c55e')
      : feedbackState === 'wrong'
        ? (isDark ? '#f87171' : '#ef4444')
        : undefined

  return (
    <div
      className="flip-card w-full cursor-pointer select-none"
      style={{ minHeight: '400px', height: '55vh', maxHeight: '560px' }}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label={
        isFlipped
          ? 'Showing answer. Click to see question.'
          : 'Showing question. Click to see answer.'
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onFlip()
        }
      }}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Question side */}
        <div
          className="flip-card-front transition-colors duration-500 ease-in-out"
          style={
            feedbackState
              ? feedbackBgStyle
              : {
                  background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                }
          }
        >
          {/* Card counter - top left */}
          <span
            className="absolute top-5 left-6 text-sm font-medium tabular-nums tracking-wide transition-colors duration-500"
            style={{
              fontFamily: 'var(--font-display)',
              color: feedbackState ? '#9ca3af' : '#94a3b8',
            }}
          >
            {currentIndex + 1}/{total}
          </span>

          {feedbackState ? (
            /* Feedback content */
            <div className="flex flex-col items-center gap-3">
              {feedbackState === 'correct' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12"
                  style={{ color: '#22c55e' }}
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12"
                  style={{ color: '#ef4444' }}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span
                className="text-2xl sm:text-3xl font-medium"
                style={{ fontFamily: 'var(--font-display)', color: feedbackTextColor }}
              >
                {feedbackState === 'correct' ? 'Got it' : "You'll get it next time"}
              </span>
            </div>
          ) : (
            /* Normal question content */
            <>
              <p
                className="text-2xl sm:text-3xl leading-relaxed text-center text-white font-normal max-w-prose"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 420,
                  letterSpacing: '-0.01em',
                }}
              >
                {question}
              </p>

              {/* "See answer" hint at bottom */}
              <span
                className="absolute bottom-6 flex items-center gap-1.5 text-sm tracking-wide"
                style={{ color: '#64748b' }}
              >
                See answer
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3.5 h-3.5 -rotate-180"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </>
          )}
        </div>

        {/* Answer side */}
        <div
          className="flip-card-back transition-colors duration-500 ease-in-out"
          style={
            feedbackState
              ? feedbackBgStyle
              : {
                  background: isDark ? '#1f2937' : '#ffffff',
                  border: isDark ? '1px solid #374151' : '1px solid rgba(229, 231, 235, 0.6)',
                  boxShadow: '0 1px 3px rgba(26,26,26,0.04), 0 4px 12px rgba(26,26,26,0.03)',
                }
          }
        >
          {/* Card counter - top left */}
          <span
            className="absolute top-5 left-6 text-sm font-medium tabular-nums tracking-wide"
            style={{ fontFamily: 'var(--font-display)', color: isDark ? '#6b7280' : '#9ca3af' }}
          >
            {currentIndex + 1}/{total}
          </span>

          {feedbackState ? (
            /* Feedback content on answer side too */
            <div className="flex flex-col items-center gap-3">
              {feedbackState === 'correct' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12"
                  style={{ color: '#22c55e' }}
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12"
                  style={{ color: '#ef4444' }}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span
                className="text-2xl sm:text-3xl font-medium"
                style={{ fontFamily: 'var(--font-display)', color: feedbackTextColor }}
              >
                {feedbackState === 'correct' ? 'Got it' : "You'll get it next time"}
              </span>
            </div>
          ) : (
            /* Normal answer content */
            <>
              <p
                className="text-xl sm:text-2xl leading-relaxed text-center font-normal max-w-prose"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  letterSpacing: '-0.005em',
                  color: isDark ? '#f9fafb' : '#111827',
                }}
              >
                {answer}
              </p>

              {/* "See question" hint at bottom */}
              <span
                className="absolute bottom-6 flex items-center gap-1.5 text-sm tracking-wide"
                style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
              >
                See question
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3.5 h-3.5 -rotate-180"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
