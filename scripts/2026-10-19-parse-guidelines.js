// 解析 10 个指南分册页 -> 分册结构摘要(整册PDF/章节PDF/FPU)
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "raw", "guidelines");
const files = fs.readdirSync(DIR).filter(f => f.endsWith(".html"));

function stripTags(s) { return s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(); }

const out = [];
for (const f of files) {
  const html = fs.readFileSync(path.join(DIR, f), "utf8");
  if (html.length < 5000) { out.push({ part: f.replace(".html", ""), error: "invalid page " + html.length }); continue; }
  const pdfs = [...new Set([...html.matchAll(/href="\/ViewPDF\/ViewIndexPDF\/([^"]+)"/g)].map(m => m[1]))];
  const h3 = [...html.matchAll(/<h3[^>]*>([^<]+)</g)].map(m => stripTags(m[1]))[0] || "";
  const tables = (html.match(/<table[^>]*>/g) || []).length;
  // 章节名:表格行里的章节链接文本
  const chapterLinks = [...new Set([...html.matchAll(/href="(\/ViewPDF\/ViewIndexPDF\/[^"]+)"[^>]*>([^<]{3,80})</g)].map(m => m[2].trim()))];
  out.push({
    part: f.replace(".html", ""),
    title: h3,
    tableCount: tables,
    pdfIndexCount: pdfs.length,
    completePdf: pdfs.find(p => /complete|full/i.test(p)) || null,
    pdfSlugs: pdfs,
    chapterNames: chapterLinks.slice(0, 40),
  });
}

fs.writeFileSync(path.join(__dirname, "..", "data", "2026-10-19-guidelines-structure.json"), JSON.stringify(out, null, 2));
out.forEach(g => {
  const n = g.error ? g.error : `章节PDF ${g.pdfIndexCount} 个 | 表格 ${g.tableCount} | 整册: ${g.completePdf ? "有" : "无"}`;
  console.log(`${g.part}: ${n}`);
});
console.log("已写入 2026-10-19-guidelines-structure.json");
