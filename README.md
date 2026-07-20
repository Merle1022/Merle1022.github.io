# 梅爾 Merle

以 Astro 官方 Blog template 為基礎的個人部落格與作品集，部署於 GitHub Pages。

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

推送到 `main` 後，GitHub Actions 會自動建置與部署。先在 repository 的 **Settings → Pages → Source** 選擇 **GitHub Actions**。

要改用自訂網域時，在 repository 的 **Settings → Environments → github-pages** 設定：

- `SITE_URL`：例如 `https://example.com`
- `BASE_PATH`：`/`

並依 GitHub Pages 指示設定 custom domain 與 DNS；網站程式本身不需改結構。
