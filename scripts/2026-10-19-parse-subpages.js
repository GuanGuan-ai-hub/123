const fs = require("fs");
const path = require("path");

for (const f of ["FAQs", "ConditionsOfUse", "Contributors", "Links", "Schedule", "Contact", "Copyright", "Disclaimer"]) {
  const html = fs.readFileSync(path.join(__dirname, "../raw/home", f + ".html"), "utf8");
  const hs = [...html.matchAll(/<h([34])[^>]*>([^<]{3,90})<\/h\1>/g)]
    .map(m => m[2].trim())
    .filter(t => !/Guidelines|Functional Planning|Standard Comp|Briefing System/.test(t));
  console.log("== " + f + " ==", hs.slice(0, 6).join(" | "));
}

const faq = fs.readFileSync(path.join(__dirname, "raw/home/FAQs.html"), "utf8");
const qs = [...faq.matchAll(/<(b|strong|h4)[^>]*>([^<]{10,90})</g)].map(m => m[2].trim());
console.log("== FAQ 问题样本 ==");
[...new Set(qs)].slice(0, 10).forEach(q => console.log(" -", q));

// Links 页外链
const links = fs.readFileSync(path.join(__dirname, "raw/home/Links.html"), "utf8");
const ext = [...new Set([...links.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(m => m[1]).filter(h => h.indexOf("healthfacilityguidelines") === -1 && h.indexOf("w3.org") === -1))];
console.log("== Links 页外链 ==");
ext.slice(0, 12).forEach(l => console.log(" -", l));
