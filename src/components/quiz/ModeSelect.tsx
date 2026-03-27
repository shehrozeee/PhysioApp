import { useDarkMode } from '@/hooks/useDarkMode'

interface ModeSelectProps {
  onSelect: (mode: 'practice' | 'test') => void
}

export default function ModeSelect({ onSelect }: ModeSelectProps) {
  const { isDark } = useDarkMode()

  return (
    <div className="mx-auto w-full card-enter">
      <div
        className="rounded-3xl"
        style={{
          padding: 'clamp(32px, 5vw, 52px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
          background: isDark ? '#1f2937' : 'white',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-tight"
            style={{ color: isDark ? '#f3f4f6' : '#111827' }}
          >
            Choose Your Mode
          </h2>
          <p
            className="mt-3 font-[family-name:var(--font-body)] text-base"
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            How would you like to study?
          </p>
        </div>

        {/* Mode cards */}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Practice Mode Card */}
          <button
            onClick={() => onSelect('practice')}
            className="group relative flex flex-col items-center gap-5 rounded-2xl p-8 sm:p-9
                       transition-all duration-300 ease-out
                       hover:-translate-y-1.5 hover:shadow-lg
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            style={{
              background: isDark ? 'rgba(55, 65, 81, 0.5)' : 'white',
              border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
            }}
          >
            {/* Icon in soft circle */}
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl
                          transition-all duration-300 group-hover:scale-110"
              style={{
                background: isDark ? 'rgba(49, 46, 129, 0.3)' : '#eef2ff',
                color: isDark ? '#818cf8' : '#4f46e5',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
              </svg>
            </div>

            <div className="text-center">
              <h3
                className="font-[family-name:var(--font-display)] text-lg font-semibold"
                style={{ color: isDark ? '#f3f4f6' : '#111827' }}
              >
                Practice Mode
              </h3>
              <p
                className="mt-2 font-[family-name:var(--font-body)] text-sm leading-relaxed"
                style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
              >
                Get instant feedback after each answer
              </p>
            </div>

            {/* Subtle bottom accent line on hover */}
            <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>

          {/* Test Mode Card */}
          <button
            onClick={() => onSelect('test')}
            className="group relative flex flex-col items-center gap-5 rounded-2xl p-8 sm:p-9
                       transition-all duration-300 ease-out
                       hover:-translate-y-1.5 hover:shadow-lg
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            style={{
              background: isDark ? 'rgba(55, 65, 81, 0.5)' : 'white',
              border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
            }}
          >
            {/* Icon in soft circle */}
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl
                          transition-all duration-300 group-hover:scale-110"
              style={{
                background: isDark ? 'rgba(120, 53, 15, 0.3)' : '#fffbeb',
                color: isDark ? '#fbbf24' : '#d97706',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="m9 14 2 2 4-4" />
              </svg>
            </div>

            <div className="text-center">
              <h3
                className="font-[family-name:var(--font-display)] text-lg font-semibold"
                style={{ color: isDark ? '#f3f4f6' : '#111827' }}
              >
                Test Mode
              </h3>
              <p
                className="mt-2 font-[family-name:var(--font-body)] text-sm leading-relaxed"
                style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
              >
                See your score at the end
              </p>
            </div>

            {/* Subtle bottom accent line on hover */}
            <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  )
}
