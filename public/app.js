const $ = (id) => document.getElementById(id);
const storedLang = localStorage.getItem('optiplan_lang');
let currentLang = storedLang === 'en' ? 'en' : 'ka';

const i18n = {
  ka: {
    navFeatures: 'ფუნქციები', navLabs: 'ლაბორატორია', navAI: 'AI',
    heroEyebrowText: 'ეკონომიკური ამოცანები • წარმოებულები • AI',
    heroTitle: 'სკოლის აპლიკაცია, მაგრამ უკვე ', heroTitleAccent: 'რეალური ვებსაიტის დონეზე',
    heroText: 'თანამედროვე, ანიმაციური და სრულად ქართულენოვანი პლატფორმა ეკონომიკური ოპტიმიზაციისთვის. გამოიყენე ჩაშენებული მოდელები, ავტომატური ამომცნობი და AI ასისტენტი.',
    heroStartBtn: 'დაიწყე ახლა', healthBtn: 'სერვერის შემოწმება', healthStatusIdle: 'სტატუსი: ჯერ არ შემოწმებულა', heroMiniLabel: 'ოპტიმიზაცია რეალურ დროში',
    metricSolverNote: 'სპეციალური მოდელი', metricAINote: 'ჩაშენებული ასისტენტი', metricLangNote: 'ქართულად', metricDesignNote: 'სცენური ვიზუალი',
    terminal1: '> ფასი → მოთხოვნა → შემოსავალი', terminal2: '> ლოგისტიკა → მინიმალური ხარჯი', terminal3: '> ყვავილნარი → მინიმალური ღობე',
    featuresEyebrow: 'რატომ ეს ვერსია?', featuresTitle: 'ეს უკვე უბრალოდ “ფორმა” აღარ არის — ესაა სრული პროდუქტივით აწყობილი გამოცდილება.',
    labsEyebrow: 'ინტერაქტიული ლაბორატორია', labsTitle: 'სამი კონკრეტული ოპტიმიზაციის ამოცანა — ერთი ძლიერი ინტერფეისით.',
    tabBtnPricing: 'ფასის ოპტიმიზაცია', tabBtnLogistics: 'ლოგისტიკა', tabBtnFlowerbeds: 'ყვავილნარი',
    pricingTitle: 'ფასის ოპტიმიზაცია კონკურენტებთან', logisticsTitle: 'ლოგისტიკის მინიმალური ხარჯი', flowerTitle: 'ყვავილნარის მინიმალური ღობე',
    solveBtn: 'გამოთვლა',
    aiEyebrow: 'AI ბლოკი', aiTitle: 'ორი რეჟიმი: პირდაპირი AI ასისტენტი და სიტყვიერი ამოცანის ავტომატური ამომცნობი.',
    assistantCardTitle: 'AI ასისტენტი', extractorCardTitle: 'AI მოდელის ამომცნობი',
    aiPromptPlaceholder: 'დაწერე ეკონომიკური ან მათემატიკური კითხვა... მაგალითად: იპოვე f(x)=x^2+4x+1 ფუნქციის მინიმუმი.',
    extractPromptPlaceholder: 'ჩასვი სიტყვიერი ამოცანა, მაგალითად: ქარხანა რკინიგზიდან 8 კმ-ზეა...',
    aiChatBtn: 'AI პასუხი', extractBtn: 'ამოცანის ამოცნობა',
    aiOutputIdle: 'აქ გამოჩნდება AI პასუხი.', extractOutputIdle: 'აქ გამოჩნდება ამოცნობილი მოდელი და გამოთვლილი შედეგი.',
    loadingAI: 'AI ფიქრობს...', loadingExtract: 'მიმდინარეობს ტექსტის ანალიზი...',
    error: 'შეცდომა',
    healthChecking: 'სტატუსი: მოწმდება...', healthReady: (m)=>`სტატუსი: სერვერი მზადაა • მოდელი: ${m}`, healthMissing: 'სტატუსი: სერვერი მუშაობს, მაგრამ OPENAI_API_KEY არ არის მითითებული', healthError: (e)=>`სტატუსი: შეცდომა — ${e}`,
    pricingCalc: 'ითვლება...', pricingSearch: 'მიმდინარეობს საუკეთესო ფასის ძიება.', pricingResultTitle: 'ფასის ოპტიმიზაციის შედეგი',
    bestPrice: 'საუკეთესო ფასი', expectedDemand: 'მოსალოდნელი მოთხოვნა', maxRevenue: 'მაქსიმალური შემოსავალი', avgMarket: 'ბაზრის საშუალო ფასი', notSpecified: 'არ არის მითითებული',
    logisticsCalc: 'ითვლება...', logisticsSearch: 'მიმდინარეობს მინიმალური ხარჯის გამოთვლა.', logisticsResultTitle: 'ლოგისტიკის შედეგი',
    optimalX: 'ოპტიმალური x', totalCost: 'მთლიანი ხარჯი', roadDist: 'სახმელეთო მანძილი', railDist: 'რკინიგზის მანძილი', roadCost: 'სახმელეთო ხარჯი', railCost: 'რკინიგზის ხარჯი',
    flowerCalc: 'ითვლება...', flowerSearch: 'მიმდინარეობს ოპტიმალური ზომების გამოთვლა.', flowerResultTitle: 'ყვავილნარის შედეგი', optimalY: 'ოპტიმალური y', minFence: 'მინიმალური ღობე', layout: 'განლაგება',
    extractorModel: 'ამოცნობილი მოდელი', extractorReasoning: 'AI ახსნა', extractorQuestions: 'დამატებითი კითხვები', extractorResult: 'გამოთვლილი შედეგი', noQuestions: 'არ არის საჭირო.', noResult: 'შედეგი ვერ მოიძებნა.',
    typingTexts: ['შემოსავლის ოპტიმიზაცია ონლაინ', 'წარმოებულებზე დაფუძნებული ამოხსნა აქტიურია', 'AI ამომცნობი მზადაა'],
    footerLine1: 'OptiPlan — ქართული ეკონომიკური ოპტიმიზაციის პლატფორმა', footerLine2: 'შექმნილია პრეზენტაციისთვის და კონკურსისთვის.'
  },
  en: {
    navFeatures: 'Features', navLabs: 'Lab', navAI: 'AI',
    heroEyebrowText: 'Economic problems • derivatives • AI',
    heroTitle: 'A school application, now at the level of a ', heroTitleAccent: 'real website',
    heroText: 'A modern, animated platform for economic optimization with built-in models, a word-problem extractor, and an AI assistant.',
    heroStartBtn: 'Start now', healthBtn: 'Check server', healthStatusIdle: 'Status: not checked yet', heroMiniLabel: 'Real-time optimization',
    metricSolverNote: 'specialized models', metricAINote: 'built-in assistant', metricLangNote: 'bilingual UI', metricDesignNote: 'cinematic design',
    terminal1: '> price → demand → revenue', terminal2: '> logistics → minimum cost', terminal3: '> flowerbeds → minimum fence',
    featuresEyebrow: 'Why this version?', featuresTitle: 'This is no longer just a “form” — it feels like a complete product.',
    labsEyebrow: 'Interactive lab', labsTitle: 'Three optimization problems in one strong interface.',
    tabBtnPricing: 'Pricing', tabBtnLogistics: 'Logistics', tabBtnFlowerbeds: 'Flowerbeds',
    pricingTitle: 'Pricing optimization with competitors', logisticsTitle: 'Minimum logistics cost', flowerTitle: 'Minimum fence for flowerbeds',
    solveBtn: 'Calculate',
    aiEyebrow: 'AI block', aiTitle: 'Two modes: a direct AI assistant and an automatic word-problem extractor.',
    assistantCardTitle: 'AI Assistant', extractorCardTitle: 'AI Model Extractor',
    aiPromptPlaceholder: 'Write an economics or math question... for example: find the minimum of f(x)=x^2+4x+1.',
    extractPromptPlaceholder: 'Paste a word problem, for example: a factory is 8 km away from the railway...',
    aiChatBtn: 'AI answer', extractBtn: 'Detect problem',
    aiOutputIdle: 'The AI answer will appear here.', extractOutputIdle: 'The detected model and computed result will appear here.',
    loadingAI: 'AI is thinking...', loadingExtract: 'Analyzing the text...',
    error: 'Error',
    healthChecking: 'Status: checking...', healthReady: (m)=>`Status: server ready • model: ${m}`, healthMissing: 'Status: server is running, but OPENAI_API_KEY is missing', healthError: (e)=>`Status: error — ${e}`,
    pricingCalc: 'Calculating...', pricingSearch: 'Searching for the best price.', pricingResultTitle: 'Pricing result',
    bestPrice: 'Best price', expectedDemand: 'Expected demand', maxRevenue: 'Maximum revenue', avgMarket: 'Average market price', notSpecified: 'not specified',
    logisticsCalc: 'Calculating...', logisticsSearch: 'Computing the minimum cost.', logisticsResultTitle: 'Logistics result',
    optimalX: 'Optimal x', totalCost: 'Total cost', roadDist: 'Road distance', railDist: 'Rail distance', roadCost: 'Road cost', railCost: 'Rail cost',
    flowerCalc: 'Calculating...', flowerSearch: 'Computing optimal dimensions.', flowerResultTitle: 'Flowerbeds result', optimalY: 'Optimal y', minFence: 'Minimum fence', layout: 'Layout',
    extractorModel: 'Detected model', extractorReasoning: 'AI reasoning', extractorQuestions: 'Follow-up questions', extractorResult: 'Computed result', noQuestions: 'Not needed.', noResult: 'No result found.',
    typingTexts: ['Revenue maximization online', 'Derivative-based optimization active', 'AI extractor ready'],
    footerLine1: 'OptiPlan — Economic optimization platform', footerLine2: 'Built for a competition-ready presentation.'
  }
};

