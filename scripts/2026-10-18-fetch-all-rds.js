// 批量抓取 607 个 Standard Component 详情页
// 用法: node 2026-10-18-fetch-all-rds.js
const fs = require("fs");
const path = require("path");

const BASE = "https://www.healthfacilityguidelines.com/StandardComponents/ItemDetails/";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const OUT_DIR = path.join(__dirname, "..", "raw", "items");
const FAIL_LOG = path.join(__dirname, "..", "raw", "fetch-failures.json");

const items = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "2026-10-18-standard-components.json"), "utf8"));
fs.mkdirSync(OUT_DIR, { recursive: true });

const CONCURRENCY = 4;
const RETRY = 3;

async function fetchOne(slug) {
  const file = path.join(OUT_DIR, slug + ".html");
  if (fs.existsSync(file) && fs.statSync(file).size > 20000) return "cached";
  for (let attempt = 1; attempt <= RETRY; attempt++) {
    try {
      const res = await fetch(BASE + slug, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      if (text.length < 20000 || text.indexOf("ItemDetails") === -1 && text.indexOf("Room Code") === -1) {
        throw new Error("suspicious body " + text.length);
      }
      fs.writeFileSync(file, text);
      return "ok";
    } catch (e) {
      if (attempt === RETRY) return "fail:" + e.message;
      await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
}

(async () => {
  let done = 0, ok = 0, cached = 0;
  const failures = [];
  const queue = items.map(i => i.slug);
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0) {
      const slug = queue.shift();
      const result = await fetchOne(slug);
      done++;
      if (result === "ok") ok++;
      else if (result === "cached") cached++;
      else failures.push({ slug, result });
      if (done % 25 === 0) {
        console.log(`进度 ${done}/${items.length} (ok=${ok} cached=${cached} fail=${failures.length})`);
        fs.writeFileSync(FAIL_LOG, JSON.stringify(failures, null, 2));
      }
    }
  });
  await Promise.all(workers);
  fs.writeFileSync(FAIL_LOG, JSON.stringify(failures, null, 2));
  console.log(`完成: ${done}/${items.length} ok=${ok} cached=${cached} 失败=${failures.length}`);
  if (failures.length > 0) console.log("失败清单已写入 raw/fetch-failures.json");
})();
