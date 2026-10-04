/* =========================================================
   LANGUAGE HELP — Granny Flat Checklist
   1. "Read in" links: opens the page through Google Translate
      as a reading copy. Answers are only saved on the English page.
   2. Glossary: key building terms get a dotted underline; tap to
      see the term in Chinese, Punjabi or Hindi.
   The checklist itself and the PDF record stay in English.
   GLOSSARY TRANSLATIONS ARE DRAFTS — have a bilingual building
   practitioner review each one before relying on it.
   ========================================================= */
(function () {
  const LANGS = [
    { code: 'zh', gt: 'zh-CN', label: '中文' },
    { code: 'pa', gt: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'hi', gt: 'hi', label: 'हिन्दी' }
  ];

  // Longer phrases first so "saddle flashing" wins over "flashing".
  const GLOSSARY = [
    { t: ['damp proof membrane', 'damp-proof membrane', 'DPM'], en: 'Plastic sheet under the slab that stops ground moisture rising.', zh: '防潮膜', pa: 'ਨਮੀ-ਰੋਕੂ ਝਿੱਲੀ', hi: 'नमी-रोधी झिल्ली' },
    { t: ['compaction certificate'], en: 'Engineer’s confirmation that deep fill has been compacted properly.', zh: '压实证书', pa: 'ਕੰਪੈਕਸ਼ਨ ਸਰਟੀਫਿਕੇਟ', hi: 'संघनन प्रमाणपत्र' },
    { t: ['saddle flashing'], en: 'Shaped flashing where a beam or joist passes through the wall.', zh: '鞍形泛水板', pa: 'ਸੈਡਲ ਫਲੈਸ਼ਿੰਗ', hi: 'सैडल फ्लैशिंग' },
    { t: ['boundary peg', 'boundary pegs'], en: 'Surveyor’s marker at a legal boundary corner.', zh: '地界桩', pa: 'ਹੱਦ ਦਾ ਖੂੰਟਾ', hi: 'सीमा खूंटा' },
    { t: ['building wrap'], en: 'Breathable sheet over the framing that sheds water.', zh: '建筑防水透气膜', pa: 'ਬਿਲਡਿੰਗ ਰੈਪ (ਪਾਣੀ-ਰੋਕੂ ਪਰਤ)', hi: 'बिल्डिंग रैप (जलरोधी परत)' },
    { t: ['cavity batten', 'cavity battens', 'battens'], en: 'Timber strips that hold cladding off the wrap, leaving a drainage gap.', zh: '空腔板条', pa: 'ਕੈਵਿਟੀ ਬੈਟਨ', hi: 'कैविटी बैटन' },
    { t: ['bottom plate'], en: 'Horizontal timber at the base of a wall frame.', zh: '墙底梁板', pa: 'ਹੇਠਲੀ ਪਲੇਟ', hi: 'निचली प्लेट' },
    { t: ['top plate'], en: 'Horizontal timber along the top of a wall frame.', zh: '墙顶梁板', pa: 'ਉਪਰਲੀ ਪਲੇਟ', hi: 'ऊपरी प्लेट' },
    { t: ['studs', 'stud'], en: 'Vertical timbers in a wall frame.', zh: '立柱龙骨', pa: 'ਸਟੱਡ (ਖੜ੍ਹੀ ਲੱਕੜ)', hi: 'स्टड (खड़ी लकड़ी)' },
    { t: ['lintels', 'lintel'], en: 'Beam over a window or door opening.', zh: '过梁', pa: 'ਲਿੰਟਲ (ਖਿੜਕੀ/ਦਰਵਾਜ਼ੇ ਉੱਤੇ ਸ਼ਤੀਰ)', hi: 'लिंटल (खिड़की/दरवाज़े के ऊपर बीम)' },
    { t: ['trusses', 'truss'], en: 'Factory-made triangular roof frames.', zh: '屋架桁架', pa: 'ਟਰੱਸ (ਛੱਤ ਦਾ ਢਾਂਚਾ)', hi: 'ट्रस (छत का ढांचा)' },
    { t: ['bracing'], en: 'Wall or roof elements that resist wind and earthquake loads.', zh: '抗侧支撑', pa: 'ਬ੍ਰੇਸਿੰਗ', hi: 'ब्रेसिंग' },
    { t: ['flashings', 'flashing'], en: 'Shaped metal or tape that directs water away from joins.', zh: '泛水板', pa: 'ਫਲੈਸ਼ਿੰਗ', hi: 'फ्लैशिंग' },
    { t: ['cladding'], en: 'The outside wall covering.', zh: '外墙覆面', pa: 'ਕਲੈਡਿੰਗ (ਬਾਹਰੀ ਕੰਧ ਪਰਤ)', hi: 'क्लैडिंग (बाहरी दीवार परत)' },
    { t: ['hardfill'], en: 'Compacted crushed rock under the slab.', zh: '碎石垫层', pa: 'ਹਾਰਡਫਿਲ (ਦੱਬਿਆ ਪੱਥਰ)', hi: 'हार्डफिल (दबाया पत्थर)' },
    { t: ['starters'], en: 'Steel bars left sticking up to tie the next pour or wall in.', zh: '预留插筋', pa: 'ਸਟਾਰਟਰ ਸਰੀਏ', hi: 'स्टार्टर सरिया' },
    { t: ['mesh'], en: 'Steel reinforcing grid set in the concrete.', zh: '钢筋网', pa: 'ਸਰੀਏ ਦਾ ਜਾਲ', hi: 'सरिया जाल' },
    { t: ['good ground'], en: 'Soil strong enough for NZS 3604 foundations (300 kPa).', zh: '合格地基土', pa: 'ਮਜ਼ਬੂਤ ਜ਼ਮੀਨ', hi: 'मज़बूत ज़मीन' },
    { t: ['piles'], en: 'Posts or columns set into the ground to carry the floor.', zh: '桩', pa: 'ਪਾਈਲ (ਥੰਮ੍ਹ)', hi: 'पाइल (खंभे)' },
    { t: ['insulation'], en: 'Material in walls, roof and floor that keeps heat in.', zh: '保温隔热材料', pa: 'ਇਨਸੂਲੇਸ਼ਨ', hi: 'इन्सुलेशन' },
    { t: ['smoke alarms', 'smoke alarm'], en: 'Required alarm that sounds when it detects smoke.', zh: '烟雾报警器', pa: 'ਧੂੰਏਂ ਦਾ ਅਲਾਰਮ', hi: 'धुआं अलार्म' },
    { t: ['Record of Work'], en: 'LBP’s form telling council what restricted work they did.', zh: '工作记录', pa: 'ਕੰਮ ਦਾ ਰਿਕਾਰਡ', hi: 'कार्य रिकॉर्ड' },
    { t: ['PIM'], en: 'Project Information Memorandum from council about the site.', zh: '项目信息备忘录', pa: 'ਪ੍ਰੋਜੈਕਟ ਜਾਣਕਾਰੀ ਮੈਮੋ', hi: 'परियोजना सूचना ज्ञापन' },
    { t: ['PS4'], en: 'Engineer’s statement that construction matched the design.', zh: '施工审查声明（PS4）', pa: 'ਉਸਾਰੀ ਸਮੀਖਿਆ ਬਿਆਨ (PS4)', hi: 'निर्माण समीक्षा कथन (PS4)' },
    { t: ['LBP'], en: 'Licensed Building Practitioner.', zh: '持牌建筑从业者', pa: 'ਲਾਇਸੈਂਸਸ਼ੁਦਾ ਬਿਲਡਿੰਗ ਪ੍ਰੈਕਟੀਸ਼ਨਰ', hi: 'लाइसेंसशुदा बिल्डिंग प्रैक्टिशनर' },
    { t: ['STOP'], en: 'Do not carry on until this is sorted.', zh: '停止——解决后再继续', pa: 'ਰੁਕੋ — ਹੱਲ ਹੋਣ ਤੱਕ ਅੱਗੇ ਨਾ ਵਧੋ', hi: 'रुकें — हल होने तक आगे न बढ़ें' }
  ];

  const translated = /translate\.goog$/.test(location.hostname);
  const KEY = 'gfc_lang';
  let lang = 'zh';
  try { lang = localStorage.getItem(KEY) || lang; } catch (e) {}

  const css = document.createElement('style');
  css.textContent =
    '.langbar{background:#fff;border-bottom:1px solid var(--line);font-size:14px}' +
    '.langbar .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;padding:8px 16px}' +
    '.langbar a{font-weight:600}' +
    '.langbar .lb-note{color:var(--muted);font-size:13px}' +
    '.langbar select{font:inherit;font-size:14px;padding:2px 6px;border:1px solid var(--line);border-radius:6px;background:#fff}' +
    '.gl{all:unset;cursor:help;text-decoration:underline dotted var(--green);text-underline-offset:3px}' +
    '.gl:focus-visible{outline:2px solid var(--green);outline-offset:2px}' +
    '.glpop{position:absolute;z-index:20;max-width:280px;background:#fff;border:1px solid var(--line);border-left:4px solid var(--green);border-radius:8px;padding:10px 12px;box-shadow:0 6px 20px rgba(0,0,0,.12);font-size:15px;line-height:1.4}' +
    '.glpop .tr{font-size:19px;font-weight:600;color:var(--green);margin:2px 0}' +
    '.glpop .def{color:var(--muted);font-size:13px;margin:4px 0 0}';
  document.head.appendChild(css);

  // ---- Language bar ----
  const bar = document.createElement('div');
  bar.className = 'langbar';
  const header = document.querySelector('header.top');
  if (translated) {
    const home = 'https://grannyflatchecklist.nz' + location.pathname;
    bar.innerHTML = '<div class="wrap"><span>This is a translated reading copy. Answers are not saved here. ' +
      '<a href="' + home + '">Fill in the checklist on the English page →</a></span></div>';
  } else {
    const links = LANGS.map(l => '<a href="https://grannyflatchecklist-nz.translate.goog' + location.pathname +
      '?_x_tr_sl=en&_x_tr_tl=' + l.gt + '&_x_tr_hl=en" target="_blank" rel="noopener" lang="' + l.code + '">' + l.label + '</a>').join(' · ');
    const sel = '<label>Glossary: <select id="gl-lang">' + LANGS.map(l => '<option value="' + l.code + '"' + (l.code === lang ? ' selected' : '') + '>' + l.label + '</option>').join('') + '</select></label>';
    bar.innerHTML = '<div class="wrap"><span>Read in ' + links + '</span>' + sel +
      '<span class="lb-note">Tap underlined words for a draft translation. Checklist and PDF stay in English.</span></div>';
  }
  if (header) header.insertAdjacentElement('afterend', bar);
  if (translated) return;

  const selEl = document.getElementById('gl-lang');
  if (selEl) selEl.addEventListener('change', () => { lang = selEl.value; try { localStorage.setItem(KEY, lang); } catch (e) {} closePop(); });

  // ---- Glossary marking ----
  const map = {};
  const terms = [];
  GLOSSARY.forEach((g, i) => g.t.forEach(t => { map[t.toLowerCase()] = i; terms.push(t); }));
  terms.sort((a, b) => b.length - a.length);
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Acronyms (DPM, LBP, STOP) are only marked when written in capitals.
  const re = new RegExp('\\b(' + terms.map(esc).join('|') + ')\\b', 'gi');
  const SCOPE = 'legend, .hint, .next p, .lead, .callout';

  function mark(root) {
    root.querySelectorAll(SCOPE).forEach(block => {
      if (block.dataset.gl) return;
      block.dataset.gl = '1';
      const seen = new Set();
      const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
        acceptNode: n => n.parentElement.closest('a, button, input, label.opt, .gl') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const text = node.nodeValue;
        re.lastIndex = 0;
        if (!re.test(text)) return;
        re.lastIndex = 0;
        const frag = document.createDocumentFragment();
        let last = 0, m, changed = false;
        while ((m = re.exec(text))) {
          const word = m[0];
          const idx = map[word.toLowerCase()];
          const acr = GLOSSARY[idx] && GLOSSARY[idx].t.some(t => t === t.toUpperCase() && t.toLowerCase() === word.toLowerCase());
          if (idx === undefined || seen.has(idx) || (acr && word !== word.toUpperCase())) continue;
          seen.add(idx);
          frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          const b = document.createElement('button');
          b.type = 'button'; b.className = 'gl'; b.dataset.g = idx; b.textContent = word;
          frag.appendChild(b);
          last = m.index + word.length; changed = true;
        }
        if (!changed) return;
        frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      });
    });
  }

  let pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  document.addEventListener('click', e => {
    const b = e.target.closest('.gl');
    if (!b) { if (!e.target.closest('.glpop')) closePop(); return; }
    e.preventDefault(); e.stopPropagation();
    closePop();
    const g = GLOSSARY[+b.dataset.g];
    const L = LANGS.find(l => l.code === lang) || LANGS[0];
    pop = document.createElement('div');
    pop.className = 'glpop'; pop.setAttribute('role', 'dialog');
    pop.innerHTML = '<strong>' + g.t[0] + '</strong><div class="tr" lang="' + L.code + '">' + g[L.code] + '</div><p class="def">' + g.en + '</p>' +
      '<p class="def"><a href="mailto:contact@grannyflatchecklist.nz?subject=' + encodeURIComponent('Translation suggestion: ' + g.t[0] + ' (' + L.label + ')') +
      '&body=' + encodeURIComponent('Term: ' + g.t[0] + '\nCurrent ' + L.label + ': ' + g[L.code] + '\nPage: ' + location.pathname + '\n\nBetter wording:\n') + '">Suggest a better translation</a></p>';
    document.body.appendChild(pop);
    const r = b.getBoundingClientRect();
    const left = Math.max(8, Math.min(r.left + scrollX, scrollX + document.documentElement.clientWidth - pop.offsetWidth - 8));
    pop.style.left = left + 'px';
    pop.style.top = (r.bottom + scrollY + 6) + 'px';
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });

  const main = document.getElementById('main');
  if (main) {
    mark(main);
    new MutationObserver(() => { closePop(); mark(main); }).observe(main, { childList: true, subtree: true });
  }
})();
