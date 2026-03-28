# NotebookLM Style Guide

Exact CSS values extracted from saved NotebookLM HTML pages (March 2026).
Use these to match pixel-perfect styling in PhysioApp.

---

## Color System (CSS Custom Properties)

NotebookLM uses `light-dark()` CSS functions with a `--nlm-*` variable namespace.
Values below are resolved for **light mode** (primary) and **dark mode** (secondary).

### Brand Colors
| Variable | Value |
|---|---|
| `--nlm-brand-black` | `#000` |
| `--nlm-brand-white` | `#fff` |
| `--nlm-brand-blue` | `#4259ff` |
| `--nlm-brand-green` | `#45ec6d` |
| `--nlm-brand-dark-blue` | `#2f334b` |
| `--nlm-brand-light-blue` | `#edeffa` (light) / `#2f334b` (dark) |

### Blue Palette
| Variable | Value |
|---|---|
| `--nlm-blue-2` | `#17181c` |
| `--nlm-blue-5` | `#1d1e26` |
| `--nlm-blue-10` | `#232740` |
| `--nlm-blue-20` | `#2a3163` |
| `--nlm-blue-30` | `#2f3a8e` |
| `--nlm-blue-40` | `#384acf` |
| `--nlm-blue-50` | `#4259ff` |
| `--nlm-blue-60` | `#596cf7` |
| `--nlm-blue-70` | `#7c8bf3` |
| `--nlm-blue-80` | `#94a0f4` |
| `--nlm-blue-90` | `#c3cafc` |
| `--nlm-blue-95` | `#dbdfff` |
| `--nlm-blue-98` | `#edeffa` |
| `--nlm-blue-100` | `#fff` |

### Grey Palette
| Variable | Value |
|---|---|
| `--nlm-grey-0` | `#000` |
| `--nlm-grey-10` | `#1b1b1c` |
| `--nlm-grey-20` | `#303030` |
| `--nlm-grey-30` | `#474747` |
| `--nlm-grey-40` | `#5e5e5e` |
| `--nlm-grey-50` | `#777` |
| `--nlm-grey-60` | `#919191` |
| `--nlm-grey-70` | `#ababab` |
| `--nlm-grey-80` | `#c7c7c7` |
| `--nlm-grey-90` | `#e3e3e3` |
| `--nlm-grey-95` | `#f2f2f2` |
| `--nlm-grey-98` | `#f9f9f9` |
| `--nlm-grey-100` | `#fff` |

### Green Palette
| Variable | Value |
|---|---|
| `--nlm-green-50` | `#45ec6d` |
| `--nlm-green-60` | `#6df88e` |
| `--nlm-green-70` | `#9efab4` |
| `--nlm-green-80` | `#cefdd9` |

### Other
| Variable | Value |
|---|---|
| `--nlm-red-50` | `#db372d` |
| `--nlm-icons-red` | `#f55e57` |
| `--nlm-icons-blue` | `#3271ea` |
| `--nlm-icons-pink` | `#b741ff` |
| `--nlm-icons-yellow` | `#fcbd00` |

### Surface & Fill Colors
| Variable | Light | Dark |
|---|---|---|
| `--nlm-fills-surface-page` | `#edeffa` (blue-98) | `#1a1d22` |
| `--nlm-fills-surface-page-grey` | `#f9f9f9` (grey-98) | `#1a1d22` |
| `--nlm-fills-surface-panel` | `#fff` | `#22262b` |
| `--nlm-fills-surface-panel-transparent-70` | `rgba(255,255,255,0.7)` | `rgba(34,38,43,0.7)` |
| `--nlm-fills-surface-panel-transparent-80` | `rgba(255,255,255,0.8)` | `rgba(34,38,43,0.8)` |
| `--nlm-fills-surface-landing` | `#fff` | `#22262b` |
| `--nlm-fills-ui-blue-fill` | `#edeffa` (blue-98) | `#1a1d22` |
| `--nlm-fills-ui-grey-fill` | `#f2f2f2` (grey-95) | `#3e4a59` |
| `--nlm-fills-ui-light-grey-fill` | `#f9f9f9` (grey-98) | `#1a1d22` |
| `--nlm-fills-ui-dark-grey-fill` | `#919191` (grey-60) | same |
| `--nlm-fills-x-icon` | `#f2f4f7` | `#22262b` |

