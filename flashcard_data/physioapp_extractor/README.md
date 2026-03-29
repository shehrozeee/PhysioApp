# NotebookLM PhysioApp Extractor
Version 1.0.0

## Quick Start (Console Method)

1. Open your NotebookLM notebook in Chrome
2. Open DevTools Console (F12 or Ctrl+Shift+J)
3. Paste the entire contents of `notebooklm_physioapp_extractor.js` into the console
4. Press Enter — you'll see "✅ PhysioApp Extractor loaded!"
5. Run: `physioApp.run()`
6. The ZIP will download automatically

## Output Files

| File | Contents |
|------|----------|
| `<ArtifactName>_quiz.json` | Quiz questions with options, correct index, hint, rationale |
| `<ArtifactName>_flashcards.json` | Flashcards with front/back |
| `mind_map.json` | Hierarchical mind map tree |
| `manifest.json` | Extraction metadata |

## JSON Schemas

### Quiz
```json
{
  "_meta": { "source": "NotebookLM", "artifact": "...", "extractedAt": "..." },
  "questions": [
    {
      "id": 1,
      "question": "What is ...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 2,
      "hint": "Think about ...",
      "rationale": "Because ..."
    }
  ]
}
```
Note: `correct` is 0-based index into `options` array.

### Flashcards
```json
{
  "_meta": { "source": "NotebookLM", "artifact": "...", "extractedAt": "..." },
  "cards": [
    { "id": 1, "question": "Front text...", "answer": "Back text..." }
  ]
}
```

### Mind Map
```json
{
  "_meta": { "source": "NotebookLM", "extractedAt": "..." },
  "title": "Root Topic",
  "children": [
    {
      "title": "Branch 1",
      "children": [
        { "title": "Leaf 1" },
        { "title": "Leaf 2" }
      ]
    }
  ]
}
```

## Chrome Extension Notes

### Manifest V3 Setup (manifest.json)
```json
{
  "manifest_version": 3,
  "name": "PhysioApp NotebookLM Extractor",
  "version": "1.0.0",
  "permissions": ["activeTab", "scripting"],
  "content_scripts": [
    {
      "matches": ["https://notebooklm.google.com/notebook/*"],
      "js": ["notebooklm_physioapp_extractor.js"],
      "run_at": "document_idle"
    }
  ],
  "action": { "default_popup": "popup.html" }
}
```

The content script auto-loads `physioApp` into the page context.
Your popup can inject a button or call `chrome.scripting.executeScript`
to run `physioApp.run()`.

### CRITICAL: Variable Stability

| Thing | Stable? | Notes |
|-------|---------|-------|
| Notebook UUID in URL | ✅ Yes | Never changes |
| `window.WIZ_global_data.SNlM0e` key path | ✅ Yes | Value changes per session |
| `batchexecute` endpoint URL | ✅ Yes | Google's standard RPC endpoint |
| `data-app-data` attribute + schema | ✅ Yes | Server-rendered, stable |
| `mindmap-viewer` tag + aria attributes | ✅ Yes | But could change if component is refactored |
| RPC payload structure | ✅ Yes | Server-side contract |
| `"gArtLc"` (ListArtifacts RPC ID) | ⚠️ NO | Obfuscated — may change on JS deploy |
| `"v9rmvd"` (GetArtifact RPC ID) | ⚠️ NO | Obfuscated — may change on JS deploy |
| Artifact type `4` = quiz/flashcard | ⚠️ Probably | Verify if extraction stops working |

### Re-discovering RPC IDs

If `gArtLc` or `v9rmvd` return errors, run this in the console
on a NotebookLM page to find the new IDs:

```js
fetch([...document.querySelectorAll('script[src]')]
  .find(s => s.src.includes('notebooklm') || s.src.includes('_/mss'))?.src || '')
  .then(r => r.text())
  .then(js => {
    [...js.matchAll(/new _.NC\("([^"]+)"[^)]+\)/g)]
      .forEach(m => console.log(m[1], '|', m[0].substring(0, 100)));
  });
```

Look for the RPC near "GetArtifact" and "ListArtifacts" in the output.
Update the `RPC_IDS` object at the top of the extractor script.

## API Details (for Extension Builders)

### Endpoint
POST https://notebooklm.google.com/_/NotebookLmUi/data/batchexecute

### Headers
- Content-Type: application/x-www-form-urlencoded
- x-same-domain: 1
- (credentials: include — relies on existing Google session cookies)

### ListArtifacts
- RPC ID: gArtLc (⚠️ may change)
- Payload: [null, "<notebookId>"]
- Response path: result[0] = array of artifacts
  - Each: a[0][0] = artifactId, a[0][3] = type, a[0][4] = name

### GetArtifact
- RPC ID: v9rmvd (⚠️ may change)
- Payload: ["<artifactId>", null, "<notebookId>"]
- Response path: result[0][9][0] = HTML string containing data-app-data

### XSRF Token
- Available at: window.WIZ_global_data.SNlM0e
- Or intercept from live XHR POST body: the `at=<token>` parameter
- Must be included in every batchexecute POST body as: `at=<token>`

### Mind Map (DOM-based, not RPC)
- Does NOT go through GetArtifact — renders directly in main DOM
- Click artifact button: `button[aria-labelledby="note-labels-<artifactId>"]`
- Wait ~2s for render, then click "Expand all nodes" button
- Extract: `mindmap-viewer [role="treeitem"]` — aria-level + aria-label
- Reconstruct tree using level as depth indicator

## File List

- `notebooklm_physioapp_extractor.js` — Main extraction script (paste into console)
- `README.md` — This file
