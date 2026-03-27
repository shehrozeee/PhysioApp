import { useState, useEffect, useCallback, useRef } from 'react'
import MiniSearch from 'minisearch'

export interface SearchResult {
  id: string
  title: string
  type: 'flashcard' | 'quiz' | 'mindmap'
  topicSlug: string
  topicTitle: string
  text: string
}

interface SearchDocument {
  id: string
  topicSlug: string
  topicTitle: string
  type: string
  title: string
  text: string
}

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const miniSearchRef = useRef<MiniSearch<SearchDocument> | null>(null)
  const indexLoadedRef = useRef(false)
  const indexLoadingRef = useRef(false)
  const [indexReady, setIndexReady] = useState(false)

  const loadIndex = useCallback(async () => {
    if (indexLoadedRef.current || indexLoadingRef.current) return
    indexLoadingRef.current = true
    setLoading(true)

    try {
      const res = await fetch('/content/search-index.json')
      if (!res.ok) throw new Error('Failed to load search index')
      const documents: SearchDocument[] = await res.json()

      const ms = new MiniSearch<SearchDocument>({
        fields: ['title', 'text'],
        storeFields: ['topicSlug', 'topicTitle', 'type', 'title', 'text'],
        searchOptions: {
          prefix: true,
          fuzzy: 0.2,
        },
      })

      ms.addAll(documents)
      miniSearchRef.current = ms
      indexLoadedRef.current = true
      setIndexReady(true)
    } catch (err) {
      console.error('Failed to load search index:', err)
    } finally {
      setLoading(false)
      indexLoadingRef.current = false
    }
  }, [])

  // Lazy load: trigger index load on first non-empty query
  useEffect(() => {
    if (query.trim().length > 0 && !indexLoadedRef.current) {
      loadIndex()
    }
  }, [query, loadIndex])

  // Run search when query or index readiness changes
  useEffect(() => {
    const ms = miniSearchRef.current
    if (!ms || query.trim().length === 0) {
      setResults([])
      return
    }

    const raw = ms.search(query.trim())
    const mapped: SearchResult[] = raw.slice(0, 20).map((hit) => ({
      id: hit.id as string,
      title: hit.title as string,
      type: hit.type as SearchResult['type'],
      topicSlug: hit.topicSlug as string,
      topicTitle: hit.topicTitle as string,
      text: hit.text as string,
    }))

    setResults(mapped)
  }, [query, indexReady])

  return { query, setQuery, results, loading }
}
