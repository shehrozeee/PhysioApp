// ============================================================
// notebooklm_physioapp_extractor.js
// Version: 1.0.0
// 
// PURPOSE:
//   Extracts quiz, flashcard, and mind map data from a
//   NotebookLM notebook page and downloads a ZIP file
//   with structured JSON files ready for PhysioApp.
//
// USAGE:
//   1. Open your NotebookLM notebook in Chrome
//   2. Open DevTools > Console (F12)
//   3. Paste this entire file into the console and press Enter
//   4. Run: physioApp.run()
//   5. The ZIP will be downloaded automatically
//
// OPTIONS:
//   physioApp.run({
//     skipMindMap: false,           // set true to skip mind map
//     mindMapArtifactId: null,      // provide UUID if auto-detect fails
//     zipFilename: "physioapp_data.zip"
//   })
//
// FOR CHROME EXTENSION BUILDERS:
//   - Inject this as a content script on notebooklm.google.com/notebook/*
//   - Add a button to the page that calls physioApp.run()
//   - See manifest_v3_hints.md for extension setup guidance
// ============================================================

const PHYSIOAPP_EXTRACTOR_VERSION = "1.7.0";

// ─────────────────────────────────────────────────────────────────
// VARIABLE STABILITY GUIDE (READ BEFORE BUILDING THE EXTENSION)
// ─────────────────────────────────────────────────────────────────
//
// STABLE (won't change between page reloads or Google updates):
//   ✅ Notebook UUID in the URL (/notebook/<uuid>)
//   ✅ window.WIZ_global_data.SNlM0e — KEY PATH is stable (value changes per session)
//   ✅ batchexecute endpoint URL
//   ✅ data-app-data attribute name and JSON schema inside it
//   ✅ mindmap-viewer custom element tag name
//   ✅ [role="treeitem"] aria attributes (aria-level, aria-label)
//   ✅ RPC payload STRUCTURE: ["artifactId",null,"notebookId"]
//   ✅ RPC response structure: outer[0][0][2] = inner JSON string
//   ✅ Artifact HTML field path: result[0][9][0] = HTML string
//
// UNSTABLE (may change when Google deploys a new JS bundle):
//   ⚠️  "gArtLc" — RPC ID for ListArtifacts
//   ⚠️  "v9rmvd" — RPC ID for GetArtifact
//   ⚠️  All other short obfuscated RPC IDs
//   ⚠️  Artifact type numbers (4 = quiz/flashcard — verify this)
//
// HOW TO RE-DISCOVER RPC IDs IF THEY BREAK:
//   Run in console on a NotebookLM page:
//
//   fetch([...document.querySelectorAll('script[src]')]
//     .find(s => s.src.includes('notebooklm') || s.src.includes('_/mss'))?.src || '')
//     .then(r => r.text())
//     .then(js => {
//       const matches = [...js.matchAll(/new _.NC\("([^"]+)"[^)]+\)/g)];
//       matches.forEach(m => //console.log(m[1], '|', m[0].substring(0, 100)));
//     });
//
//   Look for the match near "GetArtifact" and "ListArtifacts" in context.
//   Update the RPC_IDS object below with the new values.
// ─────────────────────────────────────────────────────────────────

const RPC_IDS = {
  listArtifacts: "ulBSjf",   // ⚠️ MAY CHANGE — was gArtLc, updated 2026-03-29
  getArtifact:   "v9rmvd",   // ⚠️ MAY CHANGE — GetArtifact single
};

function getNotebookId() {
  const match = window.location.href.match(/\/notebook\/([a-f0-9-]{36})/);
  if (!match) throw new Error("Not on a NotebookLM notebook page. URL must contain /notebook/<uuid>");
  return match[1];
}

function getXsrfToken() {
  const token = window.WIZ_global_data?.SNlM0e;
  if (!token) throw new Error("XSRF token not found at window.WIZ_global_data.SNlM0e. Try refreshing the page.");
  return token;
}

// Intercept a live XHR to capture fresh XSRF token — more reliable than WIZ_global_data
function captureXsrfFromXhr(timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
      if (typeof body === "string" && body.includes("at=")) {
        const m = body.match(/at=([^&]+)/);
        if (m) {
          XMLHttpRequest.prototype.send = origSend;
          resolve(decodeURIComponent(m[1]));
        }
      }
      return origSend.apply(this, arguments);
    };
    setTimeout(() => {
      XMLHttpRequest.prototype.send = origSend;
      reject(new Error("Timed out waiting for XHR with at= token. Try clicking something on the page first."));
    }, timeoutMs);
  });
}