function t(key) { return i18n[currentLang][key]; }
function detectPromptLang(text) { return /[\u10A0-\u10FF]/.test(text) ? 'ka' : 'en'; }
function effectiveLang(text='') { return /[A-Za-z]/.test(text) && /[\u10A0-\u10FF]/.test(text) ? currentLang : (text ? detectPromptLang(text) : currentLang); }

function revealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
}

async function api(url, body = null, method = 'GET') {
  const options = { method, headers: {} };
  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok || data.ok === false) throw new Error(data.error || t('error'));
  return data;
}

function renderMath(element) {
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetClear?.([element]);
    return window.MathJax.typesetPromise([element]).catch(() => {});
  }
  return Promise.resolve();
}
function normalizeMathDelimiters(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\\\\[/g, '\\[').replace(/\\\\\]/g, '\\]')
    .replace(/\\\\\(/g, '\\(').replace(/\\\\\)/g, '\\)')
    .replace(/\\\{,\\\}/g, ',')
    .replace(/```(?:latex|tex|math)\s*([\s\S]*?)```/gi, (_, expr) => `\\[${expr.trim()}\\]`);
}
function preserveMathForMarkdown(text) {
  return text.replace(/\\\[/g, '@@MATH_BLOCK_OPEN@@').replace(/\\\]/g, '@@MATH_BLOCK_CLOSE@@').replace(/\\\(/g, '@@MATH_INLINE_OPEN@@').replace(/\\\)/g, '@@MATH_INLINE_CLOSE@@');
}
function restoreMathAfterMarkdown(html) {
  return html.replace(/@@MATH_BLOCK_OPEN@@/g, '\\[').replace(/@@MATH_BLOCK_CLOSE@@/g, '\\]').replace(/@@MATH_INLINE_OPEN@@/g, '\\(').replace(/@@MATH_INLINE_CLOSE@@/g, '\\)');
}
async function renderMarkdown(target, text) {
  const normalized = normalizeMathDelimiters(text);
  const protectedText = preserveMathForMarkdown(normalized);
  const rendered = marked.parse(protectedText, { breaks: true });
  target.innerHTML = restoreMathAfterMarkdown(rendered);
  await renderMath(target);
}
async function setLoading(target, message) { target.innerHTML = `<p class="muted">${message}</p>`; }
function parseCompetitors(text) { return String(text || '').split(/[,\s;]+/).map((x) => Number(x)).filter((x) => Number.isFinite(x)); }

