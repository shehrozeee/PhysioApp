export interface Topic {
  slug: string
  title: string
  chapter: string
  description: string
  content: {
    flashcards?: { count: number }
    quiz?: { count: number }
    mindmap?: boolean
  }
}

export interface TopicsManifest {
  topics: Topic[]
}

export interface Flashcard {
  id: number
  question: string
  answer: string
}

export interface FlashcardDeck {
  cards: Flashcard[]
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  hint?: string
}

export interface Quiz {
  questions: QuizQuestion[]
}

export interface MindMapNode {
  title: string
  children?: MindMapNode[]
}

export interface FlashcardProgress {
  correct: number[]
  wrong: number[]
  lastCard: number
}

export interface QuizProgress {
  bestScore: number
  attempts: number
  lastWrong: number[]
}