### Text Colors
| Variable | Light | Dark |
|---|---|---|
| `--nlm-text-titles-and-labels` | `#1b1b1c` (grey-10) | `#f2f2f2` (grey-95) |
| `--nlm-text-body-text` | `#303030` (grey-20) | `#c7c7c7` (grey-80) |
| `--nlm-text-secondary-text` | `#5e5e5e` (grey-40) | `#ababab` (grey-70) |
| `--nlm-text-ghost-text` | `#777` (grey-50) | `#919191` (grey-60) |
| `--nlm-text-cta-text-primary` | `#fff` | same |

### Stroke & Border
| Variable | Light | Dark |
|---|---|---|
| `--nlm-stroke-default` | `#dde1eb` | `#37383b` |
| `--nlm-stroke-focus` | `#919191` (grey-60) | `#5e5e5e` (grey-40) |

### CTA / Button Colors
| Variable | Value |
|---|---|
| `--nlm-ctas-buttons-primary` | `#4259ff` (blue-50) |
| `--nlm-ctas-buttons-secondary` | `#000` (light) / `#fff` (dark) |
| `--nlm-ctas-buttons-tertiary` | `var(--nlm-fills-surface-panel)` |
| `--nlm-ctas-buttons-pill` | `#edeffa` (light) / `#c3cafc` (dark) |
| `--nlm-ctas-text-and-icon` | `#4259ff` (light) / `#c3cafc` (dark) |

### Pastel Tiles
| Variable | Light | Dark |
|---|---|---|
| `--nlm-pastel-blue` | `#e7f0fa` | `#20272d` |
| `--nlm-pastel-green` | `#e1f1e5` | `#1e2520` |
| `--nlm-pastel-orange` | `#f7edeb` | `#29201e` |
| `--nlm-pastel-pink` | `#f0e9ef` | `#291f28` |
| `--nlm-pastel-purple` | `#edeffa` | `#20222d` |
| `--nlm-pastel-yellow` | `#f2f2e8` | `#29291d` |

---

## Typography

### Fonts Used
- **Google Sans** - Primary UI font (headings, labels, node text)
- **Google Sans Text** - Body text
- **Google Sans Code** - Monospace, code blocks (loaded via css2.css, weights 400-700)
- **Material Symbols Outlined** - Icon font (`google-symbols` class)

### Font Sizes (from DOM)
| Element | Size | Weight | Family |
|---|---|---|---|
| Page title (`.artifact-title`) | `mat-title-large` class | normal | Google Sans |
| Subtitle / "Based on 1 source" | inherited | normal | Google Sans Text |
| Mindmap title (`.mindmap-title`) | `1.5rem` (24px) | normal | Google Sans |
| Mindmap node text (`.node-name`) | `20px` | normal | Google Sans |
| Mindmap expand symbol | `20px` | normal | Google Sans |
| Flashcard question text | ~24-28px | 400 | Google Sans |
| Flashcard answer text | ~24-28px | 400 | Google Sans |
| Flashcard counter (1/65) | ~14px | 400 | Google Sans Text |
| Quiz question text | ~18-20px | 400 | Google Sans |
| Quiz counter (1/10) | ~14px | 400 | Google Sans Text |
| Quiz option text | ~16px | 400 | Google Sans Text |
| Hint text | ~14px | 400 | Google Sans Text |
| "See answer" text | ~14px | 400 | Google Sans Text |

---

## Flashcard View (from screenshots)

### Overall Page
- **Background**: `#edeffa` (light) / `#1a1d22` (dark) - same as `--nlm-fills-surface-page`
- **Container**: `background: var(--nlm-fills-surface-panel)` = `#fff` (light) / `#22262b` (dark)
- **Container border-radius**: `1rem` (16px)
- **Container max-width**: 100% (fills parent)

