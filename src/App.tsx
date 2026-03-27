import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Home } from '@/pages/Home'
import { TopicPage } from '@/pages/TopicPage'
import { NotFound } from '@/pages/NotFound'

const FlashcardsPage = lazy(() => import('@/pages/FlashcardsPage').then(m => ({ default: m.FlashcardsPage })))
const QuizPage = lazy(() => import('@/pages/QuizPage').then(m => ({ default: m.QuizPage })))
const MindMapPage = lazy(() => import('@/pages/MindMapPage').then(m => ({ default: m.MindMapPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/topic/:slug" element={<TopicPage />} />
          <Route path="/topic/:slug/flashcards" element={<Suspense fallback={<PageLoader />}><FlashcardsPage /></Suspense>} />
          <Route path="/topic/:slug/quiz" element={<Suspense fallback={<PageLoader />}><QuizPage /></Suspense>} />
          <Route path="/topic/:slug/mindmap" element={<Suspense fallback={<PageLoader />}><MindMapPage /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
