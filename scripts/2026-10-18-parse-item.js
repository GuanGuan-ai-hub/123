const fs = require("fs");
const html = fs.readFileSync(__dirname + "/../raw/pages/itemdetail-1BR-BA-20.html", "utf8");

const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g)].map(m => m[1]).filter(s => s.indexOf("ihfg") === -1 && s.indexOf("logo") === -1);
console.log("=== 图片(非logo) ===");
[...new Set(imgs)].slice(0, 8).forEach(s => console.log(s));

const links = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]).filter(h => /\.(pdf|dwg|rvt|zip|docx?|xlsx?|ifc)/i.test(h) || h.toLowerCase().includes("download"));
console.log("=== 下载类链接 ===");
[...new Set(links)].slice(0, 10).forEach(s => console.log(s));

const tables = (html.match(/<table[^>]*>/g) || []).length;
console.log("=== 表格数量:", tables);

const heads = [...html.matchAll(/<h([1-4])[^>]*>([^<]{2,80})</g)].map(m => "h" + m[1] + ": " + m[2].trim());
console.log("=== 标题结构 ===");
heads.slice(0, 25).forEach(s => console.log(s));

// RDS 数据行:提取所有 <th>...</th><td>...</td> 对
const rows = [...html.matchAll(/<t[hd][^>]*>(.*?)<\/t[hd]>/gs)].map(m => m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()).filter(t => t.length > 0 && t.length < 120);
console.log("=== 表格单元格序列(前80) ===");
rows.slice(0, 80).forEach((t, i) => console.log(i + ": " + t));