### Card (Question Side / Front)
- **Background**: `#3c4043` (dark charcoal/almost black) - visible in screenshot
- **Border-radius**: `24px` (large rounded corners)
- **Min-height**: ~350-400px (estimated from screenshot proportions)
- **Padding**: `24px` to `32px`
- **Text color**: `#ffffff` (white)
- **Font-size**: ~24-28px
- **Font-weight**: 400
- **Font-family**: Google Sans
- **Counter (1/65)**: top-left, `~14px`, `rgba(255,255,255,0.7)` (semi-transparent white)
- **3-dot menu**: top-right
- **"See answer"**: bottom-center, `~14px`, `rgba(255,255,255,0.5)` (muted white)
- **Box-shadow**: subtle shadow, approximately `0 2px 8px rgba(0,0,0,0.15)`

### Card (Answer Side / Back)
- **Background**: `#ffffff` (white) with very slight warm tint
- **Border**: `1px solid #e0e0e0` (light grey border)
- **Border-radius**: `24px`
- **Padding**: `24px` to `32px`
- **Text color**: `#1b1b1c` (near black, `--nlm-text-titles-and-labels`)
- **Font-size**: ~24-28px
- **"Explain" button**: outlined pill, border-radius `20px`, border `1px solid #dadce0`

### "Wrong" Card State (from screenshot "You'll get it next time")
- **Background**: `#fce4e4` or similar light pink/salmon
- **Text color**: `#d93025` (red)
- **Text**: "You'll get it next time"

### "Correct" Card State (from screenshot "Got it")
- **Background**: `#d4edda` or similar light green
- **Text color**: `#188038` (green)
- **Text**: "Got it"

### Score Bar (Below Card)
- **Layout**: horizontal flex, centered, gap ~16-24px
- **Left arrow** (previous): `48px` circle, border `1px solid #dadce0`, icon `arrow_back`
- **X (wrong) counter**: text `X 0` in red (`#d93025`), ~14-16px
- **Checkmark (correct) counter**: text with checkmark `0` + checkmark icon in green (`#188038`), ~14-16px
- **Right arrow** (next): `48px` circle, border `2px solid #4259ff` (blue), icon `arrow_forward`
- **Arrow button border-radius**: `50%` (circle)

### Keyboard Hint
- **Text**: `Press "Space" to flip, "<-- / -->" to navigate`
- **Color**: `#5e5e5e` (`--nlm-text-secondary-text`)
- **Font-size**: ~13-14px
- **Position**: centered above card

---

## Quiz View (from screenshots)

### Overall Container
- **Background**: `#ffffff` (white, `--nlm-fills-surface-panel`)
- **Border-radius**: `1rem` (16px) for outer container
- **Padding**: `24px` to `32px`

### Progress Counter
- **Text**: `1 / 10`
- **Color**: `#5e5e5e` (`--nlm-text-secondary-text`)
- **Font-size**: ~14px
- **Position**: top-left of card area

### Edit Icon (pencil)
- **Position**: top-right
- **Color**: `#5e5e5e`

### Question Text
- **Font-size**: ~18-20px
- **Font-weight**: 400
- **Color**: `#1b1b1c` (`--nlm-text-titles-and-labels`)
- **Line-height**: ~1.5 (approx 28-30px)
- **Margin-bottom**: `24px`

### Option Pills
- **Background**: `#f8f9fa` (very light grey, close to `--nlm-fills-ui-light-grey-fill`)
- **Border**: `1px solid #e8eaed` (light grey)
- **Border-radius**: `12px`
- **Padding**: `16px 20px`
- **Font-size**: ~16px
- **Font-weight**: 400
- **Color**: `#1b1b1c`
- **Margin-bottom**: `12px` between options
- **Min-height**: ~52-56px
- **Cursor**: pointer
- **Hover**: slightly darker background

### Option Letter Prefix (A. B. C. D.)
- **Font-weight**: 500 (medium)
- **Color**: same as option text
- **Margin-right**: `12px`
- **Format**: "A." with period

