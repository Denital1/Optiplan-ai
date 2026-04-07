const $ = (id) => document.getElementById(id);

function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

async function api(url, body = null, method = "GET") {
  const options = { method, headers: {} };
  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || "შეცდომა");
  }
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
  if (!text) return "";
  return String(text)
    .replace(/\\\((.*?)\\\)/gs, '\\($1\\)')
    .replace(/\\\[(.*?)\\\]/gs, '\\[$1\\]');
}

async function renderMarkdown(target, text) {
  const safeText = normalizeMathDelimiters(text);
  target.innerHTML = marked.parse(safeText);
  await renderMath(target);
}

async function setLoading(target, message) {
  target.innerHTML = `<p class="muted">${message}</p>`;
}

function renderResultCard(target, title, items) {
  target.innerHTML = `
    <div class="placeholder-title">${title}</div>
    <ul class="result-list">
      ${items.map(item => `
        <li>
          <span class="result-label">${item.label}</span>
          <span class="result-value">${item.value}</span>
        </li>
      `).join("")}
    </ul>
  `;
}

function parseCompetitors(text) {
  return String(text || "")
    .split(/[,\s;]+/)
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x));
}

function attachSolvers() {
  $("pricingSolve").addEventListener("click", async () => {
    const target = $("pricingResult");
    target.innerHTML = `<div class="placeholder-title">ითვლება...</div><p class="muted">მიმდინარეობს საუკეთესო ფასის ძიება.</p>`;
    try {
      const data = await api("/api/solve/pricing", {
        q_max: Number($("pricing_q_max").value),
        k: Number($("pricing_k").value),
        min_price: Number($("pricing_min").value),
        max_price: Number($("pricing_max").value),
        competitor_prices: parseCompetitors($("pricing_comp").value),
        strength: Number($("pricing_strength").value)
      }, "POST");

      renderResultCard(target, "ფასის ოპტიმიზაციის შედეგი", [
        { label: "საუკეთესო ფასი", value: data.result.bestPrice },
        { label: "მოსალოდნელი მოთხოვნა", value: data.result.demand },
        { label: "მაქსიმალური შემოსავალი", value: data.result.revenue },
        { label: "ბაზრის საშუალო ფასი", value: data.result.marketAvg ?? "არ არის მითითებული" }
      ]);
    } catch (err) {
      target.innerHTML = `<div class="placeholder-title">შეცდომა</div><p class="muted">${err.message}</p>`;
    }
  });

  $("logisticsSolve").addEventListener("click", async () => {
    const target = $("logisticsResult");
    target.innerHTML = `<div class="placeholder-title">ითვლება...</div><p class="muted">მიმდინარეობს მინიმალური ხარჯის გამოთვლა.</p>`;
    try {
      const data = await api("/api/solve/logistics", {
        a: Number($("log_a").value),
        L: Number($("log_L").value),
        c1: Number($("log_c1").value),
        c2: Number($("log_c2").value)
      }, "POST");

      renderResultCard(target, "ლოგისტიკის შედეგი", [
        { label: "ოპტიმალური x", value: data.result.x },
        { label: "მთლიანი ხარჯი", value: data.result.total },
        { label: "სახმელეთო მანძილი", value: data.result.roadDist },
        { label: "რკინიგზის მანძილი", value: data.result.railDist },
        { label: "სახმელეთო ხარჯი", value: data.result.roadCostPart },
        { label: "რკინიგზის ხარჯი", value: data.result.railCostPart }
      ]);
    } catch (err) {
      target.innerHTML = `<div class="placeholder-title">შეცდომა</div><p class="muted">${err.message}</p>`;
    }
  });

  $("flowerSolve").addEventListener("click", async () => {
    const target = $("flowerResult");
    target.innerHTML = `<div class="placeholder-title">ითვლება...</div><p class="muted">მიმდინარეობს ოპტიმალური ზომების გამოთვლა.</p>`;
    try {
      const data = await api("/api/solve/flowerbeds", {
        area: Number($("flower_area").value),
        sections: Number($("flower_sections").value)
      }, "POST");

      renderResultCard(target, "ყვავილნარის შედეგი", [
        { label: "ოპტიმალური x", value: `${data.result.x} მ` },
        { label: "ოპტიმალური y", value: `${data.result.y} მ` },
        { label: "მინიმალური ღობე", value: `${data.result.fence} მ` },
        { label: "განლაგება", value: data.result.layout }
      ]);
    } catch (err) {
      target.innerHTML = `<div class="placeholder-title">შეცდომა</div><p class="muted">${err.message}</p>`;
    }
  });
}

