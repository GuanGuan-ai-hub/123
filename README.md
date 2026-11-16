# iHFG 医疗设施标准指南 · 逆向与复刻

> 目标站点:healthfacilityguidelines.com(iHFG,TAHPI/HPI 生态)
> 仓库定位:**公开仓库** — 逆向报告、可复现数据流水线、中文复刻站源码。原站版权数据仅存本地,不入库(见「版权说明」)。

## 仓库结构

```
医疗/
├── docs/                      # 报告与设计文档
│   ├── 2026-10-18-iHFG网站逆向报告.md      # 主报告(12 节:业务/路由/数据模型/技术栈/视觉/API 实证)
│   └── 2026-10-19-HFBS对标在线编辑产品设计.md  # SaaS 产品设计(M1-M4 路线)
├── data/                      # 结构化数据产物(scripts/ 可复现)
│   ├── 2026-10-18-standard-components.json   # 607 组件索引(slug/name/code,事实索引)
│   └── 2026-10-19-guidelines-structure.json  # 10 指南分册结构(分册名+PDF slug 清单)
├── scripts/                   # 抓取与解析流水线(按数据血缘排序)
│   ├── 2026-10-18-extract-components.js      # 列表页 → 组件索引
│   ├── 2026-10-18-fetch-all-rds.js           # 索引 → 607 详情页抓取(并发 4)
│   ├── 2026-10-18-refetch-retries.js         # 429 限流补抓(串行+退避)
│   ├── 2026-10-18-parse-item.js              # 单详情页结构探查
│   ├── 2026-10-18-parse-rds.js               # 607 HTML → rds-database.json(产物本地保留)
│   ├── 2026-10-19-parse-guidelines.js        # 10 分册 HTML → 分册结构
│   ├── 2026-10-19-parse-subpages.js          # 8 个 Home 子页解析
│   └── archive/               # 一次性脚本存档(留档不删除)
├── assets/                    # 复刻站截图(原站基准截图不入库)
├── 2026-10-18-ihfg-cn/        # ★ 中文复刻站(Next.js 16 App Router,详见其 README)
├── .editorconfig              # 团队统一编辑规范
├── .gitattributes             # 行尾与二进制规则
├── .gitignore
├── CONTRIBUTING.md            # 协作规范(分支/提交/PR/版权)
└── README.md
```

## 快速开始

### 1. 复刻站(推荐入口)

```bash
cd 2026-10-18-ihfg-cn
npm install
npm run dev                        # http://localhost:3000
```

可选:启用 607 全量详情页(FULL-RDS 模式,版权数据需自备):

```bash
cp ../data/2026-10-18-rds-database.json data/rds-database.json   # 本地操作,该文件不入库
npm run build && npm start         # 缺失时自动降级为索引展示,构建不受影响
```

### 2. 数据流水线(复现 data/ 产物)

```bash
# Node.js ≥ 22.19(依赖全局 fetch);raw/ 需自备(版权数据不入库)
node scripts/2026-10-18-extract-components.js
node scripts/2026-10-18-fetch-all-rds.js     # 并发 4,礼貌抓取
node scripts/2026-10-18-parse-rds.js
```

## 数据血缘(可复现流水线)

```
原站列表页 raw/pages/standard-components-list.html(本地)
  └─[extract-components]→ data/2026-10-18-standard-components.json (607 索引)
      └─[fetch-all-rds + refetch-retries]→ raw/items/*.html (607 页,本地)
          └─[parse-rds]→ data/2026-10-18-rds-database.json(全量 RDS,本地保留,不入库)
              └─(本地复制)→ 复刻站 data/rds-database.json(.gitignore 排除)

原站分册页 raw/guidelines/*.html(本地)
  └─[parse-guidelines]→ data/2026-10-19-guidelines-structure.json
```

## 版权说明(红线)

| 内容 | 状态 | 说明 |
|------|------|------|
| 607 条组件索引 | 入库 | 名称+编码为事实索引 |
| 10 分册结构 | 入库 | 分册名 + PDF slug 清单,事实索引 |
| 复刻站源码与自编中文内容 | 入库 | 3 个 RDS 样本、63 FPU / 10 分册译文为自编 |
| raw/ 全量抓取 | **不入库** | TAHPI 版权;仅本地内部分析使用 |
| data/2026-10-18-rds-database.json | **不入库** | TAHPI 版权;复刻站 FULL-RDS 模式需自备 |
| 原站基准截图 | **不入库** | 截图呈现原站页面 |

> 原站内容(RDS 数据、指南 PDF、RLS 图纸)版权归 TAHPI 所有。本仓库仅复刻功能与架构;正式运营需自建中文内容(如对接国内设计规范)或获得授权。

## 协作方式(摘要)

- 分支命名:`feature/xxx`、`fix/xxx`、`docs/xxx`,禁止直接推 `main`
- 提交信息:中文或英文均可,格式 `type: 描述`(feat/fix/docs/chore/data)
- PR 合并前至少一人 review;详见 [CONTRIBUTING.md](CONTRIBUTING.md)

## 运行环境

- Node.js ≥ 22.19(依赖全局 fetch)
- 抓取礼貌性:并发 4 / 串行 2.5s 间隔 / 429 指数退避(脚本已内置)
- 原站对高频请求返回 429,复现时请保留退避逻辑
