type OptionState = 'default' | 'selected' | 'correct' | 'wrong'

interface OptionButtonProps {
  letter: string
  text: string
  state: OptionState
  onClick: () => void
  disabled?: boolean
}

export default function OptionButton({ letter, text, state, onClick, disabled }: OptionButtonProps) {
  const stateClass = state !== 'default' ? state : ''

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`quiz-option ${stateClass}`}
    >
      {/* Letter circle */}
      <span className="letter">
        {letter}
      </span>

      {/* Option text */}
      <span style={{ flex: 1 }}>
        {text}
      </span>

      {/* Trailing icon for correct/wrong states */}
      {state === 'correct' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{ marginLeft: 'auto', width: '20px', height: '20px', flexShrink: 0, color: '#22c55e' }}
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
          style={{ marginLeft: 'auto', width: '20px', height: '20px', flexShrink: 0, color: '#ef4444' }}
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
