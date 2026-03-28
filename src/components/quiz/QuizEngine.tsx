import { useState, useEffect, useCallback, useMemo } from 'react'
import type { QuizQuestion } from '@/lib/types'
import { useQuizProgress } from '@/hooks/useProgress'
import { shuffle } from '@/lib/utils'
import ModeSelect from '@/components/quiz/ModeSelect'
import QuestionCard from '@/components/quiz/QuestionCard'
import OptionButton from '@/components/quiz/OptionButton'
import HintAccordion from '@/components/quiz/HintAccordion'
import ResultsSummary from '@/components/quiz/ResultsSummary'

type Mode = 'practice' | 'test'
type Phase = 'modeSelect' | 'inProgress' | 'results'
type OptionState = 'default' | 'selected' | 'correct' | 'wrong'

const LETTERS = ['A', 'B', 'C', 'D']

interface QuizEngineProps {
  questions: QuizQuestion[]
  slug: string
}

export default function QuizEngine({ questions, slug }: QuizEngineProps) {
  const { recordAttempt } = useQuizProgress(slug)

  const [phase, setPhase] = useState<Phase>('modeSelect')
  const [mode, setMode] = useState<Mode>('practice')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null))
  const [revealed, setRevealed] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([])

  const displayQuestions = useMemo(() => {
    return isShuffled ? shuffledQuestions : questions
  }, [isShuffled, shuffledQuestions, questions])

  const question = displayQuestions[currentIndex]
  const isLast = currentIndex === displayQuestions.length - 1

  // Reset state when restarting
  const resetQuiz = useCallback(() => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setAnswers(questions.map(() => null))
    setRevealed(false)
    setIsShuffled(false)
    setShuffledQuestions([])
    setPhase('modeSelect')
  }, [questions])

  const handleModeSelect = useCallback((m: Mode) => {
    if (isShuffled) {
      setShuffledQuestions(shuffle(questions))
    }
    setMode(m)
    setCurrentIndex(0)
    setSelectedOption(null)
    setAnswers(questions.map(() => null))
    setRevealed(false)
    setPhase('inProgress')
  }, [questions, isShuffled])

  // Select an option
  const handleSelect = useCallback((optionIndex: number) => {
    if (revealed) return
    setSelectedOption(optionIndex)

    setAnswers(prev => {
      const next = [...prev]
      next[currentIndex] = optionIndex
      return next
    })

    if (mode === 'practice') {
      setRevealed(true)
    }
  }, [revealed, currentIndex, mode])

  // Go to next question (or finish)
  const handleNext = useCallback(() => {
    if (mode === 'test' && selectedOption === null) return

    if (isLast) {
      // Finish quiz
      const finalAnswers = [...answers]
      finalAnswers[currentIndex] = selectedOption
      const wrongIds = displayQuestions
        .filter((q, i) => finalAnswers[i] !== q.correct)
        .map(q => q.id)
      const score = displayQuestions.length - wrongIds.length
      recordAttempt(score, wrongIds)
      setAnswers(finalAnswers)
      setPhase('results')
    } else {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setRevealed(false)
    }
  }, [mode, selectedOption, isLast, answers, currentIndex, displayQuestions, recordAttempt])

  // Go to previous question
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setSelectedOption(answers[currentIndex - 1])
      setRevealed(false)
    }
  }, [currentIndex, answers])

  // Keyboard navigation
  useEffect(() => {
    if (phase !== 'inProgress') return

    function handleKey(e: KeyboardEvent) {
      const key = e.key.toUpperCase()

      // 1-4 or A-D to select option
      if (!revealed || mode === 'test') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key) - 1
          if (idx < question.options.length) handleSelect(idx)
          return
        }
        if (['A', 'B', 'C', 'D'].includes(key)) {
          const idx = LETTERS.indexOf(key)
          if (idx < question.options.length) handleSelect(idx)
          return
        }
      }

      // Enter to confirm/next
      if (e.key === 'Enter') {
        if (mode === 'practice' && revealed) {
          handleNext()
        } else if (mode === 'test' && selectedOption !== null) {
          handleNext()
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, mode, revealed, selectedOption, question, handleSelect, handleNext])

  // Compute option states for display
  function getOptionState(optionIndex: number): OptionState {
    if (mode === 'practice' && revealed) {
      if (optionIndex === question.correct) return 'correct'
      if (optionIndex === selectedOption && optionIndex !== question.correct) return 'wrong'
      return 'default'
    }
    if (optionIndex === selectedOption) return 'selected'
    return 'default'
  }

  // Build wrong-answers data for results
  function buildWrongQuestions() {
    return displayQuestions
      .map((q, i) => ({ q, answer: answers[i] }))
      .filter(({ q, answer }) => answer !== q.correct)
      .map(({ q, answer }) => ({
        question: q.question,
        yourAnswer: answer !== null && answer !== undefined ? q.options[answer] : 'No answer',
        correctAnswer: q.options[q.correct],
      }))
  }

  // --- RENDER ---

  if (phase === 'modeSelect') {
    return (
      <ModeSelect
        onSelect={handleModeSelect}
        isShuffled={isShuffled}
        onToggleShuffle={() => setIsShuffled((prev) => !prev)}
      />
    )
  }

  if (phase === 'results') {
    const wrongIds = displayQuestions
      .filter((q, i) => answers[i] !== q.correct)
      .map(q => q.id)
    const score = displayQuestions.length - wrongIds.length

    return (
      <ResultsSummary
        score={score}
        total={displayQuestions.length}
        wrongQuestions={buildWrongQuestions()}
        onRetry={resetQuiz}
        onBack={() => window.history.back()}
      />
    )
  }

  // In-progress phase
  const canGoNext =
    mode === 'practice' ? revealed : selectedOption !== null
  const nextLabel = isLast ? 'Finish' : 'Next'

  return (
    <div className="mx-auto w-full card-enter">
      <div className="card-container">
        {/* Question */}
        <QuestionCard
          question={question.question}
          current={currentIndex + 1}
          total={displayQuestions.length}
        />

        {/* Options */}
        <div className="quiz-options">
          {question.options.map((opt, i) => (
            <OptionButton
              key={i}
              letter={LETTERS[i]}
              text={opt}
              state={getOptionState(i)}
              onClick={() => handleSelect(i)}
              disabled={mode === 'practice' && revealed}
            />
          ))}
        </div>

        {/* Hint accordion (practice mode only, when hint exists) */}
        {mode === 'practice' && question.hint && (
          <HintAccordion hint={question.hint} />
        )}

        {/* Feedback message (practice mode, after reveal) */}
        {mode === 'practice' && revealed && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            {selectedOption === question.correct ? (
              <p className="quiz-feedback-correct">
                Correct!
              </p>
            ) : (
              <p className="quiz-feedback-wrong">
                Incorrect. The correct answer is {LETTERS[question.correct]}.
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="quiz-nav">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="btn-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" />
            </svg>
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="btn-primary"
          >
            {nextLabel}
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
