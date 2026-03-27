import { useState, useEffect } from 'react'
import type { TopicsManifest, FlashcardDeck, Quiz, MindMapNode } from '@/lib/types'

const cache = new Map<string, unknown>()

async function fetchJson<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  const data = await res.json()
  cache.set(url, data)
  return data as T
}

export function useTopics() {
  const [topics, setTopics] = useState<TopicsManifest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJson<TopicsManifest>('/content/topics.json')
      .then(setTopics)
      .finally(() => setLoading(false))
  }, [])

  return { topics, loading }
}

export function useFlashcards(slug: string) {
  const [deck, setDeck] = useState<FlashcardDeck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetchJson<FlashcardDeck>(`/content/${slug}/flashcards.json`)
      .then(setDeck)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  return { deck, loading, error }
}

export function useQuiz(slug: string) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetchJson<Quiz>(`/content/${slug}/quiz.json`)
      .then(setQuiz)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  return { quiz, loading, error }
}

export function useMindMap(slug: string) {
  const [mindmap, setMindmap] = useState<MindMapNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetchJson<MindMapNode>(`/content/${slug}/mindmap.json`)
      .then(setMindmap)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  return { mindmap, loading, error }
}
