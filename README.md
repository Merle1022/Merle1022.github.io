# 梅爾 Merle

以 Astro 官方 Blog template 為基礎的個人部落格與作品集，正式主機遷移目標為 Cloudflare Pages，網域為 merle188.com。

## 寫文章

在 `content/posts/` 新增 Markdown 或 MDX：

```yaml
---
title: "文章標題"
description: "文章摘要"
date: 2026-07-20
tags: [設計, 筆記]
draft: false
---
```

作品放在 `content/works/`，頁面會自動渲染成響應式三欄卡片。

## 本機開發

```sh
npm install
npm run dev
```

## GitHub Pages 與自訂網域

切換完成後，推送到 `main` 會讓 Cloudflare 建置正式網站，GitHub Actions 則產生舊網址的立即轉址頁。先在 repository 的 **Settings → Pages → Source** 選擇 **GitHub Actions**。

要改用自訂網域時，在 repository 的 **Settings → Environments → github-pages** 設定：

- `SITE_URL`：例如 `https://example.com`
- `BASE_PATH`：`/`

並依 GitHub Pages 指示設定 custom domain 與 DNS；網站程式本身不需改結構。

## Cloudflare 部署

- 正式網址：`https://merle188.com`（DNS 與 HTTPS 驗收後才算切換完成）。
- GitHub repository：`Merle1022/Merle1022.github.io`，production branch：`main`。
- Cloudflare Pages 專案名稱：`merle-website`。
- Build command：`npm run build`，Build output directory：`dist`；由 Pages 自動部署。
- 靜態檔目錄：`dist`；不使用 SSR／資料庫，沒有每次瀏覽都執行的 Worker 程式。
- Node 版本：`.node-version`；可明確設定 `SITE_URL=https://merle188.com`、`BASE_PATH=/`。
- 使用 Cloudflare Pages Git 整合部署。新網域的 Sitemap、RSS、robots.txt 與 canonical 由建置產生；12週陪跑的獨立 HTML 已更新分享網址。
- `tealove-schedule` 是另一個獨立作品，仍保留它原本的 GitHub Pages 服務網址。
- 搬站驗收與回復流程見 [docs/cloudflare-migration.md](docs/cloudflare-migration.md)。

GitHub Pages 不支援任意 HTTP 301 規則；舊站使用立即 meta refresh 與 canonical，並以 JavaScript 保留查詢參數及 fragment。它不會設定整個使用者網站的 CNAME，因此其他 repository 的專案網站不會被一起改網域。
