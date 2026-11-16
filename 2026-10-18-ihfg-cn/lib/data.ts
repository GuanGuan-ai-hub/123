import fs from "fs";
import path from "path";
import componentsIndex from "@/data/components-index.json";
import fpusJson from "@/data/fpus.json";
import guidelinesJson from "@/data/guidelines.json";
import samplesJson from "@/data/samples.json";
import type { ComponentIndex, ComponentDetail, Fpu, GuidelinePart } from "./types";

export const components: ComponentIndex[] = componentsIndex as ComponentIndex[];
export const fpus: Fpu[] = fpusJson as Fpu[];
export const guidelines: GuidelinePart[] = guidelinesJson as GuidelinePart[];
export const sampleDetails: ComponentDetail[] = samplesJson as ComponentDetail[];

/**
 * 607 全量 RDS 逆向数据 —— TAHPI 版权,不入公开仓库(.gitignore 排除)。
 * 本地开发者如持有该数据,放置于 data/rds-database.json 即自动启用全量详情;
 * 缺失时详情页自动降级为索引展示,构建不受影响。
 */
interface RdsRecord {
  slug: string; name: string; code: string;
  rds: { rows: string[] } | null;
  finishes: { id: string; fabric: string; material: string; finish: string; specification: string; selection: string; remarks: string }[] | null;
  equipment: { id: string; description: string; category: string; group: string; qty: string; remarks: string }[] | null;
}
export const rdsDatabase: RdsRecord[] = (() => {
  try {
    const file = path.join(process.cwd(), "data", "rds-database.json");
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8")) as RdsRecord[];
  } catch { /* 数据缺失或不可解析时按空处理 */ }
  return [];
})();

export function getComponentBySlug(slug: string): ComponentIndex | undefined {
  return components.find(c => c.slug === slug);
}

export function getDetailBySlug(slug: string): ComponentDetail | undefined {
  return sampleDetails.find(s => s.slug === slug);
}

/** 全量详情:优先 3 个中文明样本,回退 607 逆向 RDS(英文原数据) */
export function getFullDetailBySlug(slug: string) {
  const sample = getDetailBySlug(slug);
  if (sample) return { source: "sample-zh" as const, detail: sample };
  const raw = rdsDatabase.find(r => r.slug === slug);
  if (!raw) return null;
  // RDS 头表为扁平键值序列:["Net Room Area Briefed","20","Hours of Operation","24 Hours",...]
  const rows = raw.rds?.rows ?? [];
  const pick = (key: string) => {
    const i = rows.indexOf(key);
    return i >= 0 ? (rows[i + 1] ?? "") : "";
  };
  const descIdx = rows.indexOf("Description / Special Requirements");
  const amendmentIdx = rows.indexOf("Amendment");
  const description = descIdx >= 0 ? rows[descIdx + 1] ?? "" : "";
  const amendments = amendmentIdx >= 0
    ? rows.slice(amendmentIdx + 1).filter(Boolean).map(text => {
        const m = text.match(/^(\d{2}\.\d{2}\.\d{4})\s*(.*)$/);
        return m ? { date: m[1], note: m[2] || "(未注明)" } : { date: "", note: text };
      })
    : [];
  return {
    source: "reverse-en" as const,
    detail: {
      slug: raw.slug,
      name: raw.name,
      code: raw.code,
      rds: {
        roomCode: raw.code,
        netRoomArea: pick("Net Room Area Briefed"),
        hoursOfOperation: pick("Hours of Operation"),
        occupancy: pick("Occupancy"),
        description,
        amendments,
      },
      finishes: raw.finishes ?? [],
      equipment: raw.equipment ?? [],
      files: [
        { kind: "editor" as const, title: "在线简报编辑", description: "在本站在线编辑系统中调整该房间简报数据(逆向数据,演示)", price: "订阅" },
        { kind: "pdf" as const, title: "房间布局图(RLS)", description: "Room Layout Sheet(逆向数据未含文件,演示)", price: "免费" },
        { kind: "revit" as const, title: "可编辑 Revit 布局图", description: "Editable Revit RLS(演示)", price: "¥399" },
      ],
    },
  };
}

/** 按编码前缀归类(与原站编码体系一致) */
export function codePrefix(code: string): string {
  return code.replace(/-I$/, "").split("-")[0];
}

/** 列表大类(演示用,按前缀字典归类) */
export function categoryOf(code: string): string {
  const p = codePrefix(code);
  if (/^\dBR$/.test(p) || /^(ENS|PB|BATH|WC)/.test(p)) return "住院/病房";
  if (/^OR$/.test(p)) return "手术";
  if (/^(CONS|TRMT|PROC|INT|RECE|WAIT)/.test(p)) return "门诊/诊察";
  if (/^(MRI|CT|XR|US|NUC|PET|SPECT|FLUO|MAMMO|DENI|ECHO|EEG|EMG|ULTR|GCAM|LASI|STR|GAIT|BALANCE|AUDIO)/.test(p)) return "影像/检查";
  if (/^(LAB|PTH|BLD|SPREC|PREP|IVF|CYT)/.test(p)) return "检验/实验";
  if (/^(MEDR|CLUR|CLUM|DTUR|STDR|PHA|PREP|ASP|STAD)/.test(p)) return "药剂/药品";
  if (/^(SSTN|OFF|MEET|RECL|CLREC|COMM|COEQ|COTR)/.test(p)) return "办公/会议";
  if (/^(STGN|STEQ|STSS|STBK|STLN|STFS|STCM|STCR|STDE|STPP|STGB|STCL|STAD|LODK|WASH|WS|WK|CLRM|DISP|LAUN|LHO|WTPL|WACO)/.test(p)) return "后勤/保障";
  if (/^(BAY|BHWS|BPPE|BATM|BBEV|BRES|BFLW|BMT|BMEQ|BWC|BDD|BDF|BHW|BPATH|BPTS|BS|BSE|BUT|BVM|BBW|BCL|BEQP|BESE|BLIN|BT)/.test(p)) return "功能位/嵌壁位";
  if (/^(LN|LOUN|LD|DIN|COFS|PLAP|FEED|PAR|PRAR|MAJ|ABLU|OV|LIB|LEC|DEM|AUDV|GYAH|HYD)/.test(p)) return "生活配套";
  if (/^(CORR|AIRL|ANRM|CHPT|CHST|SH|GW|SECL|CTSE|SECR|COMC|PABX|SWOP|VWR|RPST|MOR|BODY)/.test(p)) return "通道/辅助";
  return "其他";
}
