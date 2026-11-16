import terms from "@/data/i18n.json";

const PHRASES = terms.phrases as Record<string, string>;
const WORDS = terms.words as Record<string, string>;
const VARIANTS = terms.variants as Record<string, string>;
const CATEGORIES = terms.categories as Record<string, string>;

/** 英文原始名称里的 HTML 实体与面积后缀做统一清理 */
function cleanName(name: string) {
  return name.replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

function stripArea(name: string) {
  return cleanName(name)
    .replace(/\b\d+(\.\d+)?\s*m2\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/[\s,]+$/, "")
    .trim();
}

function areaOf(name: string) {
  const m = cleanName(name).match(/(\d+(?:\.\d+)?)\s*m2/i);
  return m ? `${m[1]} m²` : null;
}

function withArea(zh: string, area: string | null) {
  return area ? `${zh} · ${area}` : zh;
}

/** 逐词组合翻译;遇到未收录的英文词返回 null,由调用方回退 */
function translateWords(phrase: string): string | null {
  const tokens = phrase.replace(/\//g, " / ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t === "/") {
      out.push("/");
      i++;
      continue;
    }
    const two = i + 1 < tokens.length && tokens[i + 1] !== "/" ? `${t} ${tokens[i + 1]}` : null;
    if (two && WORDS[two]) {
      out.push(WORDS[two]);
      i += 2;
      continue;
    }
    if (WORDS[t]) {
      out.push(WORDS[t]);
      i++;
      continue;
    }
    if (/^[A-Za-z]/.test(t)) return null;
    out.push(t);
    i++;
  }
  const joined = out.join("");
  return joined || null;
}

/** 组件英文名 → 中文名(含面积);无法翻译时返回 null */
export function zhComponentName(name: string): string | null {
  const area = areaOf(name);
  const norm = stripArea(name);

  const direct = PHRASES[norm];
  if (direct) return withArea(direct, area);

  const parts = norm.split(/\s+-\s+/);
  const head = parts[0];
  const zhHead = PHRASES[head] ?? translateWords(head);
  if (!zhHead) return null;

  const variantText = parts.slice(1).join(", ");
  const zhVariant = variantText
    ? (VARIANTS[variantText] ?? translateWords(variantText))
    : null;

  return withArea(zhVariant ? `${zhHead}(${zhVariant})` : zhHead, area);
}

/** 科室分类的中英对照 */
export function categoryEn(cat: string): string {
  return CATEGORIES[cat] ?? "";
}

/** FPU 英文名:由 slug 还原(少数例外单独修正) */
const FPU_EN_EXCEPTIONS: Record<string, string> = {
  "admissions-unit-discharge": "Admissions & Discharge Unit",
  "adult-cardiac-surgery-unit": "Adult Cardiac Surgery Unit",
  "bone-marrow-transplant-unit": "Bone Marrow Transplant Unit",
  "birthing-unit": "Birthing Unit",
  "day-surgery-unit": "Day Surgery Unit",
  "emergency-unit": "Emergency Unit",
  "intensive-care-unit": "Intensive Care Unit",
  "operating-unit": "Operating Unit",
  "paediatric-unit": "Paediatric Unit",
  "pharmacy-unit": "Pharmacy Unit",
  "radiology-unit": "Radiology Unit",
  "rehabilitation-unit": "Rehabilitation Unit",
};

export function fpuEn(slug: string, zh = ""): string {
  if (FPU_EN_EXCEPTIONS[slug]) return FPU_EN_EXCEPTIONS[slug];
  const base = slug
    .split("-")
    .map(w => (w.length <= 3 && w === w.toLowerCase() ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
  return zh.endsWith("单元") && !/Unit$/.test(base) ? `${base} Unit` : base;
}

/** 十册指南的英文名与英文简介 */
export const GUIDELINE_EN: Record<string, { name: string; desc: string }> = {
  "Administrative-Provisions": {
    name: "Administrative Provisions",
    desc: "Governance framework, approval process and regulatory requirements for hospital planning and construction.",
  },
  "Health-Facility-Briefing-and-Design": {
    name: "Health Facility Briefing & Design",
    desc: "Core volume: the FPU and Standard Component system, role gradings and design standards.",
  },
  "Access-Mobility-OH-S": {
    name: "Accessibility, Mobility & OH&S",
    desc: "Accessible design, circulation requirements and occupational health & safety provisions.",
  },
  "Infection-Control": {
    name: "Infection Control",
    desc: "Infection prevention measures, zoning and isolation strategies for health facilities.",
  },
  "Engineering-Services-and-Environmental-Design": {
    name: "Engineering Services & Environmental Design",
    desc: "Mechanical, electrical and plumbing systems plus environmental design requirements.",
  },
  "Feasibility-Planning-Costing-Guidelines": {
    name: "Feasibility, Planning & Costing",
    desc: "Feasibility studies, planning models and capital cost estimation methods.",
  },
  Acoustics: {
    name: "Acoustics",
    desc: "Acoustic performance targets, noise control and privacy requirements by room type.",
  },
  "Equipment-Planning-Guidelines": {
    name: "Equipment Planning",
    desc: "Equipment schedules, procurement planning and coordination with room layouts.",
  },
  "Health-Service-Planning": {
    name: "Health Service Planning",
    desc: "Service demand modelling, capacity planning and functional programming.",
  },
  "Wayfinding-Guidelines": {
    name: "Wayfinding",
    desc: "Signage, wayfinding strategy and patient experience across the facility.",
  },
};

export function guidelineEn(slug: string) {
  return GUIDELINE_EN[slug] ?? { name: slug.replace(/-/g, " "), desc: "" };
}

/** 三个 RDS 样本的英文名(样本不在组件索引内) */
const SAMPLE_EN: Record<string, string> = {
  "1-Bed-Room-Standard-15m2": "1 Bed Room — Standard, 15 m²",
  "Operating-Room-General": "Operating Room — General",
  "Consult-Exam-Room": "Consult / Examination Room",
};

export function sampleEn(slug: string, fallback = ""): string {
  return SAMPLE_EN[slug] ?? fallback;
}
