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
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
      {/* Main controls row */}
      <div className="flex items-center justify-center gap-8 w-full">
        {/* Previous button */}
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          aria-label="Previous card"
          className="flex items-center justify-center w-12 h-12 rounded-full
            border border-gray-200 text-gray-500 bg-white
            transition-all duration-200
            hover:border-gray-300 hover:text-gray-700 hover:shadow-sm hover:-translate-y-0.5
            disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:shadow-none disabled:hover:translate-y-0
            dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400
            dark:hover:border-slate-500 dark:hover:text-slate-200
            dark:disabled:hover:border-slate-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Score display */}
        <div className="flex items-center gap-8">
          {/* Wrong count */}
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-50 dark:bg-red-950/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-red-500"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </span>
            <span
              className="text-lg font-semibold text-red-500 tabular-nums"
              style={{ fontFamily: 'var(--font-display)', minWidth: '1.25rem' }}
            >
              {wrongCount}
            </span>
          </div>

          {/* Correct count */}
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-50 dark:bg-green-950/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-green-600"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span
              className="text-lg font-semibold text-green-600 tabular-nums"
              style={{ fontFamily: 'var(--font-display)', minWidth: '1.25rem' }}
            >
              {correctCount}
            </span>
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          aria-label="Next card"
          className="flex items-center justify-center w-12 h-12 rounded-full
            border border-gray-200 text-gray-500 bg-white
            transition-all duration-200
            hover:border-gray-300 hover:text-gray-700 hover:shadow-sm hover:-translate-y-0.5
            disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:shadow-none disabled:hover:translate-y-0
            dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400
            dark:hover:border-slate-500 dark:hover:text-slate-200
            dark:disabled:hover:border-slate-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
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