function buildExtractorMarkdown(data) {
  const questions = data.extracted.missing_info_questions?.length
    ? data.extracted.missing_info_questions.map((q) => `- ${q}`).join("\n")
    : "არ არის საჭირო.";
  const resultRows = Object.entries(data.result || {})
    .map(([key, value]) => `- **${key}**: ${Array.isArray(value) ? value.join(", ") : value}`)
    .join("\n");

  return [
    `## ამოცნობილი მოდელი`,
    `**${data.kind}**`,
    ``,
    `## AI ახსნა`,
    data.extracted.reasoning,
    ``,
    `## დამატებითი კითხვები`,
    questions,
    ``,
    `## გამოთვლილი შედეგი`,
    resultRows || "- შედეგი ვერ მოიძებნა."
  ].join("\n");
}

function attachAI() {
  $("aiChatBtn").addEventListener("click", async () => {
    const output = $("aiOutput");
    const prompt = $("aiPrompt").value.trim();
    if (!prompt) return;
    await setLoading(output, "AI ფიქრობს...");
    try {
      const data = await api("/api/ai/chat", { prompt }, "POST");
      await renderMarkdown(output, data.result);
    } catch (err) {
      await renderMarkdown(output, `**შეცდომა:** ${err.message}`);
    }
  });

  $("extractBtn").addEventListener("click", async () => {
    const output = $("extractOutput");
    const prompt = $("extractPrompt").value.trim();
    if (!prompt) return;
    await setLoading(output, "მიმდინარეობს ტექსტის ანალიზი...");
    try {
      const data = await api("/api/ai/extract", { prompt }, "POST");
      await renderMarkdown(output, buildExtractorMarkdown(data));
    } catch (err) {
      await renderMarkdown(output, `**შეცდომა:** ${err.message}`);
    }
  });
}

function attachHealth() {
  $("healthBtn").addEventListener("click", async () => {
    const el = $("healthStatus");
    el.textContent = "სტატუსი: მოწმდება...";
    try {
      const data = await api("/api/health");
      el.textContent = data.hasKey
        ? `სტატუსი: სერვერი მზადაა • მოდელი: ${data.model}`
        : "სტატუსი: სერვერი მუშაობს, მაგრამ OPENAI_API_KEY არ არის მითითებული";
    } catch (err) {
      el.textContent = `სტატუსი: შეცდომა — ${err.message}`;
    }
  });
}

function initTypingRow() {
  const row = document.querySelector(".type-row");
  if (!row) return;
  const texts = [
    "Revenue maximization online",
    "Derivative-based optimization active",
    "AI extractor ready"
  ];
  let idx = 0;
  const render = () => {
    row.innerHTML = `${texts[idx]} <span class="typing-cursor"></span>`;
    idx = (idx + 1) % texts.length;
  };
  render();
  setInterval(render, 2600);
}

function attachFullscreenCards() {
  const backdrop = $("fullscreenBackdrop");
  const buttons = document.querySelectorAll(".fullscreen-toggle");

  const closeAll = () => {
    document.querySelectorAll(".ai-card.fullscreen-card").forEach((card) => {
      card.classList.remove("fullscreen-card");
    });
    buttons.forEach((button) => {
      button.textContent = "სრული ეკრანი";
    });
    document.body.classList.remove("body-fullscreen");
    backdrop.hidden = true;
    backdrop.classList.remove("active");
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = document.getElementById(button.dataset.fullscreenTarget);
      const alreadyOpen = card.classList.contains("fullscreen-card");

      closeAll();

      if (!alreadyOpen) {
        card.classList.add("fullscreen-card");
        button.textContent = "დახურვა";
        document.body.classList.add("body-fullscreen");
        backdrop.hidden = false;
        backdrop.classList.add("active");
      }
    });
  });

  backdrop.addEventListener("click", closeAll);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
  initTabs();
  attachSolvers();
  attachAI();
  attachHealth();
  initTypingRow();
  attachFullscreenCards();
});