function renderResultCard(target, title, items) {
  target.innerHTML = `<div class="placeholder-title">${title}</div><ul class="result-list">${items.map(item => `<li><span class="result-label">${item.label}</span><span class="result-value">${item.value}</span></li>`).join('')}</ul>`;
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  const ids = ['navFeatures','navLabs','navAI','heroEyebrowText','heroTitleAccent','heroText','heroStartBtn','healthBtn','heroMiniLabel','metricSolverNote','metricAINote','metricLangNote','metricDesignNote','terminalLine1','terminalLine2','terminalLine3','featuresEyebrow','featuresTitle','labsEyebrow','labsTitle','tabBtnPricing','tabBtnLogistics','tabBtnFlowerbeds','pricingTitle','logisticsTitle','flowerTitle','aiEyebrow','aiTitle','assistantCardTitle','extractorCardTitle','aiChatBtn','extractBtn','footerLine1','footerLine2'];
  ids.forEach((id) => { const el=$(id); if (el) el.textContent = t(id); });
  const titleEl = $('heroTitle'); if (titleEl) titleEl.childNodes[0].textContent = t('heroTitle');
  $('aiPrompt').placeholder = t('aiPromptPlaceholder');
  $('extractPrompt').placeholder = t('extractPromptPlaceholder');
  if (!$('aiOutput').dataset.busy) $('aiOutput').textContent = t('aiOutputIdle');
  if (!$('extractOutput').dataset.busy) $('extractOutput').textContent = t('extractOutputIdle');
  $('healthStatus').textContent = t('healthStatusIdle');
  document.querySelectorAll('.fullscreen-toggle').forEach((btn)=>{
    const target=document.getElementById(btn.dataset.fullscreenTarget);
    const isOpen=target.classList.contains('fullscreen-card');
    btn.textContent=isOpen ? btn.dataset[`labelClose${currentLang === 'ka' ? 'Ka':'En'}`] : btn.dataset[`labelOpen${currentLang === 'ka' ? 'Ka':'En'}`];
  });
  $('langKaBtn').classList.toggle('active', currentLang==='ka');
  $('langEnBtn').classList.toggle('active', currentLang==='en');
}

