# PhysioApp

## Project Overview
Static PWA for physiology students. Flashcards, quizzes, and mind maps from NotebookLM exports. Mobile-first, Gen Z audience.

## Tech Stack
- React 19 + Vite 6 + TypeScript
- Tailwind CSS v4 (CAUTION: arbitrary shadow values with commas break the parser)
- Markmap (mind maps), MiniSearch (search), vite-plugin-pwa (offline)
- Deployed to Cloudflare Pages

## Commands
- `npm run dev` — start dev server
- `npm run build` — build for production (includes search index generation)
- `npx tsx scripts/import-csv.ts <csv> <topic-slug>` — import flashcard CSV
- `npx tsx scripts/build-search-index.ts` — rebuild search index

## Architecture
- Content: static JSON in `public/content/{topic-slug}/` (flashcards.json, quiz.json, mindmap.json)
- Manifest: `public/content/topics.json`
- Pages: Home, TopicPage, FlashcardsPage, QuizPage, MindMapPage
- All styling via CSS classes in `src/index.css` — NOT inline styles
- Dark mode: CSS `.dark` class on `<html>`, styles in index.css with `.dark .class-name` selectors

## Critical Rules
1. Tailwind v4: NEVER use arbitrary shadow values with commas (e.g., `shadow-[0_2px_8px,0_0_0_1px]`). Use CSS classes or inline `style={{ boxShadow }}` instead.
2. All reusable styles go in `src/index.css` as CSS classes with `.dark` variants
3. No emoji icons — use inline SVG with `stroke="currentColor"`
4. Mobile-first: all interactive elements min 48px touch target
5. All content data loads lazily via fetch
6. Student progress persists in localStorage

## Deploy
GitHub: shehrozeee/PhysioApp
Cloudflare Pages: connect to repo, build command `npm run build`, output `dist`