async function callRpc(rpcId, innerPayload, xsrfToken) {
  const payloadStr = JSON.stringify(innerPayload);
  const freq = JSON.stringify([[[rpcId, payloadStr, null, "generic"]]]);
  const body = "f.req=" + encodeURIComponent(freq) + "&at=" + encodeURIComponent(xsrfToken) + "&";

  const resp = await fetch(
    "https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "x-same-domain": "1" },
      credentials: "include",
      body: body,
    }
  );

  if (!resp.ok) throw new Error(`RPC ${rpcId} HTTP ${resp.status}: ${resp.statusText}`);

  const text = await resp.text();
  // Google's batchexecute responses can have various prefixes
  // Strip common prefixes: )]}\n  or )]}'\n or just leading whitespace
  let cleaned = text;
  const prefixes = [")]}'\\n", ")]}'", ")]}'\n", ")]}\n", ")]}"];
  for (const p of prefixes) {
    if (cleaned.startsWith(p)) {
      cleaned = cleaned.substring(p.length);
      break;
    }
  }
  // Also try stripping any non-JSON prefix
  const jsonStart = cleaned.indexOf('[');
  if (jsonStart > 0) cleaned = cleaned.substring(jsonStart);

  let outer;
  try {
    outer = JSON.parse(cleaned);
  } catch (e) {
    console.error(`RPC ${rpcId} response parse failed. First 200 chars:`, text.substring(0, 200));
    throw new Error(`RPC ${rpcId} JSON parse failed: ${e.message}. Response starts with: "${text.substring(0, 50)}"`);
  }

  // Response format: [["wrb.fr", "rpcId", "innerJsonString", ...], ...]
  // The data is at outer[0][2], NOT outer[0][0][2]
  const innerStr = outer[0]?.[2];
  if (!innerStr || typeof innerStr !== 'string') {
    const errCode = outer[0]?.[5];
    console.error(`RPC ${rpcId} no data. Structure:`, JSON.stringify(outer).substring(0, 300));
    throw new Error(`RPC ${rpcId} returned no data. Error code: ${errCode}`);
  }
  return JSON.parse(innerStr);
}

// Global log array accessible from everywhere
const _extLog = [];

async function listArtifacts(xsrfToken) {
  _extLog.push("listArtifacts: scanning DOM...");
  const ids = new Set();
  document.querySelectorAll("button[aria-labelledby]").forEach(b => {
    const v = b.getAttribute("aria-labelledby");
    if (v && v.includes("note-labels-")) ids.add(v.replace("note-labels-", ""));
  });
  const bodyMatches = document.body.innerHTML.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g) || [];
  bodyMatches.forEach(id => ids.add(id));
  const notebookId = getNotebookId();
  ids.delete(notebookId);
  _extLog.push("listArtifacts: found " + ids.size + " candidate UUIDs: " + [...ids].map(i=>i.substring(0,8)).join(", "));

  const artifacts = [];
  for (const id of ids) {
    try {
      _extLog.push("  trying v9rmvd on " + id.substring(0,8) + "...");
      const html = await getArtifactContent(id, xsrfToken);
      _extLog.push("  " + id.substring(0,8) + ": got " + (typeof html==='string'?html.length:typeof html) + " chars");
      if (html && typeof html === 'string' && html.includes("data-app-data")) {
        const nameMatch = html.match(/"name":"([^"]+)"/);
        const typeMatch = html.match(/quiz|flashcard/i);
        const name = nameMatch ? nameMatch[1] : (typeMatch ? typeMatch[0] : id.substring(0, 8));
        _extLog.push("  " + id.substring(0,8) + ": HAS data-app-data, name=" + name);
        artifacts.push({ artifactId: id, name: name, type: "4" });
      } else {
        _extLog.push("  " + id.substring(0,8) + ": no data-app-data");
      }
    } catch (e) {
      _extLog.push("  " + id.substring(0,8) + ": ERROR " + e.message);
    }
  }
  _extLog.push("listArtifacts: returning " + artifacts.length + " artifacts");
  return artifacts;
}