function setLanguage(lang) { currentLang=lang; localStorage.setItem('optiplan_lang', lang); applyLanguage(); initTypingRow(true); }

function attachLanguageToggle() {
  $('langKaBtn').addEventListener('click', ()=>setLanguage('ka'));
  $('langEnBtn').addEventListener('click', ()=>setLanguage('en'));
}

function attachSolvers() {
  $('pricingSolve').addEventListener('click', async () => {
    const target = $('pricingResult');
    target.innerHTML = `<div class="placeholder-title">${t('pricingCalc')}</div><p class="muted">${t('pricingSearch')}</p>`;
    try {
      const data = await api('/api/solve/pricing', { q_max:Number($('pricing_q_max').value), k:Number($('pricing_k').value), min_price:Number($('pricing_min').value), max_price:Number($('pricing_max').value), competitor_prices:parseCompetitors($('pricing_comp').value), strength:Number($('pricing_strength').value) }, 'POST');
      renderResultCard(target, t('pricingResultTitle'), [
        { label:t('bestPrice'), value:data.result.bestPrice },
        { label:t('expectedDemand'), value:data.result.demand },
        { label:t('maxRevenue'), value:data.result.revenue },
        { label:t('avgMarket'), value:data.result.marketAvg ?? t('notSpecified') }
      ]);
    } catch(err) { target.innerHTML = `<div class="placeholder-title">${t('error')}</div><p class="muted">${err.message}</p>`; }
  });

  $('logisticsSolve').addEventListener('click', async () => {
    const target = $('logisticsResult');
    target.innerHTML = `<div class="placeholder-title">${t('logisticsCalc')}</div><p class="muted">${t('logisticsSearch')}</p>`;
    try {
      const data = await api('/api/solve/logistics', { a:Number($('log_a').value), L:Number($('log_L').value), c1:Number($('log_c1').value), c2:Number($('log_c2').value) }, 'POST');
      renderResultCard(target, t('logisticsResultTitle'), [
        { label:t('optimalX'), value:data.result.x }, { label:t('totalCost'), value:data.result.total }, { label:t('roadDist'), value:data.result.roadDist }, { label:t('railDist'), value:data.result.railDist }, { label:t('roadCost'), value:data.result.roadCostPart }, { label:t('railCost'), value:data.result.railCostPart }
      ]);
    } catch(err) { target.innerHTML = `<div class="placeholder-title">${t('error')}</div><p class="muted">${err.message}</p>`; }
  });

  $('flowerSolve').addEventListener('click', async () => {
    const target = $('flowerResult');
    target.innerHTML = `<div class="placeholder-title">${t('flowerCalc')}</div><p class="muted">${t('flowerSearch')}</p>`;
    try {
      const data = await api('/api/solve/flowerbeds', { area:Number($('flower_area').value), sections:Number($('flower_sections').value) }, 'POST');
      renderResultCard(target, t('flowerResultTitle'), [
        { label:t('optimalX'), value:`${data.result.x} m` }, { label:t('optimalY'), value:`${data.result.y} m` }, { label:t('minFence'), value:`${data.result.fence} m` }, { label:t('layout'), value:data.result.layout }
      ]);
    } catch(err) { target.innerHTML = `<div class="placeholder-title">${t('error')}</div><p class="muted">${err.message}</p>`; }
  });
}

