// PhysioApp Exporter - Content Script
// Runs in ALL frames (main page + iframes) on notebooklm.google.com
// Extracts quiz/flashcard data from data-app-data attribute (same as NotebookLM2Anki)
// Extracts mind map data from SVG d3.js nodes

(function () {
  'use strict';

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'detect') {
      sendResponse(detectContent());
    } else if (request.action === 'extract') {
      sendResponse(extractContent(request.type));
    }
    return true;
  });

  // === HTML ENTITY UNESCAPING ===
  function unescapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/");
  }

  // === GET APP DATA FROM data-app-data ATTRIBUTE ===
  function getAppData() {
    // Look for the data-app-data attribute on any element
    const el = document.querySelector('[data-app-data]');
    if (!el) return null;

    const raw = el.getAttribute('data-app-data');
    if (!raw) return null;

    try {
      const cleaned = unescapeHtml(raw);
      return JSON.parse(cleaned);
    } catch (e) {
      console.log('[PhysioApp] Failed to parse data-app-data:', e.message);
      return null;
    }
  }

  // === DETECTION ===
  function detectContent() {
    const data = getAppData();
    const result = {
      types: [],
      title: '',
      hasData: !!data,
      isIframe: window !== window.top,
      url: window.location.href
    };

    // Get title from main page
    if (window === window.top) {
      const titleInput = document.querySelector('input[placeholder="Notebook title"]');
      result.title = titleInput?.value ||
        document.title.replace(' - NotebookLM', '').trim() || '';
    }

    if (data) {
      // Quiz
      const quiz = data.quiz || data.mostRecentQuery?.quiz || [];
      if (Array.isArray(quiz) && quiz.length > 0) {
        result.types.push('quiz');
        result.quizCount = quiz.length;
      }

      // Flashcards
      const fc = data.flashcards || [];
      if (Array.isArray(fc) && fc.length > 0) {
        result.types.push('flashcards');
        result.flashcardCount = fc.length;
      }
    }

    // Mind map (SVG-based, check for d3 nodes)
    let mindmapNodes = 0;
    document.querySelectorAll('svg').forEach(svg => {
      const count = svg.querySelectorAll('g.node').length;
      if (count > mindmapNodes) mindmapNodes = count;
    });
    if (mindmapNodes > 0) {
      result.types.push('mindmap');
      result.mindmapNodes = mindmapNodes;
    }

    return result;
  }

  // === EXTRACTION ===
  function extractContent(type) {
    switch (type) {
      case 'quiz': return extractQuiz();
      case 'flashcards': return extractFlashcards();
      case 'mindmap': return extractMindMap();
      default: return { error: 'Unknown type' };
    }
  }

  function extractQuiz() {
    const data = getAppData();
    if (!data) {
      return { error: 'No data-app-data found in this frame. Open a quiz in NotebookLM and try again.' };
    }

    const quizData = data.quiz || data.mostRecentQuery?.quiz || [];
    if (!Array.isArray(quizData) || quizData.length === 0) {
      return { error: 'No quiz questions found in the data. Make sure a quiz is open.' };
    }

    const questions = quizData.map((q, i) => {
      const options = (q.answerOptions || []).map(opt => opt.text || '');
      const correctIdx = (q.answerOptions || []).findIndex(opt => !!opt.isCorrect);

      return {
        id: i + 1,
        question: q.question || '',
        options: options,
        correct: correctIdx >= 0 ? correctIdx : 0,
        hint: q.hint || ''
      };
    });

    return { questions, _meta: { count: questions.length, source: 'data-app-data' } };
  }

  function extractFlashcards() {
    const data = getAppData();
    if (!data) {
      return { error: 'No data-app-data found in this frame. Open flashcards in NotebookLM and try again.' };
    }

    const flashcards = data.flashcards || [];
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      return { error: 'No flashcards found in the data. Make sure flashcards are open.' };
    }

    const cards = flashcards.map((card, i) => ({
      id: i + 1,
      question: card.f || '',
      answer: card.b || ''
    }));

    return { cards, _meta: { count: cards.length, source: 'data-app-data' } };
  }

  function extractMindMap() {
    // Find SVG with most nodes
    let mainSvg = null;
    let maxNodes = 0;
    document.querySelectorAll('svg').forEach(svg => {
      const count = svg.querySelectorAll('g.node').length;
      if (count > maxNodes) { maxNodes = count; mainSvg = svg; }
    });

    if (!mainSvg) {
      return { error: 'No mind map SVG found. Open a mind map in NotebookLM and try again.' };
    }

    // Try d3.js __data__ approach (most accurate)
    const firstNodeG = mainSvg.querySelector('g.node');
    if (firstNodeG && firstNodeG.__data__) {
      // Walk up to root
      let root = firstNodeG.__data__;
      while (root.parent) root = root.parent;

      const tree = buildTreeFromD3(root, 0, new Set());
      if (tree) {
        tree._meta = { count: countNodes(tree), method: 'd3-data' };
        return tree;
      }
    }

    // Fallback: read text positions from SVG
    return extractMindMapFromPositions(mainSvg);
  }

  function buildTreeFromD3(node, depth, visited) {
    if (depth > 50 || !node) return null;

    const name = node.data?.name || node.name || node.text || '';
    const id = name + depth;
    if (visited.has(id)) return null;
    visited.add(id);

    const result = { title: name.trim() };
    const children = node.children || node._children || [];

    if (Array.isArray(children) && children.length > 0) {
      const cleaned = children
        .map(c => buildTreeFromD3(c, depth + 1, new Set(visited)))
        .filter(Boolean);
      if (cleaned.length > 0) result.children = cleaned;
    }

    return result;
  }

  function extractMindMapFromPositions(svg) {
    const textNodes = [];
    svg.querySelectorAll('text').forEach(t => {
      const text = t.textContent?.trim();
      if (!text || text === '+' || text === '-' || text === '…') return;

      let x = 0, y = 0;
      let el = t.closest('g[transform]') || t.parentElement;
      while (el && el !== svg) {
        const m = (el.getAttribute('transform') || '').match(/translate\(\s*([^,\s]+)[,\s]+([^)]+)\)/);
        if (m) { x += parseFloat(m[1]); y += parseFloat(m[2]); }
        el = el.parentElement;
      }
      textNodes.push({ text, x: Math.round(x), y: Math.round(y) });
    });

    if (textNodes.length === 0) return { error: 'No text nodes found in SVG' };

    textNodes.sort((a, b) => a.x - b.x);

    // Group by x position into levels
    const levels = [];
    let lastX = -Infinity;
    for (const n of textNodes) {
      if (n.x - lastX > 80) { levels.push([]); lastX = n.x; }
      levels[levels.length - 1].push(n);
    }
    levels.forEach(l => l.sort((a, b) => a.y - b.y));

    // Build simple tree
    const root = { title: levels[0]?.[0]?.text || 'Root', children: [] };
    if (levels.length > 1) {
      root.children = levels[1].map(n => {
        const child = { title: n.text };
        if (levels.length > 2) {
          // Assign level-2 nodes to nearest level-1 by Y proximity
          child.children = [];
        }
        return child;
      });

      // Assign deeper levels by Y proximity
      if (levels.length > 2) {
        for (const l2node of levels[2]) {
          let closest = root.children[0];
          let closestDist = Infinity;
          for (const l1 of root.children) {
            const l1data = levels[1].find(n => n.text === l1.title);
            if (l1data) {
              const dist = Math.abs(l1data.y - l2node.y);
              if (dist < closestDist) { closestDist = dist; closest = l1; }
            }
          }
          if (closest) {
            if (!closest.children) closest.children = [];
            closest.children.push({ title: l2node.text });
          }
        }
      }
    }

    root._meta = { count: textNodes.length, method: 'svg-positions' };
    return root;
  }

  function countNodes(node) {
    let c = 1;
    if (node.children) node.children.forEach(n => { c += countNodes(n); });
    return c;
  }
})();
