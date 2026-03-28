import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Flashcard } from '@/lib/types'
import { useFlashcardProgress } from '@/hooks/useProgress'
import { shuffle } from '@/lib/utils'
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

  const [currentIndex, setCurrentIndex] = useState(progress.lastCard)
  const [isFlipped, setIsFlipped] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([])

  const displayCards = useMemo(() => {
    return isShuffled ? shuffledCards : cards
  }, [isShuffled, shuffledCards, cards])

  const card = displayCards[currentIndex]
  const total = displayCards.length
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

  const handleToggleShuffle = useCallback(() => {
    setIsShuffled((prev) => {
      if (!prev) {
        setShuffledCards(shuffle(cards))
      }
      return !prev
    })
    setCurrentIndex(0)
    setIsFlipped(false)
    setFeedback(null)
    setIsAdvancing(false)
  }, [cards])

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <p className="flashcard-empty-msg">
          No cards available.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
      width: '100%', maxWidth: '576px', margin: '0 auto', padding: '0 16px 8px',
    }}>
      {/* Shuffle toggle */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className={`shuffle-btn${isShuffled ? ' active' : ''}`}
          onClick={handleToggleShuffle}
          aria-label="Toggle shuffle"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
          Shuffle
        </button>
      </div>

      {/* Thin progress bar spanning full width */}
      <div className="flashcard-progress-track">
        <div
          className="flashcard-progress-fill"
          style={{
            width: `${((currentIndex + 1) / total) * 100}%`,
          }}
        />
      </div>

      {/* Card wrapper */}
      <div style={{ position: 'relative', width: '100%' }} className="card-enter">
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
      <div className="mark-buttons">
        <button
          onClick={() => handleMark('wrong')}
          disabled={isAdvancing}
          aria-label="Mark as wrong"
          className="btn-wrong"
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
          className="btn-correct"
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
          className="flashcard-reset-btn"
        >
          Reset progress
        </button>
      )}
    </div>
  )
}
