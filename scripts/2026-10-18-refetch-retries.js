// 第二轮补抓:处理 429 限流失败的 slug —— 串行 + 固定间隔 + 遇 429 长退避
const fs = require("fs");
const path = require("path");

const BASE = "https://www.healthfacilityguidelines.com/StandardComponents/ItemDetails/";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const OUT_DIR = path.join(__dirname, "..", "raw", "items");
const FAIL_LOG = path.join(__dirname, "..", "raw", "fetch-failures-r2.json");

const failures = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "raw", "fetch-failures.json"), "utf8"));
const todo = failures.map(f => f.slug);
fs.mkdirSync(OUT_DIR, { recursive: true });

const DELAY_MS = 2500;      // 常规间隔
const RETRY = 5;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchOne(slug) {
  const file = path.join(OUT_DIR, slug + ".html");
  if (fs.existsSync(file) && fs.statSync(file).size > 20000) return "cached";
  for (let attempt = 1; attempt <= RETRY; attempt++) {
    try {
      const res = await fetch(BASE + slug, { headers: { "User-Agent": UA } });
      if (res.status === 429) {
        const wait = 20000 * attempt; // 20s/40s/60s/80s/100s
        console.log(`  429 限流,退避 ${wait / 1000}s 后重试 (${slug})`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      if (text.length < 20000 || (text.indexOf("Room Code") === -1 && text.indexOf("ItemDetails") === -1)) {
        throw new Error("suspicious body " + text.length);
      }
      fs.writeFileSync(file, text);
      return "ok";
    } catch (e) {
      if (attempt === RETRY) return "fail:" + e.message;
      await sleep(5000 * attempt);
    }
  }
  return "fail:retries-exhausted";
}

(async () => {
  let done = 0, ok = 0, cached = 0;
  const still = [];
  for (const slug of todo) {
    const result = await fetchOne(slug);
    done++;
    if (result === "ok") ok++;
    else if (result === "cached") cached++;
    else still.push({ slug, result });
    if (done % 20 === 0) {
      console.log(`二轮进度 ${done}/${todo.length} (ok=${ok} cached=${cached} fail=${still.length}) ${new Date().toLocaleTimeString()}`);
      fs.writeFileSync(FAIL_LOG, JSON.stringify(still, null, 2));
    }
    await sleep(DELAY_MS);
  }
  fs.writeFileSync(FAIL_LOG, JSON.stringify(still, null, 2));
  console.log(`二轮完成: ${done}/${todo.length} ok=${ok} cached=${cached} 仍失败=${still.length}`);
})();
