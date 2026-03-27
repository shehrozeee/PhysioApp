import fs from 'fs'
import path from 'path'

interface SearchDocument {
  id: string
  topicSlug: string
  topicTitle: string
  type: 'flashcard' | 'quiz' | 'mindmap'
  title: string
  text: string
}

interface Flashcard {
  id: number
  question: string
  answer: string
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  hint?: string
}

interface MindMapNode {
  title: string
  children?: MindMapNode[]
}

interface TopicsManifest {
  topics: Array<{
    slug: string
    title: string
    chapter: string
    description: string
    content: {
      flashcards?: { count: number }
      quiz?: { count: number }
      mindmap?: boolean
    }
  }>
}

const contentDir = path.resolve('public/content')

let mindmapNodeCounter = 0

function flattenMindMap(
  node: MindMapNode,
  topicSlug: string,
  topicTitle: string,
  docs: SearchDocument[],
  parentPath: string = ''
): void {
  const currentPath = parentPath ? `${parentPath} > ${node.title}` : node.title
  const nodeId = mindmapNodeCounter++

  docs.push({
    id: `${topicSlug}-mm-${nodeId}`,
    topicSlug,
    topicTitle,
    type: 'mindmap',
    title: node.title,
    text: currentPath,
  })

  if (node.children) {
    for (const child of node.children) {
      flattenMindMap(child, topicSlug, topicTitle, docs, currentPath)
    }
  }
}

function buildIndex(): void {
  const manifestPath = path.join(contentDir, 'topics.json')
  if (!fs.existsSync(manifestPath)) {
    console.warn('No topics.json found, writing empty search index.')
    fs.writeFileSync(
      path.join(contentDir, 'search-index.json'),
      JSON.stringify([])
    )
    return
  }

  const manifest: TopicsManifest = JSON.parse(
    fs.readFileSync(manifestPath, 'utf-8')
  )

  const documents: SearchDocument[] = []

  for (const topic of manifest.topics) {
    const topicDir = path.join(contentDir, topic.slug)
    if (!fs.existsSync(topicDir)) continue

    // Flashcards
    const flashcardsPath = path.join(topicDir, 'flashcards.json')
    if (fs.existsSync(flashcardsPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(flashcardsPath, 'utf-8'))
        const cards: Flashcard[] = data.cards || data
        for (const card of cards) {
          documents.push({
            id: `${topic.slug}-fc-${card.id}`,
            topicSlug: topic.slug,
            topicTitle: topic.title,
            type: 'flashcard',
            title: card.question,
            text: `${card.question} ${card.answer}`,
          })
        }
      } catch (err) {
        console.warn(`Failed to parse ${flashcardsPath}:`, err)
      }
    }

    // Quiz
    const quizPath = path.join(topicDir, 'quiz.json')
    if (fs.existsSync(quizPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(quizPath, 'utf-8'))
        const questions: QuizQuestion[] = data.questions || data
        for (const q of questions) {
          documents.push({
            id: `${topic.slug}-qz-${q.id}`,
            topicSlug: topic.slug,
            topicTitle: topic.title,
            type: 'quiz',
            title: q.question,
            text: `${q.question} ${q.options.join(' ')}${q.hint ? ' ' + q.hint : ''}`,
          })
        }
      } catch (err) {
        console.warn(`Failed to parse ${quizPath}:`, err)
      }
    }

    // Mind map
    const mindmapPath = path.join(topicDir, 'mindmap.json')
    if (fs.existsSync(mindmapPath)) {
      try {
        const root: MindMapNode = JSON.parse(
          fs.readFileSync(mindmapPath, 'utf-8')
        )
        flattenMindMap(root, topic.slug, topic.title, documents)
      } catch (err) {
        console.warn(`Failed to parse ${mindmapPath}:`, err)
      }
    }
  }

  const outputPath = path.join(contentDir, 'search-index.json')
  fs.writeFileSync(outputPath, JSON.stringify(documents, null, 2))
  console.log(
    `Search index built: ${documents.length} documents from ${manifest.topics.length} topics -> ${outputPath}`
  )
}

buildIndex()
