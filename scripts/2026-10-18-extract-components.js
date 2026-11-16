const fs = require("fs");
const html = fs.readFileSync(__dirname + "/../raw/pages/standard-components-list.html", "utf8");

// 每行: <tr><td class="col-md-10 sorting_1"><a href="/StandardComponents/ItemDetails/SLUG">NAME</a></td><td ...><a href="...">CODE</a></td></tr>
const rowRe = /<tr class="stdcomp-row">\s*<td[^>]*><a href="\/StandardComponents\/ItemDetails\/([^"]+)">([^<]+)<\/a><\/td>\s*<td[^>]*><a href="[^"]*">([^<]+)<\/a><\/td>/g;
const items = [];
let m;
while ((m = rowRe.exec(html)) !== null) {
  items.push({ slug: m[1], name: m[2].trim(), code: m[3].trim() });
}

// 去重(同名 slug)
const seen = new Set();
const unique = items.filter(i => { if (seen.has(i.slug)) return false; seen.add(i.slug); return true; });

// 按编码前缀归类(房间类型大类)
const byPrefix = {};
unique.forEach(i => {
  const p = i.code.replace(/-I$/, "").split("-")[0];
  byPrefix[p] = (byPrefix[p] || 0) + 1;
});

fs.writeFileSync(__dirname + "/../data/2026-10-18-standard-components.json", JSON.stringify(unique, null, 2));
console.log("组件总数:", unique.length);
console.log("编码前缀分布(前30):");
Object.entries(byPrefix).sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([k, v]) => console.log("  " + k + ": " + v));
