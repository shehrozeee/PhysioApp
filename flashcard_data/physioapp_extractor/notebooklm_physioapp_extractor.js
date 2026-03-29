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

const PHYSIOAPP_EXTRACTOR_VERSION = "1.0.0";

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
//       matches.forEach(m => console.log(m[1], '|', m[0].substring(0, 100)));
//     });
//
//   Look for the match near "GetArtifact" and "ListArtifacts" in context.
//   Update the RPC_IDS object below with the new values.
// ─────────────────────────────────────────────────────────────────

const RPC_IDS = {
  listArtifacts: "gArtLc",   // ⚠️ MAY CHANGE — GetArtifact list
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
  const envelope = JSON.stringify([[rpcId, JSON.stringify(innerPayload), null, "generic"]]);
  const body = new URLSearchParams({ "f.req": `[${envelope}]`, at: xsrfToken });

  const resp = await fetch(
    "https://notebooklm.google.com/_/NotebookLmUi/data/batchexecute",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "x-same-domain": "1" },
      credentials: "include",
      body: body.toString(),
    }
  );

  if (!resp.ok) throw new Error(`RPC ${rpcId} HTTP ${resp.status}: ${resp.statusText}`);

  const text = await resp.text();
  const outer = JSON.parse(text.replace(/^\)\]\}'\n/, ""));
  const innerStr = outer[0]?.[0]?.[2];
  if (!innerStr) {
    const errCode = outer[0]?.[0]?.[3];
    throw new Error(`RPC ${rpcId} returned no data. Error code: ${errCode}. Check RPC_IDS if this is [3] or [5].`);
  }
  return JSON.parse(innerStr);
}

async function listArtifacts(xsrfToken) {
  const notebookId = getNotebookId();
  const result = await callRpc(RPC_IDS.listArtifacts, [null, notebookId], xsrfToken);
  return (result[0] || []).map(a => ({
    artifactId: a[0][0],
    notebookId: a[0][1],
    type: a[0][3],
    name: a[0][4],
  }));
}

async function getArtifactContent(artifactId, xsrfToken) {
  const notebookId = getNotebookId();
  const result = await callRpc(RPC_IDS.getArtifact, [artifactId, null, notebookId], xsrfToken);
  const html = result[0]?.[9]?.[0];
  if (!html) throw new Error(`No HTML in artifact ${artifactId}. Field path result[0][9][0] was empty.`);
  return html;
}

function parseDataAppData(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const el = doc.querySelector("[data-app-data]");
  if (!el) throw new Error("No [data-app-data] element found in artifact HTML");
  const ta = doc.createElement("textarea");
  ta.innerHTML = el.getAttribute("data-app-data");
  return JSON.parse(ta.value);
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
  const btn = document.querySelector(`button[aria-labelledby="note-labels-${mindMapArtifactId}"]`);
  if (!btn) throw new Error(`Mind map button not found for artifact ${mindMapArtifactId}. Is the Studio panel open?`);
  btn.click();
  await new Promise(r => setTimeout(r, 2000));

  const expandBtn = Array.from(document.querySelectorAll("button"))
    .find(b => b.textContent.trim().toLowerCase().includes("expand all"));
  if (expandBtn) {
    expandBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  } else {
    console.warn("Expand all button not found — tree may be incomplete");
  }

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
  const { skipMindMap = false, mindMapArtifactId = null, zipFilename = "physioapp_data.zip" } = options;

  console.log("🚀 PhysioApp Extractor v" + PHYSIOAPP_EXTRACTOR_VERSION);
  const notebookId = getNotebookId();
  console.log("📓 Notebook:", notebookId);

  const xsrf = getXsrfToken();
  console.log("🔑 XSRF token captured");

  console.log("📋 Listing artifacts...");
  const artifacts = await listArtifacts(xsrf);
  console.log("Found:", artifacts.map(a => `${a.name} (type ${a.type})`).join(", "));

  const zipFiles = [];

  for (const artifact of artifacts) {
    if (String(artifact.type) === "4") {
      console.log(`\n🔍 ${artifact.name}...`);
      try {
        const appData = parseDataAppData(await getArtifactContent(artifact.artifactId, xsrf));
        const safe = artifact.name.replace(/[^a-z0-9_-]/gi, "_");
        if (appData.quiz) {
          zipFiles.push({ name: `${safe}_quiz.json`, content: JSON.stringify(formatQuiz(appData, artifact.name), null, 2) });
          console.log(`  ✅ Quiz: ${appData.quiz.length} questions`);
        }
        if (appData.flashcards) {
          zipFiles.push({ name: `${safe}_flashcards.json`, content: JSON.stringify(formatFlashcards(appData, artifact.name), null, 2) });
          console.log(`  ✅ Flashcards: ${appData.flashcards.length} cards`);
        }
      } catch (e) { console.error(`  ❌ ${artifact.name}:`, e.message); }
    }
  }

  if (!skipMindMap) {
    let mmId = mindMapArtifactId;
    if (!mmId) {
      const knownIds = new Set(artifacts.map(a => `note-labels-${a.artifactId}`));
      for (const btn of document.querySelectorAll("button[aria-labelledby^='note-labels-']")) {
        if (!knownIds.has(btn.getAttribute("aria-labelledby"))) {
          mmId = btn.getAttribute("aria-labelledby").replace("note-labels-", "");
          break;
        }
      }
    }
    if (mmId) {
      console.log(`\n🗺️  Mind map (${mmId})...`);
      try {
        const mm = await openAndExtractMindMap(mmId);
        zipFiles.push({ name: "mind_map.json", content: JSON.stringify(mm, null, 2) });
        const count = n => 1 + (n.children||[]).reduce((s,c) => s+count(c), 0);
        console.log(`  ✅ Mind map: ${count(mm)} nodes`);
      } catch (e) { console.error("  ❌ Mind map:", e.message); }
    }
  }

  zipFiles.push({ name: "manifest.json", content: JSON.stringify({
    version: PHYSIOAPP_EXTRACTOR_VERSION, notebookId,
    extractedAt: new Date().toISOString(),
    files: zipFiles.map(f => f.name),
  }, null, 2) });

  const zipBytes = buildZip(zipFiles);
  downloadZip(zipBytes, zipFilename);
  console.log(`\n✅ Downloaded: ${zipFilename} (${(zipBytes.length/1024).toFixed(1)} KB)`);
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

console.log("✅ PhysioApp Extractor loaded!");
console.log("   Run: physioApp.run()");
