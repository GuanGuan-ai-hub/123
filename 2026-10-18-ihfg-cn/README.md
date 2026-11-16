# 医疗设施设计标准指南(中文演示版)

对 iHFG(healthfacilityguidelines.com)的**架构与功能复刻演示项目**,基于逆向报告实现。

## 快速开始

```bash
npm install
npm run dev        # 开发模式 http://localhost:3000
npm run build && npm start   # 生产模式
```

## 页面结构(对齐原站路由)

| 路由 | 说明 | 原站对应 |
|------|------|---------|
| `/` | 首页:三板块入口 | `/` |
| `/standard-components` | 组件列表:搜索+大类筛选+分页(25/50/75/100) | `/StandardComponents` |
| `/standard-components/[slug]` | 组件详情:文件区(HFBS/RLS/Revit)+RDS 三表 | `/StandardComponents/ItemDetails/{slug}` |
| `/fpus` | 功能规划单元列表(63 个,中文) | `/FPUs` |
| `/guidelines/[part]` | 指南分册页(10 册,中文) | `/GuidelineIndex/Index/{part}` |

## 技术栈

- Next.js(App Router,SSG + API Routes 全栈)+ TypeScript + Tailwind CSS 4
- 后端:API Routes + JSON 文件存储(`.server-data/`,已 gitignore)+ 内存会话,零外部依赖
- 数据:3 个中文明样本 + 63 FPU / 10 分册(公开仓库);607 全量 RDS 为可选本地数据(见"数据说明")

## 后端 API(契约对齐原站逆向实证,见逆向报告 §12)

| 本站 API | 对齐原站 | 行为 |
|----------|---------|------|
| `POST /api/shopping-cart/add` | `POST /ShoppingCart/Add` | 返回购物车数量字符串;同 fileId 去重(原站实测行为) |
| `GET /api/shopping-cart` / `DELETE ?fileId=` | `/ShoppingCart` | 会话购物车查询/移除 |
| `GET /api/auth/session` | `GET /HFBSAPI/IsUserSessionValid` | {state, sessionValid, username} |
| `POST /api/auth/login` | `GET /HFBSAPI/Login` | **改进:POST 传输**(原站密码走 GET query 进日志) |
| `POST /api/auth/register` | `GET /HFBSAPI/Register` | 7 字段校验+查重(EXIST);scrypt 哈希 |
| `POST /api/share/email` | `POST /StandardComponents/ShareItemViaEmail` | 记录到 `.server-data/shares.json`(演示不真发) |
| `GET /api/components?q=&page=&size=` | —(原站无 API,全表 SSR) | 组件索引搜索/分页 |
| `GET /api/components/[slug]` | — | 607 全量 RDS 详情 |

- 会话:`sid` cookie(HttpOnly, SameSite=Lax),对齐原站 ASP.NET Session 模式
- 端到端测试:`bash scripts/api-test.sh`(13 场景全通过)

## 双模式构建

```bash
npm run build                            # 全栈(默认):含 API Routes
STATIC_EXPORT=1 npm run build            # 纯静态导出 out/(GitHub Pages 用,无后端功能)
NEXT_PUBLIC_BASE_PATH= npm run build     # 根路径部署
```

## 视觉规范(淡绿 · 编辑式版式)

参照建筑媒体(ArchDaily / 每日建筑)的编辑式排版:白底、大面积留白、细分割线、克制的强调色。

| 角色 | 色值 | 用途 |
|------|------|------|
| 主色 brand | `#7fb99a` | 实心色块、按钮、顶部细条(配深绿文字) |
| 主色 hover | `#68a889` | 按钮悬停 |
| 浅绿底 soft | `#e3f2e9` | 侧栏标题、标签、PDF/文件徽章 |
| 极浅底 mist | `#f4faf7` | 表格行悬停、局部底色 |
| 深绿 dark | `#16382b` | 页脚文字、数字与强调文字 |
| 正文 / 次文 / 元信息 | `#1b1f1d` / `#565b58` / `#8b918d` | 文字层级 |
| 分割线 | `#e5eae7` / `#cfd9d3` | 1px 细线 |
| 链接 | `#2f7d5c` | 正文链接 |

- 页头:白底 + 顶部 3px 淡绿细条 + 粘性定位,左侧品牌标识,右侧平铺导航(悬停下划线滑动)
- 标题:30px 半粗,上方 34px 淡绿短横(`.page-title::before`)
- 卡片:1px 细边框、无阴影,入口卡悬停轻微上浮 + 淡绿描边
- 表格:仅横向细线、无竖线,表头 11px 字距展开,行悬停浅绿
- 侧栏:A–Z 大字母淡绿索引,桌面端吸顶
- 内容区宽度 1240px,呼应杂志式栏宽

## 数据说明(版权红线)

| 数据 | 状态 | 说明 |
|------|------|------|
| 607 条组件索引 | 结构演示 | 名称+编码为事实索引;正式版建议替换为自有中文条目 |
| 3 个 RDS 详情样本 | 自编中文演示 | 结构完全对齐原站数据模型,内容为自编 |
| 63 个 FPU / 10 个分册 | 中文对照 | 单元名/分册名为自译对照,可自由修改 |
| data/rds-database.json | **不入公开仓库**(.gitignore) | TAHPI 版权;本地放置后自动启用 607 全量详情页(FULL-RDS),缺失时自动降级为索引展示,构建不受影响 |

> 原站内容(RDS 数据、指南 PDF、RLS 图纸)版权归 TAHPI 所有。本项目仅复刻功能与架构;正式运营需自建中文内容(如对接国内设计规范)或获得授权。

## 与逆向产物的关系

本目录是公开仓库(`医疗/`)的子目录,逆向报告、数据流水线脚本与事实索引均在仓库内:
- `../docs/` — 逆向报告、HFBS 对标产品设计
- `../data/` — 607 组件索引、分册结构(事实索引,已入库);全量 RDS 为本地可选数据(不入库)
- `../scripts/` — 抓取与解析脚本(可在本地复现全部数据)
- `../raw/` — 原站页面抓取(**仅本地保留,不入库**,TAHPI 版权)
- `../assets/` — 复刻站截图

启用 607 全量详情页:用流水线自产数据后 `cp ../data/2026-10-18-rds-database.json data/rds-database.json`(该文件被 .gitignore 排除,缺失时自动降级为索引展示)。
