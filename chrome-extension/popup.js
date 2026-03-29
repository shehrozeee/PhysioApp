const statusEl = document.getElementById('status');
const extractBtn = document.getElementById('extract-btn');

extractBtn.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url?.includes('notebooklm.google.com/notebook/')) {
      statusEl.textContent = 'Navigate to a NotebookLM notebook page first.';
      statusEl.className = 'status error';
      return;
    }

    statusEl.textContent = 'Step 1: Injecting extractor...';
    statusEl.className = 'status working';
    extractBtn.disabled = true;

    // Step 1: Inject the extractor script into MAIN world
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: 'MAIN',
        files: ['notebooklm_physioapp_extractor.js']
      });
    } catch (e) {
      statusEl.textContent = 'Inject failed: ' + e.message;
      statusEl.className = 'status error';
      extractBtn.disabled = false;
      return;
    }

    // Step 2: Check if physioApp loaded
    statusEl.textContent = 'Step 2: Checking extractor...';
    let checkResult;
    try {
      checkResult = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: 'MAIN',
        func: () => {
          return {
            loaded: typeof physioApp !== 'undefined',
            hasRun: typeof physioApp !== 'undefined' && typeof physioApp.run === 'function',
            keys: typeof physioApp !== 'undefined' ? Object.keys(physioApp) : [],
            error: null
          };
        }
      });
    } catch (e) {
      statusEl.textContent = 'Check failed: ' + e.message;
      statusEl.className = 'status error';
      extractBtn.disabled = false;
      return;
    }

    const check = checkResult?.[0]?.result;
    if (!check?.loaded) {
      statusEl.textContent = 'Extractor not loaded. The script may have a syntax error. Check F12 console on the NotebookLM page.';
      statusEl.className = 'status error';
      extractBtn.disabled = false;
      return;
    }

    // Step 3: Run extraction
    statusEl.textContent = 'Step 3: Extracting (may take 30s)...';

    // Use title signaling since async results don't serialize well
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: 'MAIN',
        func: () => {
          physioApp.run()
            .then(r => { document.title = 'PHYSIOAPP_DONE:' + (r.files||[]).join(','); })
            .catch(e => { document.title = 'PHYSIOAPP_ERR:' + e.message; });
        }
      });
    } catch (e) {
      statusEl.textContent = 'Run failed: ' + e.message;
      statusEl.className = 'status error';
      extractBtn.disabled = false;
      return;
    }

    // Poll title for result
    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      try {
        const r = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => document.title
        });
        const title = r?.[0]?.result || '';
        if (title.startsWith('PHYSIOAPP_DONE:')) {
          clearInterval(poll);
          const files = title.replace('PHYSIOAPP_DONE:', '');
          statusEl.textContent = 'Done! Files: ' + (files || 'check downloads');
          statusEl.className = 'status success';
          extractBtn.disabled = false;
        } else if (title.startsWith('PHYSIOAPP_ERR:')) {
          clearInterval(poll);
          statusEl.textContent = title.replace('PHYSIOAPP_ERR:', '');
          statusEl.className = 'status error';
          extractBtn.disabled = false;
        } else if (attempts > 90) {
          clearInterval(poll);
          statusEl.textContent = 'Timed out after 90s. Check F12 console.';
          statusEl.className = 'status error';
          extractBtn.disabled = false;
        }
      } catch (e) {}
    }, 1000);

  } catch (err) {
    statusEl.textContent = 'Error: ' + err.message;
    statusEl.className = 'status error';
    extractBtn.disabled = false;
  }
});
