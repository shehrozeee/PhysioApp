interface QuestionCardProps {
  question: string
  current: number
  total: number
}

export default function QuestionCard({ question, current, total }: QuestionCardProps) {
  const progressPct = (current / total) * 100

  return (
    <div className="w-full">
      {/* Progress row */}
      <div className="flex items-center justify-between mb-8">
        <p className="font-[family-name:var(--font-body)] text-sm font-medium text-gray-400 dark:text-gray-500 tracking-wide">
          <span className="text-gray-600 dark:text-gray-300">{current}</span>
          {' '}/{' '}
          {total}
        </p>
        {/* Mini progress bar */}
        <div className="flex-1 mx-4 h-1 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden max-w-[200px]">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question text */}
      <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold leading-relaxed text-gray-900 dark:text-gray-100 tracking-tight">
        {question}
      </h3>
    </div>
  )
}
