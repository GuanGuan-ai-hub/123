# 贡献与协作规范

本仓库是团队协作的公开仓库。开始贡献前请读完本文;有疑问在群里说一声即可。

## 版权红线(必读)

| 内容 | 位置 | 规则 |
|------|------|------|
| TAHPI 版权数据 | `raw/`(本地)、`data/2026-10-18-rds-database.json`(本地)、原站基准截图(本地) | **任何情况下不得提交入库、不得上传网盘/第三方**;`.gitignore` 已拦截,但请勿绕过 |
| 复刻站全量数据 | `2026-10-18-ihfg-cn/data/rds-database.json` | 已被 .gitignore 排除;本地放置后启用 607 全量详情页,队友各自按 README「快速开始」自备复制 |
| 自编中文内容 | 复刻站 3 个 RDS 样本、63 FPU / 10 分册译文 | 自有内容,可自由修改 |

**本仓库为公开仓库,版权数据永不入库。** 新增文件前请自查:内容是否直接来自原站页面/PDF?是则只放本地 `raw/`,不入库。

## 仓库结构决策

- **单仓库**:逆向资产与复刻站统一在一个仓库,一次 clone 全部可得。
- 复刻站曾经的独立 git 历史已合并(原 2 条本地提交留档于外部备份)。
- 顶层 `.gitignore` 已排除 `node_modules/`、`.next/`、`out/`、`.server-data/`、复刻站版权数据文件;复刻站内部还有一份自己的 `.gitignore` 兜底。

## 分支模型

```
main              # 常驻分支,保持随时可运行
├── feature/xxx   # 新功能(如 feature/rds-search)
├── fix/xxx       # 缺陷修复(如 fix/cart-dedup)
└── docs/xxx      # 纯文档改动
```

- **禁止直接向 `main` 推送**;所有改动走 Pull Request。
- 分支从最新 `main` 切出;PR 合并后删除远端分支。

## 提交规范

格式:`type: 简短描述`(中英文均可)

| type | 用途 |
|------|------|
| feat | 新功能(复刻站页面、API) |
| fix | 缺陷修复 |
| docs | 文档(报告、README) |
| data | 数据产物更新(rds-database.json 等脚本产物) |
| chore | 构建、依赖、配置 |

示例:
- `feat: 组件列表页增加大类筛选`
- `data: 重新解析 607 RDS,修复装修表缺列`

## Pull Request 流程

1. 从 `main` 切出分支,完成改动并本地自测(复刻站改动请跑 `npm run build` 确认可构建)。
2. 推送分支,向 `main` 发起 PR,描述清楚改了什么、为什么。
3. 至少一名队友 review 并 approve 后方可合并;冲突由 PR 作者负责 rebase。
4. 合并采用 **Squash and merge**,保持 `main` 历史整洁。

## 各目录改动手则

### 复刻站 `2026-10-18-ihfg-cn/`

- 开发:`npm run dev` → http://localhost:3000
- 构建:`npm run build`(全栈);`STATIC_EXPORT=1 npm run build`(纯静态导出)
- API 契约测试:`bash scripts/api-test.sh`(13 场景)
- 涉及后端接口改动时,同步更新其 README 的 API 表格

### 数据流水线 `scripts/`

- 新脚本命名:`YYYY-MM-DD-用途动词.js`,与现有风格保持一致
- 改脚本后重跑并提交产物时,`type` 用 `data:`,PR 描述注明数据血缘变化
- 抓取脚本必须保留并发/退避礼貌逻辑,不得放大频率

### 文档 `docs/`

- 报告类文件以日期前缀命名,修改请在文首维护变更记录

## 本地环境

- Node.js ≥ 22.19
- Windows / macOS / Linux 均可;仓库已配置 `.editorconfig`,请让编辑器插件生效
- 行尾统一 LF(`.gitattributes` 若后续引入以仓库为准)

## 常见问题

**Q:clone 后复刻站详情页只有索引,没有 RDS 三表?**
A:正常,版权数据不入库。用数据流水线自产数据后,执行 `cp data/2026-10-18-rds-database.json 2026-10-18-ihfg-cn/data/rds-database.json` 重新构建即启用。

**Q:想跑数据流水线?**
A:见根 README「数据血缘」,原站有 429 限流,请保留脚本内置退避。

**Q:不小心把敏感/版权文件提交了?**
A:立即在群里说明,由仓库管理员评估是否需要清史重写(rewrite history)并通知全员重新 clone。