### Option States
| State | Background | Border | Text Color |
|---|---|---|---|
| Default | `#f8f9fa` | `1px solid #e8eaed` | `#1b1b1c` |
| Hover | `#f1f3f4` | `1px solid #dadce0` | `#1b1b1c` |
| Selected | `#e8eaff` (light blue) | `2px solid #4259ff` | `#1b1b1c` |
| Correct | `#e6f4ea` (light green) | `2px solid #188038` | `#188038` |
| Wrong | `#fce8e6` (light red) | `2px solid #d93025` | `#d93025` |

### Hint Section
- **Toggle text**: "Hint" with chevron (`expand_more` / `expand_less`)
- **Font-size**: ~14px
- **Font-weight**: 500
- **Color**: `#1b1b1c`
- **Position**: bottom-left
- **Expanded hint container**:
  - Background: `#f0f0ff` (light blue-purple, close to `--nlm-pastel-purple`)
  - Border-radius: `12px`
  - Padding: `16px`
  - Text color: `#1b1b1c`
  - Font-size: ~14px
  - Icon: sparkle/refresh icon in blue-purple

### Navigation Buttons
- **Previous button**:
  - Style: outlined pill
  - Border: `1px solid #dadce0`
  - Border-radius: `20px`
  - Padding: `8px 24px`
  - Font-size: `14px`
  - Color: `#1b1b1c`
  - Background: transparent
- **Next button**:
  - Style: filled pill
  - Background: `#4259ff` (`--nlm-ctas-buttons-primary`)
  - Border-radius: `20px`
  - Padding: `8px 24px`
  - Font-size: `14px`
  - Color: `#ffffff`
- **Button position**: bottom-right, gap `8px`

---

## Mind Map View (from rendered SVG + component CSS)

### Container
- **Component**: `mindmap-viewer` (`_nghost-ng-c2025732931`)
- **Size**: `width: 100%; height: 100%; overflow: hidden`
- **Background**: `var(--nlm-fills-surface-panel)` = `#fff` (light) / `#22262b` (dark)
- **Container class** `.mindmap-container`: `block-size: 100%; height: 100%`

### Header
- **`.mindmap-header-container`**: positioned absolute top, full width
  - `padding: 1.5rem 0`
  - `background: linear-gradient(to bottom, var(--nlm-fills-surface-panel), transparent)`
  - `border-start-start-radius: 1rem; border-start-end-radius: 1rem`

### Title
- **`.mindmap-title`**:
  - `font-size: 1.5rem` (24px)
  - `color: var(--nlm-text-titles-and-labels)` = `#1b1b1c` (light) / `#f2f2f2` (dark)
  - `font-family: Google Sans, sans-serif`
  - `line-height: normal`
  - `margin: 0`

### SVG Canvas
- **`<svg>`**: `width: 100%; height: 100%`; `style: overflow: scroll`

### Root Node (Level 1)
- **Shape**: `<rect>` with `rx="8" ry="8"` (8px border-radius)
- **Fill**: `rgb(195, 202, 255)` = `#c3caff`
- **Height**: `55px`
- **Width**: auto (based on text content), e.g. `234px`
- **X offset**: `-18px` (padding before text)
- **Y offset**: `-27.5px` (centered vertically)
- **Expand circle**: `<circle r="12">`, same fill as rect

### Child Nodes (Level 2)
- **Shape**: `<rect>` with `rx="8" ry="8"` (8px border-radius)
- **Fill**: `rgb(186, 211, 238)` = `#bad3ee`
- **Height**: `55px`
- **Width**: auto (based on text content)
- **Expand circle**: `<circle r="12">`, same fill

### Node Text
- **Class**: `.node-name`
- **Font-size**: `20px`
- **Font-family**: `Google Sans`
- **Fill**: `rgb(0, 0, 0)` = `#000000`
- **Text-anchor**: `start`
- **Dominant-baseline**: `middle`
- **Pointer-events**: `none`

### Expand Symbol Text
- **Class**: `.expand-symbol`
- **Font-size**: `20px`
- **Font-family**: `Google Sans`
- **Fill**: `rgb(0, 0, 0)` = `#000000`
- **Text-anchor**: `middle`
- **Dominant-baseline**: `middle`

### Connection Lines (Links)
- **Element**: `<path class="link">`
- **Fill**: `none`
- **Stroke**: `rgb(119, 135, 255)` = `#7787ff`
- **Stroke-width**: `2px`
- **Path type**: cubic bezier curves (C command)

