# Sub-Store Cloudflare Frontend

> **Astro · UnoCSS · Hono · Preact**

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-6.x-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Preact](https://img.shields.io/badge/Preact-10.x-673AB8?logo=preact&logoColor=white)](https://preactjs.com/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-66.x-333333?logo=unocss&logoColor=white)](https://unocss.dev/)
[![Hono](https://img.shields.io/badge/Hono-4.x-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/IchimaruGin728/Sub-Store-Cloudflare-Fronted)
[![GitLab](https://img.shields.io/badge/GitLab-Mirror-FC6D26?logo=gitlab&logoColor=white)](https://gitlab.com/IchimaruGin728/sub-store-cloudflare-fronted)

---

## 📋 概述

Sub-Store Cloudflare 的前端 Dashboard，通过 Hono API 代理层调用 worker-rs 后端。

**技术栈：**
- 🚀 **Astro 6** — SSR on Cloudflare Pages
- 🎨 **UnoCSS** — 原子化 CSS
- ⚡ **Hono** — API 代理层 + Token 注入
- 🧩 **Preact** — 交互式岛屿组件
- 🔧 **Biome** — 代码格式化

---

## 🏗️ 架构

```
┌─────────────────────────────────────────┐
│  Cloudflare Pages (Astro SSR)           │
│                                         │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │ Astro Pages  │  │ Hono API Proxy  │  │
│  │ (SSR)        │  │ (Token 注入)    │  │
│  └──────┬──────┘  └────────┬────────┘  │
│         │                  │            │
│  ┌──────▼──────┐           │            │
│  │ Preact 组件  │           │            │
│  │ (Islands)    │           │            │
│  └─────────────┘           │            │
└────────────────────────────┼────────────┘
                             │ fetch + Bearer token
                    ┌────────▼────────┐
                    │ worker-rs 后端   │
                    │ (Rust 原生)      │
                    └─────────────────┘
```

---

## 📁 页面

| 路径 | 说明 |
|------|------|
| `/` | Dashboard 概览 · 统计卡片 · 快捷操作 |
| `/subscriptions` | 订阅管理 · CRUD · 远程拉取 · 导出 |
| `/collections` | 组合管理 |
| `/files` | 文件管理 |
| `/settings` | 设置 · Token · 备份恢复 |

---

## 🧩 组件

| 组件 | 说明 |
|------|------|
| `ProcessorBuilder` | 可视化构建处理器管道 |
| `ExportPanel` | 多格式导出预览 · 复制/下载 |
| `RefreshStatus` | 刷新状态 · 错误日志 |

---

## 🚀 部署

### Cloudflare Pages

1. Dashboard → Workers & Pages → Create → **Pages** → **Connect to Git**
2. 选择 `Sub-Store-Cloudflare-Frontend` 仓库
3. 配置：
   - **Build command**: `npm run build`
   - **Build output**: `dist`
   - **Environment variables**:
     - `NODE_VERSION` = `26.1.0`
     - `ENABLE_PNPM` = `true`
   - **Compatibility date**: `2026-05-17`
   - **Smart placement**: 开启

### 本地开发

```bash
npm install
npm run dev           # http://localhost:4321
npm run build         # 生产构建
```

---

## 🔧 配置

### 后端 URL

在 `src/pages/api/[...path].ts` 中配置：

```typescript
const BACKEND_URL = "https://sub-store-cloudflare.your-subdomain.workers.dev";
```

或通过环境变量 `BACKEND_URL` 设置。

### 认证

Token 通过 cookie 传递，由 Hono 代理层注入到后端请求。

---

## 📁 项目结构

```
src/
├── layouts/
│   └── Layout.astro           # 主布局 (侧边栏 + 内容区)
├── pages/
│   ├── index.astro            # Dashboard
│   ├── subscriptions/
│   ├── collections/
│   ├── files/
│   ├── settings.astro
│   └── api/
│       └── [...path].ts       # Hono API 代理
├── components/
│   ├── ProcessorBuilder.tsx   # 处理器配置器
│   ├── ExportPanel.tsx        # 导出面板
│   └── RefreshStatus.tsx      # 刷新状态
├── lib/
│   ├── api.ts                 # API 客户端
│   └── auth.ts                # 认证工具
└── styles/
    └── global.css             # 全局样式
```

---

## 🛡️ 许可证

[AGPL-3.0](LICENSE)

---

<p align="center">
  <sub>Built with ☕ and TypeScript</sub>
</p>
