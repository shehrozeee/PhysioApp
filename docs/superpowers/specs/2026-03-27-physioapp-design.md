# PhysioApp Design Spec

## Context

The Head of Department of Physiology creates learning content (flashcards, quizzes, mind maps) using Google NotebookLM but has no way to share it with students. PhysioApp is a static web app that takes this exported content and presents it as an interactive study tool. Content is managed by the developer (son) using Claude Code and published as new app versions to Cloudflare Pages. No backend, no accounts — just a fast, offline-capable PWA that students open on their phones or that the professor projects in class.

## Tech Stack

- **Framework:** React 19 + Vite 6 + React Router v7
- **Styling:** Tailwind CSS v4 (dark mode via `class` strategy)
- **Mind Maps:** Markmap (D3-based interactive SVG mind maps)
- **Search:** MiniSearch (~6KB) with build-time index generation
- **PWA:** vite-plugin-pwa with Workbox (precache shell, cache-first content)
- **Language:** TypeScript
- **Deploy:** Cloudflare Pages (static `dist/` folder)

## Users

- **Students** — primary users, access on mobile phones, tablets, and laptops
- **Professor** — uses on desktop/projector in class, needs dead-simple navigation
- **Developer** — manages content pipeline and app updates via Claude Code

## Navigation & URL Structure

```
/                                    → Home (topic grid + search)
/topic/:slug                         → Topic landing (pick content type)
/topic/:slug/flashcards              → Flashcard deck
/topic/:slug/quiz                    → Quiz (mode select → questions)
/topic/:slug/mindmap                 → Mind map viewer
```

Home page shows a responsive grid of topic cards. Each card shows topic name, chapter, and badges for available content types (flashcards, quiz, mind map) with counts.

## Data Architecture

### Content Directory Structure

```
public/content/
  topics.json                        ← manifest (all topics, metadata)
  search-index.json                  ← pre-built MiniSearch index
  cns-cerebellum/
    flashcards.json
    quiz.json
    mindmap.json
  cardiovascular-1/
    flashcards.json
    quiz.json
    mindmap.json
  ...
```

### topics.json (Manifest)

```json
{
  "topics": [
    {
      "slug": "cns-cerebellum",
      "title": "Cerebellum",
      "chapter": "CNS",
      "description": "Structure, function, and clinical signs of cerebellar lesions",
      "content": {
        "flashcards": { "count": 65 },
        "quiz": { "count": 10 },
        "mindmap": true
      }
    }
  ]
}
```

### flashcards.json

```json
{
  "cards": [
    {
      "id": 1,
      "question": "In which cranial fossa is the cerebellum located?",
      "answer": "Posterior cranial fossa."
    }
  ]
}
```

### quiz.json

```json
{
  "questions": [
    {
      "id": 1,
      "question": "In which specific anatomical location is the cerebellum situated within the skull?",
      "options": ["Hypophyseal fossa", "Middle cranial fossa", "Anterior cranial fossa", "Posterior cranial fossa"],
      "correct": 3,
      "hint": "Think about which part of the skull houses structures of the hindbrain."
    }
  ]
}
```

### mindmap.json

```json
{
  "title": "Cerebellum",
  "children": [
    {
      "title": "Anatomy",
      "children": [
        { "title": "Anterior Lobe" },
        { "title": "Posterior Lobe" },
        { "title": "Flocculonodular Lobe" }
      ]
    },
    {
      "title": "Deep Nuclei",
      "children": [
        { "title": "Fastigius" },
        { "title": "Globose" },
        { "title": "Emboliform" },
        { "title": "Dentate" }
      ]
    }
  ]
}
```

### Data Loading Strategy

- `topics.json` loads on app startup (~2-5KB for 30 topics)
- `search-index.json` loads lazily on first search invocation
- Individual topic content loads on navigation to that topic
- Content is cached in memory after first load (SPA never reloads)
- Service worker caches all fetched content for offline use

## Feature Specifications

### 1. Flashcards

**UX Flow:** Student enters flashcard mode → sees dark card with question → taps/clicks "See answer" or presses Space → card flips to light side with answer → marks correct (checkmark) or wrong (X) → next card.

**Interactions:**
- **Flip:** Click card, tap "See answer", or press Space
- **Navigate:** Left/right arrows, swipe on mobile, or arrow buttons
- **Score:** Correct (green checkmark) / Wrong (red X) buttons below card
- **Progress:** Counter showing `{current}/{total}` on card
- **Feedback:** "Got it" (green) on correct, "You'll get it next time" (red) on wrong
- **Keyboard:** Space = flip, → = next, ← = previous, Enter = correct, Backspace = wrong

