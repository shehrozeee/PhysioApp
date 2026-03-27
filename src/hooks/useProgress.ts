import { useState, useCallback } from 'react'
import type { FlashcardProgress, QuizProgress } from '@/lib/types'

function loadProgress<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function saveProgress<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function useFlashcardProgress(slug: string) {
  const key = `physio-progress-${slug}-flashcards`
  const [progress, setProgress] = useState<FlashcardProgress>(() =>
    loadProgress(key, { correct: [], wrong: [], lastCard: 0 })
  )

  const markCorrect = useCallback((cardId: number) => {
    setProgress(prev => {
      const next = {
        ...prev,
        correct: [...prev.correct.filter(id => id !== cardId), cardId],
        wrong: prev.wrong.filter(id => id !== cardId),
      }
      saveProgress(key, next)
      return next
    })
  }, [key])

  const markWrong = useCallback((cardId: number) => {
    setProgress(prev => {
      const next = {
        ...prev,
        wrong: [...prev.wrong.filter(id => id !== cardId), cardId],
        correct: prev.correct.filter(id => id !== cardId),
      }
      saveProgress(key, next)
      return next
    })
  }, [key])

  const setLastCard = useCallback((index: number) => {
    setProgress(prev => {
      const next = { ...prev, lastCard: index }
      saveProgress(key, next)
      return next
    })
  }, [key])

  const reset = useCallback(() => {
    const next = { correct: [], wrong: [], lastCard: 0 }
    setProgress(next)
    saveProgress(key, next)
  }, [key])

  return { progress, markCorrect, markWrong, setLastCard, reset }
}

export function useQuizProgress(slug: string) {
  const key = `physio-progress-${slug}-quiz`
  const [progress, setProgress] = useState<QuizProgress>(() =>
    loadProgress(key, { bestScore: 0, attempts: 0, lastWrong: [] })
  )

  const recordAttempt = useCallback((score: number, wrongIds: number[]) => {
    setProgress(prev => {
      const next = {
        bestScore: Math.max(prev.bestScore, score),
        attempts: prev.attempts + 1,
        lastWrong: wrongIds,
      }
      saveProgress(key, next)
      return next
    })
  }, [key])

  return { progress, recordAttempt }
}