async function getArtifactContent(artifactId, xsrfToken) {
  // New payload format as of 2026-03-29
  const payload = [artifactId, [2,null,null,[1,null,null,null,null,null,null,null,null,null,[1]],[[2,1,3,4,6]]]];
  const result = await callRpc(RPC_IDS.getArtifact, payload, xsrfToken);
  const html = result[0]?.[9]?.[0];
  if (!html) throw new Error(`No HTML in artifact ${artifactId}. Field path result[0][9][0] was empty.`);
  return html;
}

function parseDataAppData(html) {
  // Can't use DOMParser — blocked by NotebookLM's Trusted HTML CSP
  // Use regex to extract data-app-data attribute value
  const match = html.match(/data-app-data="([^"]*)"/);
  if (!match) throw new Error("No data-app-data attribute found in HTML");
  // Unescape HTML entities
  const raw = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
  return JSON.parse(raw);
}

function formatQuiz(appData, name) {
  return {
    _meta: { source: "NotebookLM", artifact: name, extractedAt: new Date().toISOString() },
    questions: appData.quiz.map((q, i) => {
      const correctIdx = q.answerOptions.findIndex(o => o.isCorrect);
      return {
        id: i + 1,
        question: q.question,
        options: q.answerOptions.map(o => o.text),
        correct: correctIdx,
        hint: q.hint || "",
        rationale: q.answerOptions[correctIdx]?.rationale || "",
      };
    }),
  };
}

function formatFlashcards(appData, name) {
  return {
    _meta: { source: "NotebookLM", artifact: name, extractedAt: new Date().toISOString() },
    cards: appData.flashcards.map((c, i) => ({ id: i + 1, question: c.f, answer: c.b })),
  };
}

async function openAndExtractMindMap(mindMapArtifactId) {
  _extLog.push("MindMap: going back to artifact list...");
  // Click "Studio" header to go back to artifact list
  const studioBtn = document.querySelector(".panel-header-clickable") ||
    document.querySelector("span.panel-header-clickable") ||
    Array.from(document.querySelectorAll("span")).find(s => s.textContent.trim() === "Studio");
  if (studioBtn) {
    studioBtn.click();
    await new Promise(r => setTimeout(r, 2000));
    _extLog.push("MindMap: clicked Studio to go back");
  }

  _extLog.push("MindMap: clicking artifact button " + mindMapArtifactId.substring(0,8));
  // Wait for button to appear after closing
  let btn = null;
  for (let i = 0; i < 10; i++) {
    btn = document.querySelector(`button[aria-labelledby="note-labels-${mindMapArtifactId}"]`);
    if (btn) break;
    await new Promise(r => setTimeout(r, 500));
  }
  if (!btn) throw new Error(`Mind map button not found for artifact ${mindMapArtifactId}. Is the Studio panel open?`);
  btn.click();

  // Wait for mindmap-viewer to appear (up to 8 seconds)
  for (let i = 0; i < 16; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (document.querySelector("mindmap-viewer")) break;
  }
  _extLog.push("MindMap: viewer " + (document.querySelector("mindmap-viewer") ? "found" : "NOT found"));

  // Wait for tree items to load
  await new Promise(r => setTimeout(r, 2000));

  // Try clicking "Expand all" with retries
  // The button has: aria-label="Collapse all nodes", mattooltip="Expand all nodes",
  // inner text is "expand_all" (Material icon name), class includes "expand-collapse-all"
  let expanded = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    const expandBtn = document.querySelector("mindmap-viewer .mindmap-footer-container .view-actions-bottom button") ||
      document.querySelector("mindmap-viewer .expand-collapse-all-button-bottom") ||
      document.querySelector(".expand-collapse-all-button-bottom") ||
      document.querySelector("button[mattooltip*='Expand all']") ||
      document.querySelector("button[aria-label*='ollapse all']");
    if (expandBtn) {
      // Click it multiple times to ensure full expansion
      expandBtn.click();
      _extLog.push("MindMap: clicked expand/collapse button (attempt " + (attempt+1) + ")");
      await new Promise(r => setTimeout(r, 2000));
      // Click again if it toggled to "expand" (might need a second click)
      expandBtn.click();
      await new Promise(r => setTimeout(r, 2000));
      expanded = true;
      break;
    }
    _extLog.push("MindMap: expand button not found, retrying... (attempt " + (attempt+1) + ")");
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!expanded) {
    _extLog.push("MindMap: expand button not found after 5 attempts");
  }

  // Count tree items to verify expansion
  const viewer = document.querySelector("mindmap-viewer");
  const itemCount = viewer ? viewer.querySelectorAll("[role='treeitem']").length : 0;
  _extLog.push("MindMap: " + itemCount + " tree items found");

  return extractMindMapFromDom();
}

