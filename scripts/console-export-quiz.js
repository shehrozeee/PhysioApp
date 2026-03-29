// === PhysioApp Quiz Exporter ===
// Paste this in the browser console while viewing a NotebookLM quiz.
// It will extract all visible text and try to parse quiz questions.
// Then it downloads a JSON file.

(function() {
  const slug = prompt('Enter topic slug (e.g. cns-cerebellum):', 'cns-cerebellum');
  if (!slug) return;

  // Grab ALL visible text from the page and all iframes
  let allText = document.body.innerText || '';

  // Try to access iframe content too
  document.querySelectorAll('iframe').forEach(iframe => {
    try {
      const iframeText = iframe.contentDocument?.body?.innerText || '';
      allText += '\n' + iframeText;
    } catch(e) {
      console.log('Cannot access iframe (cross-origin):', e.message);
    }
  });

  console.log('=== RAW TEXT FOUND ===');
  console.log(allText.substring(0, 2000));
  console.log('=== END PREVIEW (total chars: ' + allText.length + ') ===');

  // Parse questions - look for lines ending with ?
  const lines = allText.split('\n').map(l => l.trim()).filter(l => l);
  const questions = [];
  let currentQ = null;
  let currentOpts = [];
  let id = 0;

  for (const line of lines) {
    // Question line
    if (line.endsWith('?') && line.length > 15) {
      if (currentQ && currentOpts.length >= 2) {
        id++;
        questions.push({
          id,
          question: currentQ,
          options: currentOpts.slice(0, 4),
          correct: 0,
          hint: ''
        });
      }
      currentQ = line;
      currentOpts = [];
      continue;
    }

    // Option line (A. B. C. D.)
    const optMatch = line.match(/^([A-D])\.?\s+(.+)/);
    if (optMatch) {
      currentOpts.push(optMatch[2]);
      continue;
    }

    // Also try without letter prefix - just numbered or plain lines after a question
    if (currentQ && currentOpts.length < 4 && line.length > 3 && line.length < 200 && !line.endsWith('?')) {
      // Could be an option without A/B/C/D prefix
    }
  }

  // Last question
  if (currentQ && currentOpts.length >= 2) {
    id++;
    questions.push({
      id,
      question: currentQ,
      options: currentOpts.slice(0, 4),
      correct: 0,
      hint: ''
    });
  }

  if (questions.length === 0) {
    console.log('❌ No questions found. The quiz content might be in an iframe that is cross-origin protected.');
    console.log('Try this: click on the quiz area first, then run the script again.');
    console.log('Or try switching to the iframe context in DevTools (dropdown at top of console that says "top").');
    alert('No questions found. Check the console for details.');
    return;
  }

  const data = { questions };
  const json = JSON.stringify(data, null, 2);

  // Download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = slug + '-quiz.json';
  a.click();
  URL.revokeObjectURL(url);

  console.log(`✅ Exported ${questions.length} questions to ${slug}-quiz.json`);
  console.log('⚠️ Note: "correct" field is set to 0 (first option) for all questions. You need to verify the correct answers.');
  alert(`Exported ${questions.length} questions! Check your downloads folder.`);
})();
