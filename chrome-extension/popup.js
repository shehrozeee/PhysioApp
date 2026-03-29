const statusEl = document.getElementById('status');
const buttonsEl = document.getElementById('buttons');
const slugSection = document.getElementById('slug-section');
const slugInput = document.getElementById('slug');
const detailsEl = document.getElementById('details');

async function detectContent() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url?.includes('notebooklm.google.com')) {
      statusEl.textContent = 'Open NotebookLM first, then click this extension.';
      statusEl.className = 'status error';
      return;
    }

    const results = await chrome.tabs.sendMessage(tab.id, { action: 'detect' });

    if (!results) {
      statusEl.textContent = 'Could not connect. Try refreshing the NotebookLM page.';
      statusEl.className = 'status error';
      return;
    }

    if (!results.hasData && results.types.length === 0) {
      statusEl.textContent = 'No data-app-data found. Open a quiz, flashcard, or mind map in NotebookLM first.';
      statusEl.className = 'status error';
      return;
    }

    // Show what we found
    const found = [];
    if (results.types.includes('quiz')) found.push(`Quiz (${results.quizCount} questions)`);
    if (results.types.includes('flashcards')) found.push(`Flashcards (${results.flashcardCount} cards)`);
    if (results.types.includes('mindmap')) found.push('Mind Map');

    if (found.length > 0) {
      statusEl.textContent = 'Found: ' + found.join(', ');
      statusEl.className = 'status success';
    } else {
      statusEl.textContent = 'Connected to NotebookLM but no quiz/flashcard/mindmap detected. Open one first.';
      statusEl.className = 'status';
    }

    // Auto-slug from title
    slugSection.style.display = 'block';
    if (results.title) {
      slugInput.value = results.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 40);
    }

    // Show export buttons for detected types
    results.types.forEach(type => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-' + type;
      btn.innerHTML = getButtonLabel(type, results);
      btn.addEventListener('click', () => exportData(tab.id, type));
      buttonsEl.appendChild(btn);
    });

    // Show "try anyway" buttons for types not detected
    const allTypes = ['quiz', 'flashcards', 'mindmap'];
    const missing = allTypes.filter(t => !results.types.includes(t));
    if (missing.length > 0 && results.hasData) {
      missing.forEach(type => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-try';
        btn.textContent = 'Try: Export ' + type;
        btn.addEventListener('click', () => exportData(tab.id, type));
        buttonsEl.appendChild(btn);
      });
    }

  } catch (err) {
    statusEl.textContent = 'Error: ' + err.message + '. Try refreshing the page.';
    statusEl.className = 'status error';
  }
}

function getButtonLabel(type, results) {
  switch(type) {
    case 'quiz': return `Export Quiz (${results.quizCount || '?'} Qs)`;
    case 'flashcards': return `Export Flashcards (${results.flashcardCount || '?'})`;
    case 'mindmap': return 'Export Mind Map';
    default: return 'Export ' + type;
  }
}

async function exportData(tabId, type) {
  const slug = slugInput.value.trim() || 'untitled';

  statusEl.textContent = `Extracting ${type}...`;
  statusEl.className = 'status detecting';

  try {
    const data = await chrome.tabs.sendMessage(tabId, { action: 'extract', type });

    if (data.error) {
      statusEl.textContent = data.error;
      statusEl.className = 'status error';
      return;
    }

    // Remove _meta before downloading
    const count = data._meta?.count || data.cards?.length || data.questions?.length || '?';
    delete data._meta;

    const filename = `${slug}-${type}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    statusEl.textContent = `Exported ${count} items → ${filename}`;
    statusEl.className = 'status success';
  } catch (err) {
    statusEl.textContent = `Failed: ${err.message}`;
    statusEl.className = 'status error';
  }
}

detectContent();