function extractMindMapFromDom() {
  const viewer = document.querySelector("mindmap-viewer");
  if (!viewer) throw new Error("mindmap-viewer not found. Open the mind map artifact first.");

  const treeItems = Array.from(viewer.querySelectorAll("[role='treeitem']"));
  if (!treeItems.length) throw new Error("No [role='treeitem'] elements found in mindmap-viewer");

  const nodes = treeItems.map(el => {
    const level = parseInt(el.getAttribute("aria-level") || "1", 10);
    const label = el.getAttribute("aria-label") || "";
    const name = label.replace(/,\s*(\d+\s+child.*|no children.*)$/i, "").trim();
    return { level, name };
  });

  const root = { title: nodes[0]?.name || "Root", children: [] };
  const stack = [{ node: root, level: 1 }];

  for (let i = 1; i < nodes.length; i++) {
    const { level, name } = nodes[i];
    const newNode = { title: name };
    while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();
    const parent = stack[stack.length - 1].node;
    if (!parent.children) parent.children = [];
    parent.children.push(newNode);
    stack.push({ node: newNode, level });
  }

  return { _meta: { source: "NotebookLM", extractedAt: new Date().toISOString() }, ...root };
}

// ── ZIP ENCODER (JSZip is blocked by NotebookLM CSP) ────────────
function buildZip(files) {
  function crc32(data) {
    let crc = 0xFFFFFFFF;
    const t = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c;
    }
    for (let i = 0; i < data.length; i++) crc = t[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  const u16 = n => [n & 0xFF, (n >> 8) & 0xFF];
  const u32 = n => [n & 0xFF, (n >> 8) & 0xFF, (n >> 16) & 0xFF, (n >> 24) & 0xFF];
  const enc = new TextEncoder();
  const locals = [], central = [];
  let off = 0;
  for (const f of files) {
    const nb = enc.encode(f.name), db = enc.encode(f.content);
    const crc = crc32(db), sz = db.length;
    const lh = [0x50,0x4B,0x03,0x04,20,0,0,0,0,0,0,0,0,0,...u32(crc),...u32(sz),...u32(sz),...u16(nb.length),0,0,...nb,...db];
    const ce = [0x50,0x4B,0x01,0x02,20,0,20,0,0,0,0,0,0,0,0,0,...u32(crc),...u32(sz),...u32(sz),...u16(nb.length),0,0,0,0,0,0,0,0,0,0,...u32(off),...nb];
    locals.push(...lh); central.push(...ce); off += lh.length;
  }
  const eocd = [0x50,0x4B,0x05,0x06,0,0,0,0,...u16(files.length),...u16(files.length),...u32(central.length),...u32(off),0,0];
  return new Uint8Array([...locals,...central,...eocd]);
}

function downloadZip(zipBytes, filename) {
  const url = URL.createObjectURL(new Blob([zipBytes], { type: "application/zip" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ── MAIN ORCHESTRATOR ─────────────────────────────────────────────
async function runPhysioAppExtraction(options = {}) {
  const { skipMindMap = false, mindMapArtifactId = null, zipFilename = "physioapp_v170.zip" } = options;

  const log = [];
  function addLog(msg) { log.push(new Date().toISOString().substring(11,19) + " " + msg); }

  addLog("PhysioApp Extractor v" + PHYSIOAPP_EXTRACTOR_VERSION);
  const notebookId = getNotebookId();
  addLog("Notebook: " + notebookId);

  const xsrf = getXsrfToken();
  addLog("XSRF token captured");

  addLog("Scanning DOM for artifact IDs...");
  const artifacts = await listArtifacts(xsrf);
  addLog("Found " + artifacts.length + " artifacts with data-app-data");
  artifacts.forEach(a => addLog("  - " + a.artifactId.substring(0,8) + " name=" + a.name));

  const zipFiles = [];

  for (const artifact of artifacts) {
    addLog("Processing: " + artifact.name + " (" + artifact.artifactId.substring(0,8) + ")");
    try {
      const htmlContent = await getArtifactContent(artifact.artifactId, xsrf);
      addLog("  Got content: " + (typeof htmlContent === 'string' ? htmlContent.length + " chars" : typeof htmlContent));
      const appData = parseDataAppData(htmlContent);
      addLog("  Parsed appData keys: " + Object.keys(appData).join(", "));
      const shortId = artifact.artifactId.substring(0, 8);
      if (appData.quiz) {
        const fname = "quiz_" + shortId + ".json";
        zipFiles.push({ name: fname, content: JSON.stringify(formatQuiz(appData, artifact.name), null, 2) });
        addLog("  Quiz: " + appData.quiz.length + " questions -> " + fname);
      }
      if (appData.flashcards) {
        const fname = "flashcards_" + shortId + ".json";
        zipFiles.push({ name: fname, content: JSON.stringify(formatFlashcards(appData, artifact.name), null, 2) });
        addLog("  Flashcards: " + appData.flashcards.length + " cards -> " + fname);
      }
      if (!appData.quiz && !appData.flashcards) {
        addLog("  WARNING: No quiz or flashcard data in appData");
      }
    } catch (e) {
      addLog("  ERROR: " + e.message);
      console.error("Artifact " + artifact.name + ":", e);
    }
  }

  if (!skipMindMap) {
    // Find ALL mind map candidates (artifact buttons not in quiz/flashcard list)
    const quizFlashIds = new Set(artifacts.map(a => a.artifactId));
    const mmIds = mindMapArtifactId ? [mindMapArtifactId] : [];
    if (!mindMapArtifactId) {
      for (const btn of document.querySelectorAll("button[aria-labelledby^='note-labels-']")) {
        const id = btn.getAttribute("aria-labelledby").replace("note-labels-", "");
        if (!quizFlashIds.has(id)) mmIds.push(id);
      }
    }
    addLog("Mind map candidates: " + mmIds.length + " IDs: " + mmIds.map(i=>i.substring(0,8)).join(", "));

    let mmIndex = 0;
    for (const mmId of mmIds) {
      addLog("Trying mind map: " + mmId.substring(0,8));
      try {
        const mm = await openAndExtractMindMap(mmId);
        const count = n => 1 + (n.children||[]).reduce((s,c) => s+count(c), 0);
        const nodeCount = count(mm);
        addLog("  Mind map OK: " + nodeCount + " nodes, title=" + mm.title);
        if (nodeCount > 1) {
          mmIndex++;
          const fname = mmIndex === 1 ? "mind_map.json" : "mind_map_" + mmIndex + ".json";
          zipFiles.push({ name: fname, content: JSON.stringify(mm, null, 2) });
        } else {
          addLog("  Skipped (only root node)");
        }
      } catch (e) {
        addLog("  Mind map ERROR: " + e.message);
      }
    }
  }

  addLog("ZIP files: " + zipFiles.map(f => f.name).join(", "));

  // Always include the full log (both global and local)
  const fullLog = [..._extLog, ...log].join("\n");
  zipFiles.push({ name: "extraction_log.txt", content: fullLog });
  zipFiles.push({ name: "manifest.json", content: JSON.stringify({
    version: PHYSIOAPP_EXTRACTOR_VERSION, notebookId,
    extractedAt: new Date().toISOString(),
    files: zipFiles.map(f => f.name),
  }, null, 2) });

  const zipBytes = buildZip(zipFiles);
  downloadZip(zipBytes, zipFilename);
  //console.log(`\n✅ Downloaded: ${zipFilename} (${(zipBytes.length/1024).toFixed(1)} KB)`);
  return { files: zipFiles.map(f => f.name) };
}

window.physioApp = {
  run: runPhysioAppExtraction,
  listArtifacts, getArtifactContent, parseDataAppData,
  formatQuiz, formatFlashcards,
  extractMindMapFromDom, openAndExtractMindMap,
  buildZip, downloadZip,
  getXsrfToken, captureXsrfFromXhr,
};

//console.log("✅ PhysioApp Extractor loaded!");
//console.log("   Run: physioApp.run()");
