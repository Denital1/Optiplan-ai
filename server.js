import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

function detectLang(text = "") {
  return /[Ⴀ-ჿ]/.test(text) ? "ka" : "en";
}

function resolveLang(preferred, prompt = "") {
  return preferred === "ka" || preferred === "en" ? preferred : detectLang(prompt);
}

function clampNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function average(arr) {
  if (!Array.isArray(arr) || !arr.length) return null;
  const nums = arr.map((x) => Number(x)).filter((x) => Number.isFinite(x));
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function bestPriceWithCompetitors({ q_max, k, min_price, max_price, competitor_prices = [], step = 0.01, comp_penalty_strength = 0.15 }) {
  const marketAvg = average(competitor_prices);

  const baseQ = (p) => Math.max(0, q_max - k * p);

  const competitorMultiplier = (p) => {
    if (!marketAvg) return 1.0;
    const diffRatio = (p - marketAvg) / marketAvg;
    if (diffRatio <= 0) return 1.0;
    return 1.0 / (1.0 + comp_penalty_strength * diffRatio * 10.0);
  };

  const effectiveQ = (p) => baseQ(p) * competitorMultiplier(p);
  const revenue = (p) => p * effectiveQ(p);

  let bestP = min_price;
  let bestScore = revenue(bestP);

  for (let p = min_price; p <= max_price + 1e-9; p += step) {
    const currentScore = revenue(p);
    if (currentScore > bestScore) {
      bestScore = currentScore;
      bestP = p;
    }
  }

  return {
    bestPrice: Number(bestP.toFixed(2)),
    demand: Number(effectiveQ(bestP).toFixed(2)),
    revenue: Number(bestScore.toFixed(2)),
    marketAvg: marketAvg ? Number(marketAvg.toFixed(2)) : null
  };
}

function logisticsCost(x, a, L, c1, c2) {
  const roadDist = Math.sqrt(a * a + x * x);
  const railDist = L - x;
  return c1 * roadDist + c2 * railDist;
}

function findLogisticsOptimum({ a, L, c1, c2 }) {
  if (L <= 0) throw new Error("L უნდა იყოს დადებითი.");
  if (a < 0) throw new Error("a ვერ იქნება უარყოფითი.");
  if (c1 <= 0 || c2 <= 0) throw new Error("ღირებულებები უნდა იყოს დადებითი.");

  const lo = 0;
  const hi = L;
  let bestX = lo;
  let bestC = logisticsCost(bestX, a, L, c1, c2);
  const step = Math.max(0.05, (hi - lo) / 400);

  for (let x = lo; x <= hi + 1e-9; x += step) {
    const c = logisticsCost(x, a, L, c1, c2);
    if (c < bestC) {
      bestC = c;
      bestX = x;
    }
  }

  const refineLo = Math.max(lo, bestX - 1);
  const refineHi = Math.min(hi, bestX + 1);

  for (let x = refineLo; x <= refineHi + 1e-12; x += 0.001) {
    const c = logisticsCost(x, a, L, c1, c2);
    if (c < bestC) {
      bestC = c;
      bestX = x;
    }
  }

  const roadDist = Math.sqrt(a * a + bestX * bestX);
  const railDist = L - bestX;

  return {
    x: Number(bestX.toFixed(3)),
    total: Number(bestC.toFixed(3)),
    roadDist: Number(roadDist.toFixed(3)),
    railDist: Number(railDist.toFixed(3)),
    roadCostPart: Number((c1 * roadDist).toFixed(3)),
    railCostPart: Number((c2 * railDist).toFixed(3))
  };
}

function solveFlowerbedsMinFence({ area, sections }) {
  if (area <= 0) throw new Error("ფართობი უნდა იყოს დადებითი.");
  if (![1, 3, 6].includes(sections)) throw new Error("სექციები უნდა იყოს 1, 3 ან 6.");

  let a, b;
  if (sections === 1) [a, b] = [2.0, 2.0];
  else if (sections === 3) [a, b] = [2.0, 4.0];
  else [a, b] = [3.0, 4.0];

  const y = Math.sqrt((a * area) / b);
  const x = area / y;
  const fence = a * x + b * y;

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    fence: Number(fence.toFixed(2)),
    layout: sections === 1 ? "ერთიანი" : sections === 3 ? "3 სექცია ერთ რიგში" : "3×2 ბადე"
  };
}

function safeParseOutputText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  if (Array.isArray(data?.output)) {
    const parts = [];
    for (const item of data.output) {
      if (Array.isArray(item?.content)) {
        for (const c of item.content) {
          if (typeof c?.text === "string" && c.text.trim()) parts.push(c.text.trim());
        }
      }
      if (typeof item?.text === "string" && item.text.trim()) parts.push(item.text.trim());
    }
    if (parts.length) return parts.join("\n");
  }
  return "";
}

async function openaiResponses(payload) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is missing on the server.");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || "OpenAI request failed.";
    throw new Error(message);
  }

  return data;
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.OPENAI_API_KEY),
    model: MODEL
  });
});

