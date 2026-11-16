// 解析 raw/items/*.html → 2026-10-18-rds-database.json
// 结构:头部元数据 + 装修表(7列) + 设备表(6列) + 修订史
const fs = require("fs");
const path = require("path");

const ITEMS_DIR = path.join(__dirname, "..", "raw", "items");
const index = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "2026-10-18-standard-components.json"), "utf8"));

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function parseTables(html) {
  const tables = [];
  const tRe = /<table[^>]*>([\s\S]*?)<\/table>/g;
  let tm;
  while ((tm = tRe.exec(html)) !== null) {
    const rows = [];
    const rRe = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
    let rm;
    while ((rm = rRe.exec(tm[1])) !== null) {
      const cells = [];
      const cRe = /<t([hd])[^>]*>([\s\S]*?)<\/t\1>/g;
      let cm;
      while ((cm = cRe.exec(rm[1])) !== null) cells.push({ tag: cm[1], text: stripTags(cm[2]) });
      if (cells.length > 0) rows.push(cells);
    }
    tables.push(rows);
  }
  return tables;
}

function parseItem(html) {
  const tables = parseTables(html);
  const out = { rds: null, finishes: null, equipment: null };

  for (const rows of tables) {
    if (rows.length === 0) continue;
    const header = rows[0].map(c => c.text).join("|");
    if (header.includes("Fabric") && header.includes("Material")) {
      out.finishes = rows.slice(1).map(r => ({
        id: r[0]?.text || "", fabric: r[1]?.text || "", material: r[2]?.text || "",
        finish: r[3]?.text || "", specification: r[4]?.text || "",
        selection: r[5]?.text || "", remarks: r.slice(6).map(c => c.text).filter(Boolean).join(" "),
      }));
    } else if (header.includes("Category") && header.includes("Qty")) {
      out.equipment = rows.slice(1).map(r => ({
        id: r[0]?.text || "", description: r[1]?.text || "", category: r[2]?.text || "",
        group: r[3]?.text || "", qty: r[4]?.text || "",
        remarks: r.slice(5).map(c => c.text).filter(Boolean).join(" "),
      }));
    } else if (header.includes("Room Code")) {
      const flat = rows.slice(1).flat().map(c => c.text);
      out.rds = { rows: flat };
    }
  }
  return out;
}

const db = [];
let parsed = 0, skipped = 0;
for (const item of index) {
  const file = path.join(ITEMS_DIR, item.slug + ".html");
  if (!fs.existsSync(file)) { skipped++; continue; }
  const html = fs.readFileSync(file, "utf8");
  try {
    const parsedItem = parseItem(html);
    db.push({ slug: item.slug, name: item.name, code: item.code, ...parsedItem });
    parsed++;
  } catch (e) {
    db.push({ slug: item.slug, name: item.name, code: item.code, error: e.message });
    skipped++;
  }
}

fs.writeFileSync(path.join(__dirname, "..", "data", "2026-10-18-rds-database.json"), JSON.stringify(db, null, 2));
console.log(`解析完成: 成功 ${parsed}, 跳过/失败 ${skipped}, 总计 ${db.length}`);
const withFin = db.filter(d => d.finishes).length;
const withEq = db.filter(d => d.equipment).length;
const withRds = db.filter(d => d.rds).length;
console.log(`含装修表: ${withFin} | 含设备表: ${withEq} | 含RDS头表: ${withRds}`);