### Node Spacing
- **Horizontal spacing**: ~328px between levels (from transforms)
- **Vertical spacing**: `80px` between sibling nodes
- **Padding from connector**: `~18px` on left, circle `r=12` on right

### Footer
- **`.mindmap-footer-container`**: positioned absolute bottom, full width
  - `padding: 1.5rem 0`
- **Zoom buttons**: `border-radius: 2rem`, `border: 1px solid var(--nlm-stroke-default)`
- **Expand/collapse button**: `background-color: var(--nlm-fills-ui-blue-fill)`, `border-radius: 2rem`, `box-shadow: 0 2px 8px rgba(0,0,0,0.15)`

---

## Artifact Viewer Container (wraps Flashcard & Quiz)

### Container
- **`.artifact-viewer-container-dialog`**:
  - `background: var(--nlm-fills-surface-panel)` = `#fff` / `#22262b`
  - `border-radius: 1rem` (16px)
  - `overflow: hidden`
  - `transition: border-radius 0.3s ease-in-out`

### Header
- **`.artifact-header-container`**:
  - `padding: 1rem`
  - `display: flex; flex-direction: column`
- **`.artifact-title`**:
  - `color: var(--nlm-text-titles-and-labels)`
  - `background: none; border: 1px solid transparent; border-radius: 4px`

### Footer
- **`.artifact-footer`**:
  - `border-top: 1px solid var(--nlm-stroke-default)` = `#dde1eb` (light) / `#37383b` (dark)
  - `padding: 1rem`

### Feedback Buttons
- **Style**: outlined, Material button
- **Border-radius**: `1rem` (16px)
- **Margin-right**: `1rem`

---

## Overall Page Background

### Light Mode
- `background-color: #edeffa` (host element `[_nghost-ng-c1459864203]`)
- This is the `--nlm-blue-98` blue tint

### Dark Mode
- `background-color: #1a1d22` (via `.dark-theme` selector)

### Tab View Background
- Light: `#fff`
- Dark: `#22262b`

---

## Shadows Used

| Context | Value |
|---|---|
| Container header scroll shadow | `0px 1px 3px 1px rgba(60,64,67,0.15), 0px 1px 2px 0px rgba(60,64,67,0.3)` |
| Mindmap zoom/expand buttons | `0 2px 8px rgba(0,0,0,0.15)` |
| Generic card shadow (approximate) | `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)` |

---

## Animations & Transitions

| Element | Transition |
|---|---|
| Panel content | `background-color 0.3s ease-in` |
| Panel content (all) | `all 0.3s ease-in-out` |
| Artifact container border-radius | `border-radius 0.3s ease-in-out` |
| Iframe opacity | `opacity 0.2s ease-in` |
| Mindmap dialog panel | `all 0.5s ease-in-out` |
| Mesh gradient background | `morph 10s ease-in-out infinite` |

---

## Spacing Tokens

| Token | Value |
|---|---|
| Panel content margin | `16px` inline, `16px` block-start |
| Artifact header padding | `1rem` (16px) |
| Artifact content padding | `0 1rem` |
| Artifact footer padding | `1rem` |
| Mindmap header padding | `1.5rem 0` (24px) |
| Mindmap title padding | `0 1.5rem` |
| Mindmap feedback gap | `1rem` |
| Mindmap footer padding | `1.5rem 0` |
| Mindmap subtitle margin-top | `0.5rem` |
| Panel footer padding | `16px` or `1rem` |

---

## Border Radius Tokens

| Element | Radius |
|---|---|
| Artifact container dialog | `1rem` (16px) |
| Mindmap header corners | `1rem` |
| Mindmap expand/collapse buttons | `2rem` (32px) |
| Flashcard (question) | `24px` (estimated from screenshot) |
| Flashcard (answer) | `24px` (estimated from screenshot) |
| Quiz option pills | `12px` |
| Quiz navigation buttons | `20px` |
| Hint expanded container | `12px` |
| SVG node rects | `8px` |
| Artifact title input | `4px` |
| Feedback buttons | `1rem` (16px) |
