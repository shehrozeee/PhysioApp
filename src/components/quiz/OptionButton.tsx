type OptionState = 'default' | 'selected' | 'correct' | 'wrong'

interface OptionButtonProps {
  letter: string
  text: string
  state: OptionState
  onClick: () => void
  disabled?: boolean
}

const stateStyles: Record<OptionState, string> = {
  default:
    'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/60 dark:hover:bg-gray-700',
  selected:
    'bg-primary-50 ring-2 ring-primary-500 dark:bg-primary-900/30 dark:ring-primary-400',
  correct:
    'bg-green-50 ring-2 ring-green-500 dark:bg-green-900/30 dark:ring-green-400',
  wrong:
    'bg-red-50 ring-2 ring-red-400 dark:bg-red-900/30 dark:ring-red-400',
}

const letterStyles: Record<OptionState, string> = {
  default:
    'text-gray-500 dark:text-gray-400',
  selected:
    'text-primary-600 dark:text-primary-400 font-bold',
  correct:
    'text-green-600 dark:text-green-400 font-bold',
  wrong:
    'text-red-500 dark:text-red-400 font-bold',
}

const textStyles: Record<OptionState, string> = {
  default:
    'text-gray-700 dark:text-gray-200',
  selected:
    'text-primary-900 dark:text-primary-100',
  correct:
    'text-green-900 dark:text-green-100',
  wrong:
    'text-red-900 dark:text-red-100',
}

export default function OptionButton({ letter, text, state, onClick, disabled }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full items-center gap-4 rounded-xl
                  transition-all duration-200 text-left
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
                  disabled:cursor-not-allowed
                  ${stateStyles[state]}`}
      style={{ padding: '16px 20px', minHeight: '52px' }}
    >
      {/* Letter prefix - inline "A." style like NotebookLM */}
      <span
        className={`shrink-0 font-[family-name:var(--font-display)] text-base font-semibold
                    transition-all duration-200 ${letterStyles[state]}`}
      >
        {letter}.
      </span>

      {/* Option text */}
      <span className={`font-[family-name:var(--font-body)] text-[15px] sm:text-base leading-snug transition-colors duration-200 ${textStyles[state]}`}>
        {text}
      </span>

      {/* Trailing icon for correct/wrong states */}
      {state === 'correct' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="ml-auto h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {state === 'wrong' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="ml-auto h-5 w-5 shrink-0 text-red-400 dark:text-red-400"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  )
}