app.post("/api/solve/pricing", (req, res) => {
  try {
    const result = bestPriceWithCompetitors({
      q_max: clampNumber(req.body.q_max),
      k: clampNumber(req.body.k),
      min_price: clampNumber(req.body.min_price),
      max_price: clampNumber(req.body.max_price),
      competitor_prices: Array.isArray(req.body.competitor_prices) ? req.body.competitor_prices : [],
      comp_penalty_strength: clampNumber(req.body.strength, 0.15)
    });
    res.json({ ok: true, result });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

app.post("/api/solve/logistics", (req, res) => {
  try {
    const result = findLogisticsOptimum({
      a: clampNumber(req.body.a),
      L: clampNumber(req.body.L),
      c1: clampNumber(req.body.c1),
      c2: clampNumber(req.body.c2)
    });
    res.json({ ok: true, result });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

app.post("/api/solve/flowerbeds", (req, res) => {
  try {
    const result = solveFlowerbedsMinFence({
      area: clampNumber(req.body.area),
      sections: clampNumber(req.body.sections)
    });
    res.json({ ok: true, result });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const prompt = String(req.body.prompt || "").trim();
    const lang = resolveLang(req.body.lang, prompt);
    if (!prompt) return res.status(400).json({ ok: false, error: lang === "en" ? "Empty prompt." : "ცარიელი მოთხოვნა." });

    const data = await openaiResponses({
      model: MODEL,
      instructions: [
        "შენ ხარ ეკონომიკისა და კალკულუსის სასწავლო ასისტენტი.",
        "მომხმარებლის კითხვას უპასუხე ქართულად.",
        "იყავი მკაფიო, სასწავლო და სტრუქტურირებული.",
        "თუ ამოცანაა, გააკეთე მოკლე ახსნა, ნაბიჯები და საბოლოო პასუხი.",
        "თუ იყენებ ფორმულებს, გამოყავი ისინი LaTeX-ით: inline ფორმატისთვის გამოიყენე \\( ... \\), ხოლო ცალკე ბლოკისთვის \\[ ... \\].",
        "არ ჩასვა უბრალო არითმეტიკა ან ჩვეულებრივი დიდი რიცხვები LaTeX ბლოკში, თუ ამის საჭიროება არ არის.",
        "ათასების გამყოფად გამოიყენე ჩვეულებრივი მძიმე, მაგალითად 3,249,823 და არა 3\\{,\\}249\\{,\\}823.",
        "შეგიძლია გამოიყენო Markdown სათაურები, სიები და გამუქებული ტექსტი.",
        "ნუ გახდები ზედმეტად გრძელი."
      ].join("\n"),
      input: prompt
    });

    const text = safeParseOutputText(data) || "პასუხი ვერ იქნა მიღებული.";
    res.json({ ok: true, result: text });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/ai/extract", async (req, res) => {
  try {
    const prompt = String(req.body.prompt || "").trim();
    if (!prompt) return res.status(400).json({ ok: false, error: "ცარიელი მოთხოვნა." });

    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        problem_id: { type: "string", enum: ["pricing_competitors", "logistics_min_cost", "flowerbeds_min_fence"] },
        reasoning: { type: "string" },
        params: {
          type: "object",
          additionalProperties: false,
          properties: {
            q_max: { type: "number" },
            k: { type: "number" },
            min_price: { type: "number" },
            max_price: { type: "number" },
            competitor_prices: { type: "array", items: { type: "number" } },
            strength: { type: "number" },
            a: { type: "number" },
            L: { type: "number" },
            c1: { type: "number" },
            c2: { type: "number" },
            area: { type: "number" },
            sections: { type: "number" }
          },
          required: ["q_max", "k", "min_price", "max_price", "competitor_prices", "strength", "a", "L", "c1", "c2", "area", "sections"]
        },
        missing_info_questions: { type: "array", items: { type: "string" } }
      },
      required: ["problem_id", "reasoning", "params", "missing_info_questions"]
    };

    const data = await openaiResponses({
      model: MODEL,
      instructions: [
        "შენ ხარ ოპტიმიზაციის ამოცანების ამომცნობი.",
        "უნდა ამოიცნო რომელი შაბლონია ტექსტი:",
        "1) pricing_competitors",
        "2) logistics_min_cost",
        "3) flowerbeds_min_fence",
        "სავალდებულოა ყველა პარამეტრის დაბრუნება.",
        "თუ კონკრეტული შაბლონისთვის რაღაც არ არის საჭირო, ჩასვი 0 ან [].",
        "თუ ინფორმაცია აკლია, მაინც აირჩიე ყველაზე ახლო შაბლონი და დასვი მოკლე დამაზუსტებელი კითხვები."
      ].join("\n"),
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "opti_plan_extract",
          schema,
          strict: true
        }
      }
    });

    const raw = safeParseOutputText(data);
    const parsed = JSON.parse(raw);

    if (parsed.problem_id === "pricing_competitors") {
      const result = bestPriceWithCompetitors(parsed.params);
      return res.json({ ok: true, kind: parsed.problem_id, extracted: parsed, result });
    }
    if (parsed.problem_id === "logistics_min_cost") {
      const result = findLogisticsOptimum(parsed.params);
      return res.json({ ok: true, kind: parsed.problem_id, extracted: parsed, result });
    }
    if (parsed.problem_id === "flowerbeds_min_fence") {
      const result = solveFlowerbedsMinFence(parsed.params);
      return res.json({ ok: true, kind: parsed.problem_id, extracted: parsed, result });
    }

    return res.status(400).json({ ok: false, error: lang === "en" ? "Unknown template." : "უცნობი შაბლონი." });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`OptiPlan running on http://localhost:${PORT}`);
});