**Visual Design (matching NotebookLM):**
- Question side: dark card (#1f2937), white text, large readable font
- Answer side: light card (white with soft border), dark text
- Card has rounded corners (`rounded-2xl`), soft shadow
- Flip animation: 3D CSS transform (rotateY)
- Score bar at bottom: ← arrow | X count (red) | checkmark count (green) | → arrow

**localStorage Persistence:**
- Key: `physio-progress-{topicSlug}-flashcards`
- Stores: `{ correct: number[], wrong: number[], lastCard: number }`
- "Resume where you left off" on return

### 2. Quizzes

**Mode Selection:** On entering quiz, student picks:
- **Practice Mode** — instant feedback after each answer, can retry
- **Test Mode** — no feedback until the end, shows final score + review

**UX Flow (Practice):** See question + 4 options → select answer → immediate green/red highlight → optional hint → Next button.

**UX Flow (Test):** See question + 4 options → select answer → Next (no feedback) → ... → Results screen with score, wrong answers listed with correct answers.

**Interactions:**
- Click option to select (A/B/C/D)
- Keyboard: 1/2/3/4 or A/B/C/D to select, Enter to confirm, → for next
- "Hint" expandable section below options
- Progress counter: `{current}/{total}` at top
- Previous/Next navigation buttons

**Visual Design (matching NotebookLM):**
- Clean white card with question text
- Options as rounded pill-shaped buttons with letter prefix
- Selected option: blue/purple highlight
- Correct: green background, Wrong: red background (practice mode)
- Hint section: expandable accordion with light purple background
- Results screen: score circle + list of wrong answers with corrections

**localStorage Persistence:**
- Key: `physio-progress-{topicSlug}-quiz`
- Stores: `{ bestScore: number, attempts: number, lastWrong: number[] }`

### 3. Mind Maps

**UX:** Full-screen interactive SVG mind map rendered by Markmap. Central node is the topic title, branches expand outward with sub-topics.

**Interactions:**
- Pan: click and drag (mouse), swipe (touch)
- Zoom: scroll wheel, pinch-to-zoom (touch), +/- buttons
- Expand/collapse: click on a node to toggle its children
- Fit to view: button to reset zoom/pan to show entire map

**Visual Design:**
- SVG rendered by Markmap with custom CSS overrides to match app theme
- Nodes: rounded rectangles with topic text
- Lines: smooth bezier curves connecting nodes
- Colors: branch-based coloring (each main branch gets a distinct hue from the app palette)
- Dark mode: inverted colors for nodes and lines

**Data:** Simple nested JSON tree (shown in Data Architecture section). Converted to Markmap format at render time.

### 4. Home Page / Topic Grid

**Layout:** Responsive grid of topic cards.
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

**Each card shows:**
- Topic title (e.g., "Cerebellum")
- Chapter/category label (e.g., "CNS")
- Content type badges with counts: "65 cards" / "10 Qs" / "Mind Map"
- Subtle hover effect (lift + shadow increase)

**Top bar:**
- App logo/title: "PhysioApp"
- Search icon (opens Cmd+K modal)
- Dark mode toggle (sun/moon icon)

### 5. Global Search (Cmd+K)

**Trigger:** Click search icon, or press Cmd+K / Ctrl+K.

**UX:** Modal overlay with search input. Results grouped by type (flashcards, quiz questions, mind map nodes). Each result shows the matching text, topic name, and content type. Click result → navigates to that topic's content type.

**Implementation:** MiniSearch pre-built index. Index includes all flashcard questions/answers, quiz questions, and mind map node titles. Built at build time by `scripts/build-search-index.ts`.

### 6. Dark Mode

- Toggle via sun/moon icon in header
- Persisted in localStorage (`physio-theme`)
- Respects `prefers-color-scheme` on first visit
- Tailwind `dark:` variant classes throughout
- CSS custom properties for theme colors enable smooth transitions

### 7. PWA / Offline

- **Service worker:** Generated by vite-plugin-pwa with Workbox
- **Precache:** App shell (HTML, JS, CSS, fonts)
- **Runtime cache:** Content JSON files use `StaleWhileRevalidate` — serve cached version, fetch update in background
- **Manifest:** App name "PhysioApp", theme color matches brand, icons for home screen
- **Install prompt:** Custom "Add to Home Screen" banner on first visit (dismissible)
- **Offline indicator:** Small banner when network is unavailable: "You're offline — cached content is available"

## Project Structure

```
PhysioApp/
  public/
    content/
      topics.json
      search-index.json
      cns-cerebellum/
        flashcards.json
        quiz.json
        mindmap.json
    favicon.svg
    icons/                           (PWA icons)
  src/
    components/
      layout/
        AppShell.tsx                 (header, mobile nav, theme provider)
        TopicGrid.tsx                (home page card grid)
        TopicCard.tsx                (individual topic card)
        SearchModal.tsx              (Cmd+K search overlay)
        ThemeToggle.tsx              (dark mode sun/moon)
      flashcards/
        FlashcardDeck.tsx            (deck state, keyboard nav, scoring)
        FlashcardCard.tsx            (flip animation, question/answer)
        ScoreBar.tsx                 (correct/wrong counters + nav arrows)
      quiz/
        QuizEngine.tsx               (state machine: mode select → questions → results)
        ModeSelect.tsx               (practice vs test mode picker)
        QuestionCard.tsx             (question + options display)
        OptionButton.tsx             (A/B/C/D option with state)
        HintAccordion.tsx            (expandable hint)
        ResultsSummary.tsx           (final score + wrong answer review)
      mindmap/
        MindMapViewer.tsx            (markmap wrapper + controls)
      ui/
        Button.tsx
        Badge.tsx
        Card.tsx
        ProgressBar.tsx
    hooks/
      useTopicData.ts               (lazy fetch + memory cache)
      useProgress.ts                (localStorage CRUD for scores)
      useKeyboardNav.ts             (Space, arrows, Enter, 1-4)
      useDarkMode.ts                (theme state + localStorage + system pref)
      useSearch.ts                  (MiniSearch load + query)
    lib/
      types.ts                      (TypeScript interfaces for all data)
      constants.ts                  (routes, keyboard maps, theme colors)
    pages/
      Home.tsx
      TopicPage.tsx                  (topic landing with content type cards)
      FlashcardsPage.tsx
      QuizPage.tsx
      MindMapPage.tsx
      NotFound.tsx
    App.tsx                          (router + providers)
    main.tsx                         (entry point)
    index.css                        (Tailwind directives + custom animations)
  scripts/
    import-csv.ts                    (CSV → flashcards.json converter)
    build-search-index.ts            (scans content, builds MiniSearch index)
    scrape-quiz.ts                   (Playwright → quiz.json)
    scrape-mindmap.ts                (Playwright → mindmap.json)
  index.html
  vite.config.ts
  tailwind.config.ts
  tsconfig.json
  package.json
```

## Content Pipeline (Separate from App)

### Flashcard Import
1. Export CSV from NotebookLM
2. Run `npx tsx scripts/import-csv.ts flashcard_data/flashcards.csv cns-cerebellum`
3. Outputs `public/content/cns-cerebellum/flashcards.json`

### Quiz Scraping
1. User logs into NotebookLM in browser
2. Run `npx tsx scripts/scrape-quiz.ts --topic cns-cerebellum`
3. Playwright navigates to the quiz, scrapes questions/options/hints
4. Outputs `public/content/cns-cerebellum/quiz.json`

### Mind Map Scraping
1. User logs into NotebookLM in browser
2. Run `npx tsx scripts/scrape-mindmap.ts --topic cns-cerebellum`
3. Playwright extracts the mind map node tree structure
4. Outputs `public/content/cns-cerebellum/mindmap.json`

### Search Index Build
1. Runs automatically as part of `npm run build`
2. Scans all `public/content/*/` directories
3. Indexes flashcard Q&As, quiz questions, mind map node titles
4. Outputs `public/content/search-index.json`

## Deployment

1. `npm run build` → produces `dist/` with static files
2. Cloudflare Pages connected to git repo, auto-deploys on push
3. `_redirects` file: `/* /index.html 200` (SPA fallback)
4. Content updates = update JSON files → push → auto-deploy

## Design Tokens (NotebookLM-Inspired)

```
Primary:        #6366f1 (indigo-500)
Primary hover:  #4f46e5 (indigo-600)
Background:     #ffffff (light) / #111827 (dark)
Surface:        #f9fafb (light) / #1f2937 (dark)
Card question:  #1f2937 (dark card)
Card answer:    #ffffff (light card)
Text primary:   #111827 (light) / #f9fafb (dark)
Text secondary: #6b7280
Border:         #e5e7eb (light) / #374151 (dark)
Success:        #22c55e
Error:          #ef4444
Radius card:    16px
Radius button:  12px
Shadow card:    0 1px 3px rgba(0,0,0,0.1)
Shadow hover:   0 4px 12px rgba(0,0,0,0.15)
```

## Verification Plan

1. **Build:** `npm run build` completes with 0 errors
2. **Dev server:** `npm run dev` → app loads at localhost, all routes work
3. **Flashcards:** Navigate to a topic → flashcards → flip cards, score, keyboard nav all work
4. **Quizzes:** Both practice and test mode → correct/wrong feedback → results screen
5. **Mind Maps:** Markmap renders, zoom/pan/collapse work on desktop and mobile
6. **Search:** Cmd+K opens modal, typing finds results across all content
7. **Dark mode:** Toggle works, persists on reload, respects system preference
8. **PWA:** Lighthouse PWA audit passes, app installable, works offline after first load
9. **Responsive:** Test on 320px (mobile), 768px (tablet), 1280px (desktop), 1920px (projector)
10. **Cloudflare Pages:** Deploy preview, verify all routes and content load correctly
