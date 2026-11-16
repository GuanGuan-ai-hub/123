const fs = require("fs");
const p = "C:/Users/ASUS/Desktop/Obsidian-ABCDE(qiqi)-V5.2.4/Obsidian-ABCDE/01开发/网站逆向/2026-10-18-ihfg-cn/README.md";
let s = fs.readFileSync(p, "utf8");

const oldTable = `| 数据 | 状态 | 说明 |
|------|------|------|
| 607 条组件索引 | 结构演示 | 名称+编码为事实索引;正式版建议替换为自有中文条目 |
| 3 个 RDS 详情样本 | 自编中文演示 | 结构完全对齐原站数据模型,内容为自编 |
| 63 个 FPU / 10 个分册 | 中文对照 | 单元名/分册名为自译对照,可自由修改 |
| 原站 RDS 明细数据 | 未接入 | 已另行存档于上级目录(逆向分析用),**不得**直接发布上线 |`;

const newTable = `| 数据 | 状态 | 说明 |
|------|------|------|
| 607 条组件索引 | 结构演示 | 名称+编码为事实索引;正式版建议替换为自有中文条目 |
| 3 个 RDS 详情样本 | 自编中文演示 | 结构完全对齐原站数据模型,内容为自编 |
| 63 个 FPU / 10 个分册 | 中文对照 | 单元名/分册名为自译对照,可自由修改 |
| data/rds-database.json | **不入公开仓库**(.gitignore) | TAHPI 版权;本地放置后自动启用 607 全量详情页(FULL-RDS),缺失时自动降级为索引展示,构建不受影响 |`;

const oldRel = `上级目录 \`网站逆向/\`:
- \`2026-10-18-iHFG网站逆向报告.md\` — 完整逆向报告(业务/路由/数据模型/技术栈/视觉)
- \`2026-10-18-standard-components.json\` — 607 条组件索引(本项目 \`data/components-index.json\` 来源)
- \`2026-10-18-rds-database.json\` — 607 个 RDS 全量结构化数据(分析用,未接入本站)
- \`raw/\` — 原站页面样本、CSS、PDF、items/*.html 全量详情页`;

const newRel = `上级目录 \`网站逆向/\`(本地资产,不入公开仓库):
- \`docs/\` — 逆向报告、HFBS 对标产品设计
- \`data/\` — 607 组件索引、全量 RDS 结构化数据(本项目可选数据来源)、分册结构
- \`scripts/\` — 抓取与解析脚本(可复现全部数据)
- \`raw/\` — 原站页面样本、CSS、PDF、items/*.html 全量详情页(TAHPI 版权)
- \`assets/\` — 原站与复刻站对照截图`;

if (!s.includes(oldTable)) throw new Error("table block not found");
if (!s.includes(oldRel)) throw new Error("rel block not found");
s = s.replace(oldTable, newTable).replace(oldRel, newRel);
fs.writeFileSync(p, s);
console.log("README 已更新");
