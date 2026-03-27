import { useState, useEffect, useCallback } from 'react'
import type { Flashcard } from '@/lib/types'
import { useFlashcardProgress } from '@/hooks/useProgress'
import { useDarkMode } from '@/hooks/useDarkMode'
import FlashcardCard from '@/components/flashcards/FlashcardCard'
import ScoreBar from '@/components/flashcards/ScoreBar'

interface FlashcardDeckProps {
  cards: Flashcard[]
  slug: string
}

type Feedback = 'correct' | 'wrong' | null

export default function FlashcardDeck({ cards, slug }: FlashcardDeckProps) {
  const { progress, markCorrect, markWrong, setLastCard, reset } =
    useFlashcardProgress(slug)
  const { isDark } = useDarkMode()

  const [currentIndex, setCurrentIndex] = useState(progress.lastCard)
  const [isFlipped, setIsFlipped] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [isAdvancing, setIsAdvancing] = useState(false)

  const card = cards[currentIndex]
  const total = cards.length
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < total - 1

  // Persist the current card index
  useEffect(() => {
    setLastCard(currentIndex)
  }, [currentIndex, setLastCard])

  const goToNext = useCallback(() => {
    if (hasNext) {
      setIsFlipped(false)
      setCurrentIndex((i) => i + 1)
    }
  }, [hasNext])

  const goToPrev = useCallback(() => {
    if (hasPrev) {
      setIsFlipped(false)
      setCurrentIndex((i) => i - 1)
    }
  }, [hasPrev])

  const flip = useCallback(() => {
    if (!isAdvancing) {
      setIsFlipped((f) => !f)
    }
  }, [isAdvancing])

  const handleMark = useCallback(
    (type: 'correct' | 'wrong') => {
      if (isAdvancing || !card) return

      setIsAdvancing(true)

      if (type === 'correct') {
        markCorrect(card.id)
      } else {
        markWrong(card.id)
      }

      setFeedback(type)

      // Auto-advance after showing feedback
      setTimeout(() => {
        setFeedback(null)
        if (hasNext) {
          setIsFlipped(false)
          setCurrentIndex((i) => i + 1)
        }
        setIsAdvancing(false)
      }, 1200)
    },
    [card, hasNext, isAdvancing, markCorrect, markWrong]
  )

  const handleReset = useCallback(() => {
    reset()
    setCurrentIndex(0)
    setIsFlipped(false)
    setFeedback(null)
    setIsAdvancing(false)
  }, [reset])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()
          flip()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNext()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goToPrev()
          break
        case 'Enter':
          e.preventDefault()
          handleMark('correct')
          break
        case 'Backspace':
          e.preventDefault()
          handleMark('wrong')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flip, goToNext, goToPrev, handleMark])

  if (!card) {
    return (
      <div className="flex items-center justify-center h-64">
        <p
          className="text-gray-500 dark:text-slate-400"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          No cards available.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xl mx-auto px-4 py-2">
      {/* Thin progress bar spanning full width */}
      <div className="w-full h-[2px] bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((currentIndex + 1) / total) * 100}%`,
            background: 'linear-gradient(90deg, #6366f1, #818cf8)',
          }}
        />
      </div>

      {/* Card wrapper */}
      <div className="relative w-full card-enter">
        <FlashcardCard
          key={card.id}
          question={card.question}
          answer={card.answer}
          isFlipped={isFlipped}
          onFlip={flip}
          currentIndex={currentIndex}
          total={total}
          feedbackState={feedback}
        />
      </div>

      {/* Mark correct/wrong buttons */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        justifyContent: 'center', width: '100%', marginTop: '8px',
      }}>
        <button
          onClick={() => handleMark('wrong')}
          disabled={isAdvancing}
          aria-label="Mark as wrong"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '14px 28px', borderRadius: '50px',
            minHeight: '52px', flex: 1, maxWidth: '180px',
            fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-display)',
            color: isDark ? '#f87171' : '#ef4444',
            background: isDark ? 'rgba(127,29,29,0.15)' : '#fef2f2',
            border: isDark ? '1px solid rgba(239,68,68,0.25)' : '1px solid #fecaca',
            cursor: isAdvancing ? 'not-allowed' : 'pointer',
            opacity: isAdvancing ? 0.3 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
          Missed it
        </button>

        <button
          onClick={() => handleMark('correct')}
          disabled={isAdvancing}
          aria-label="Mark as correct"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '14px 28px', borderRadius: '50px',
            minHeight: '52px', flex: 1, maxWidth: '180px',
            fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-display)',
            color: isDark ? '#4ade80' : '#16a34a',
            background: isDark ? 'rgba(5,46,22,0.25)' : '#f0fdf4',
            border: isDark ? '1px solid rgba(34,197,94,0.25)' : '1px solid #bbf7d0',
            cursor: isAdvancing ? 'not-allowed' : 'pointer',
            opacity: isAdvancing ? 0.3 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
          Got it
        </button>
      </div>

      {/* Navigation + score bar */}
      <ScoreBar
        correctCount={progress.correct.length}
        wrongCount={progress.wrong.length}
        onPrev={goToPrev}
        onNext={goToNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />

      {/* Reset button */}
      {(progress.correct.length > 0 || progress.wrong.length > 0) && (
        <button
          onClick={handleReset}
          className="text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300
            transition-colors duration-200 mt-2 mb-4"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Reset progress
        </button>
      )}
    </div>
  )
}
