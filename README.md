# 梅爾 Merle

以 Astro 官方 Blog template 為基礎的個人部落格與作品集，正式主機為 Cloudflare Pages，網域為 merle188.com。

## 專案入口

主要工作資料夾是 `/Users/mac/Documents/01_專案/個人網站作品集`。規則、版型與文章都在本專案內；從 [00｜索引.md](00｜索引.md) 開始，規則見 [AGENTS.md](AGENTS.md)，自動套用項目見 [文章框架.md](文章框架.md)。`CLAUDE.md` 是同一份規則的符號連結。

## 寫文章

先複製 [templates/article.md](templates/article.md) 到 `content/posts/`，填入欄位並保持草稿；完整文章經 Merle 明確同意後才發布。Markdown 或 MDX 的欄位範例：

```yaml
---
title: "文章標題"
description: "文章摘要"
date: 2026-07-20
tags: [設計, 筆記]
draft: true
---
```

作品放在 `content/works/`，頁面會自動渲染成響應式三欄卡片。

## 本機開發

```sh
npm install
npm run dev -- --background
```

## GitHub Pages 與自訂網域

推送到 `main` 會讓 Cloudflare 建置正式網站，GitHub Actions 則產生舊網址的立即轉址頁。GitHub Pages Source 已設定為 **GitHub Actions**。自訂網域與 DNS 由 Cloudflare 管理，不設定 GitHub Pages CNAME，以保留其他 repository 專案網站。

## Cloudflare 部署

- 正式網址：`https://merle188.com`，DNS、HTTPS 與17頁驗收已通過。
- GitHub repository：`Merle1022/Merle1022.github.io`；Pages production branch 為 `main`，已啟用自動部署；PR #3 已核准合併。
- Cloudflare Pages 專案名稱：`merle-website`。
- Build command：`npm run build`，Build output directory：`dist`；由 Pages 自動部署。
- 靜態檔目錄：`dist`；文章與頁面維持靜態，不使用 SSR。只有 `/api/likes` 使用 Pages Functions 與 D1，文章尾端才載入愛心。
- Node 版本：`.node-version`；可明確設定 `SITE_URL=https://merle188.com`、`BASE_PATH=/`。
- 使用 Cloudflare Pages Git 整合部署。新網域的 Sitemap、RSS、robots.txt 與 canonical 由建置產生；12週陪跑的獨立 HTML 已更新分享網址。
- `tealove-schedule` 是另一個獨立作品，仍保留它原本的 GitHub Pages 服務網址。
- 搬站驗收與回復流程見 [docs/cloudflare-migration.md](docs/cloudflare-migration.md)。

GitHub Pages 不支援任意 HTTP 301 規則；舊站使用立即 meta refresh 與 canonical，並以 JavaScript 保留查詢參數及 fragment。它不會設定整個使用者網站的 CNAME，因此其他 repository 的專案網站不會被一起改網域。

## 文章互動

全部文章底部提供可取消的共用愛心、LINE／Threads／Facebook 分享、複製連結及裝置支援時的原生分享；另連到既有 Portaly 贊助頁。設定與驗證見 [docs/article-engagement.md](docs/article-engagement.md)。
