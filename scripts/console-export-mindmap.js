// === PhysioApp Mind Map Exporter ===
// Paste this in the browser console while viewing a NotebookLM mind map.
// It extracts SVG node text and builds a tree structure.

(function() {
  const slug = prompt('Enter topic slug (e.g. cns-cerebellum):', 'cns-cerebellum');
  if (!slug) return;

  // Find SVG elements - check main page and iframes
  let svg = document.querySelector('svg');

  if (!svg) {
    // Try iframes
    document.querySelectorAll('iframe').forEach(iframe => {
      try {
        const s = iframe.contentDocument?.querySelector('svg');
        if (s) svg = s;
      } catch(e) {}
    });
  }

  if (!svg) {
    console.log('❌ No SVG mind map found. Make sure the mind map is visible on screen.');
    alert('No mind map SVG found. Make sure the mind map view is open.');
    return;
  }

  // Extract all text nodes from SVG with their positions
  const nodes = [];
  svg.querySelectorAll('text').forEach(t => {
    const text = t.textContent?.trim();
    if (!text || text === '+' || text === '-' || text === '…') return;

    // Get position via transform on parent g element
    let el = t.closest('g[transform]') || t.parentElement;
    let x = 0, y = 0;

    while (el && el !== svg) {
      const transform = el.getAttribute('transform') || '';
      const match = transform.match(/translate\(\s*([^,\s]+)[,\s]+([^)]+)\)/);
      if (match) {
        x += parseFloat(match[1]);
        y += parseFloat(match[2]);
      }
      el = el.parentElement;
    }

    nodes.push({ text, x: Math.round(x), y: Math.round(y) });
  });

  console.log(`Found ${nodes.length} text nodes in SVG`);
  console.log(nodes);

  if (nodes.length === 0) {
    alert('No text nodes found in the SVG.');
    return;
  }

  // Group by x-position (depth level) with tolerance
  nodes.sort((a, b) => a.x - b.x);

  const levels = [];
  let lastX = -Infinity;
  for (const n of nodes) {
    if (n.x - lastX > 80) {
      levels.push([]);
      lastX = n.x;
    }
    levels[levels.length - 1].push(n);
  }

  // Sort each level by y position
  levels.forEach(level => level.sort((a, b) => a.y - b.y));

  console.log(`Detected ${levels.length} depth levels`);
  levels.forEach((l, i) => console.log(`  Level ${i}: ${l.map(n => n.text).join(', ')}`));

  // Build tree
  function findChildren(parentY, levelIdx) {
    if (levelIdx >= levels.length) return undefined;

    const children = [];
    const nodesAtLevel = levels[levelIdx];

    // Find nodes at this level that are closest to the parent's Y
    // Group by proximity to parent
    for (const n of nodesAtLevel) {
      const child = { title: n.text };
      const grandchildren = findChildren(n.y, levelIdx + 1);
      if (grandchildren && grandchildren.length > 0) {
        child.children = grandchildren;
      }
      children.push(child);
    }

    return children.length > 0 ? children : undefined;
  }

  let tree;
  if (levels.length > 0 && levels[0].length > 0) {
    tree = {
      title: levels[0][0].text,
      children: []
    };

    if (levels.length > 1) {
      // Assign level-1 nodes as direct children of root
      tree.children = levels[1].map(n => {
        const child = { title: n.text };
        // For deeper levels, assign by Y-proximity
        if (levels.length > 2) {
          const subChildren = levels.slice(2).reduce((acc, level) => {
            // Simple: just add all remaining nodes flat for now
            // User can restructure if needed
            return acc;
          }, []);
        }
        return child;
      });

      // If there are 3+ levels, assign level-2 nodes to nearest level-1 parent by Y
      if (levels.length > 2) {
        for (const l2node of levels[2]) {
          // Find closest level-1 node by Y distance
          let closest = tree.children[0];
          let closestDist = Infinity;
          for (const l1 of tree.children) {
            const l1data = levels[1].find(n => n.text === l1.title);
            if (l1data) {
              const dist = Math.abs(l1data.y - l2node.y);
              if (dist < closestDist) {
                closestDist = dist;
                closest = l1;
              }
            }
          }
          if (!closest.children) closest.children = [];
          closest.children.push({ title: l2node.text });
        }
      }
    }
  } else {
    tree = { title: 'Root', children: nodes.map(n => ({ title: n.text })) };
  }

  const json = JSON.stringify(tree, null, 2);

  // Download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = slug + '-mindmap.json';
  a.click();
  URL.revokeObjectURL(url);

  console.log(`✅ Exported mind map to ${slug}-mindmap.json`);
  console.log('Tree structure:', tree);
  alert(`Exported mind map with ${nodes.length} nodes! Check your downloads folder.`);
})();
