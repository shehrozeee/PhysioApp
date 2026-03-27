import { useRef, useEffect, useCallback } from 'react'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'
import type { MindMapNode } from '@/lib/types'

interface MindMapViewerProps {
  data: MindMapNode
  className?: string
}

function nodeToMarkdown(node: MindMapNode, depth: number = 1): string {
  const prefix = '#'.repeat(depth)
  let md = `${prefix} ${node.title}\n`
  if (node.children) {
    for (const child of node.children) {
      md += nodeToMarkdown(child, depth + 1)
    }
  }
  return md
}

const transformer = new Transformer()

export function MindMapViewer({ data, className = '' }: MindMapViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const mmRef = useRef<Markmap | null>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const md = nodeToMarkdown(data)
    const { root } = transformer.transform(md)

    // Clear any previous render
    svg.innerHTML = ''

    const mm = Markmap.create(svg, {
      initialExpandLevel: 2,
    }, root)
    mmRef.current = mm

    // Fit after initial render (double rAF to ensure layout is complete)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mm.fit()
      })
    })

    return () => {
      mmRef.current = null
      svg.innerHTML = ''
    }
  }, [data])

  const handleZoomIn = useCallback(() => {
    const mm = mmRef.current
    if (!mm) return
    mm.rescale(1.25)
  }, [])

  const handleZoomOut = useCallback(() => {
    const mm = mmRef.current
    if (!mm) return
    mm.rescale(0.8)
  }, [])

  const handleFit = useCallback(() => {
    const mm = mmRef.current
    if (!mm) return
    mm.fit()
  }, [])

  return (
    <div className={`relative h-[calc(100dvh-8rem)] w-full ${className}`}>
      {/* SVG canvas for markmap */}
      <svg
        ref={svgRef}
        className="mindmap-svg h-full w-full"
      />

      {/* Floating zoom toolbar */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-1 rounded-xl bg-white/90 p-1 shadow-lg ring-1 ring-gray-200 backdrop-blur dark:bg-gray-800/90 dark:ring-gray-700">
        <button
          onClick={handleZoomIn}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Zoom in"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Zoom out"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div className="mx-1 border-t border-gray-200 dark:border-gray-700" />
        <button
          onClick={handleFit}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Fit to view"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7" />
            <path d="M3 21l7-7" />
          </svg>
        </button>
      </div>

      {/* Dark mode style overrides for markmap */}
      <style>{`
        .dark .mindmap-svg {
          --markmap-text-color: #f3f4f6;
        }
        .dark .mindmap-svg text {
          fill: #f3f4f6;
        }
        .dark .mindmap-svg path {
          stroke: #6b7280;
        }
        .dark .mindmap-svg circle {
          fill: #374151;
          stroke: #6b7280;
        }
        .mindmap-svg foreignObject div {
          font-family: 'Source Sans 3', sans-serif;
        }
      `}</style>
    </div>
  )
}