function buildExtractorMarkdown(data) {
  const questions = data.extracted.missing_info_questions?.length ? data.extracted.missing_info_questions.map((q)=>`- ${q}`).join('\n') : t('noQuestions');
  const resultRows = Object.entries(data.result || {}).map(([key, value]) => `- **${key}**: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n');
  return [`## ${t('extractorModel')}`, `**${data.kind}**`, '', `## ${t('extractorReasoning')}`, data.extracted.reasoning, '', `## ${t('extractorQuestions')}`, questions, '', `## ${t('extractorResult')}`, resultRows || `- ${t('noResult')}`].join('\n');
}

function attachAI() {
  $('aiChatBtn').addEventListener('click', async () => {
    const output = $('aiOutput'); const prompt = $('aiPrompt').value.trim(); if (!prompt) return;
    output.dataset.busy = '1'; await setLoading(output, t('loadingAI'));
    try {
      const data = await api('/api/ai/chat', { prompt, lang: effectiveLang(prompt) }, 'POST');
      await renderMarkdown(output, data.result);
    } catch(err) { await renderMarkdown(output, `**${t('error')}:** ${err.message}`); }
    delete output.dataset.busy;
  });

  $('extractBtn').addEventListener('click', async () => {
    const output = $('extractOutput'); const prompt = $('extractPrompt').value.trim(); if (!prompt) return;
    output.dataset.busy = '1'; await setLoading(output, t('loadingExtract'));
    try {
      const data = await api('/api/ai/extract', { prompt, lang: effectiveLang(prompt) }, 'POST');
      await renderMarkdown(output, buildExtractorMarkdown(data));
    } catch(err) { await renderMarkdown(output, `**${t('error')}:** ${err.message}`); }
    delete output.dataset.busy;
  });
}

function attachHealth() {
  $('healthBtn').addEventListener('click', async () => {
    const el = $('healthStatus'); el.textContent = t('healthChecking');
    try {
      const data = await api('/api/health');
      el.textContent = data.hasKey ? t('healthReady')(data.model) : t('healthMissing');
    } catch(err) { el.textContent = t('healthError')(err.message); }
  });
}

let typingTimer;
function initTypingRow(reset=false) {
  const row = document.querySelector('.type-row'); if (!row) return;
  if (typingTimer) clearInterval(typingTimer);
  const texts = t('typingTexts'); let idx = 0;
  const render = () => { row.innerHTML = `${texts[idx]} <span class="typing-cursor"></span>`; idx = (idx + 1) % texts.length; };
  render(); typingTimer = setInterval(render, 2600);
}

function attachFullscreenCards() {
  const backdrop = $('fullscreenBackdrop');
  const buttons = document.querySelectorAll('.fullscreen-toggle');
  const getLabel = (button, open) => button.dataset[open ? `labelOpen${currentLang === 'ka' ? 'Ka' : 'En'}` : `labelClose${currentLang === 'ka' ? 'Ka' : 'En'}`];

  const closeAll = () => {
    document.querySelectorAll('.ai-card.fullscreen-card').forEach((card) => card.classList.remove('fullscreen-card'));
    buttons.forEach((button) => { button.textContent = getLabel(button, true); });
    document.body.classList.remove('body-fullscreen'); backdrop.hidden = true; backdrop.classList.remove('active');
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = document.getElementById(button.dataset.fullscreenTarget);
      const alreadyOpen = card.classList.contains('fullscreen-card'); closeAll();
      if (!alreadyOpen) {
        card.classList.add('fullscreen-card'); button.textContent = getLabel(button, false); document.body.classList.add('body-fullscreen'); backdrop.hidden = false; backdrop.classList.add('active');
      }
    });
  });
  backdrop.addEventListener('click', closeAll);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeAll(); });
}

document.addEventListener('DOMContentLoaded', () => {
  revealOnScroll(); initTabs(); attachSolvers(); attachAI(); attachHealth(); attachFullscreenCards(); attachLanguageToggle(); applyLanguage(); initTypingRow();
});
