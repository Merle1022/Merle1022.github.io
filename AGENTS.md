## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## 【文章發布確認關卡】

新增或大幅改寫文章時，完成 SEO／GEO 與去 AI 味處理後，必須先把完整文章貼在對話內供 Merle 審閱。只有在 Merle 明確回覆可以上架後，才能 commit、push 或觸發部署；「完成文章」「跑流程」均不視為發布授權。

## 【完工回報協議】

新作品命名格式：「中文功能名｜英文原名」（英文原名 = repo 名或產品名）

每當完成以下任一事項：部署上線、建立新 repo、完成一個可交付成果——

收尾時必須執行：

1. 更新 Notion「🛠️ 作品專案總覽」（data_source_id:
   `0b825b65-d2dd-4f90-a6a3-7c461d3ed70a`）：
   新作品建一筆（名稱/狀態/連結/一句話說明/技術棧），
   既有作品更新狀態與上線日期
2. 若產出屬於方法論/決策先例，同步一份 md 進 Kagami vault
3. 回報訊息末尾附一行：「已登錄 Notion ✅」讓 Merle 確認

## 【新 Repo 的 BUILDLOG 規則】

建立任何新 repo 時，根目錄預設加入 `BUILDLOG.md`，格式以
`templates/BUILDLOG.md` 為準。內容只記錄可公開的起源、經手鏈、關鍵決策與
迭代紀錄，不得包含 API key、個資、完整 prompt 或實際服務端點。敏感過程細節
另存 Kagami `system/cases/`，不進公開 repo。

這樣三方的分工就閉環了：**Notion 是共用帳本**（誰做的都寫進去）、**Kagami 是真相層**（方法論和決策）、**Claude 的 memory 是對話層**（在我這裡發生的事）。金鑰鍊成器那種「做了但沒人記得在哪做的」情況就不會再發生。唯一剩下的人工動作是：你在 Claude 這邊做完事、或 Codex 回報完成時，跟我說一聲，我把 Notion 狀態更新掉——這個你已經在做了。


## 【主要專案與文章框架】

- Merle 指定的主要工作資料夾是 `/Users/mac/Documents/01_專案/個人網站作品集`。正式文章、版型、元件、樣式、部署設定與維護文件必須能在這個專案內找到；不要只把正式修改留在外部 worktree。
- 除非 Merle 明確要求隔離工作目錄，直接在主要專案內建立功能分支。更新前確認目前分支與遠端 main；發布完成後將主要專案同步回 main。若有未發布修改，先完整備份，不得直接覆寫或夾帶上線。
- 唯一共用規則以本檔 `AGENTS.md` 為準；`CLAUDE.md` 是指向本檔的符號連結，兩個名稱讀到的是同一份內容，不另行改寫或維護第二套規則。不要另建內容重複的 `agent.md`。
- 開始新增或調整文章前，閱讀根目錄 `文章框架.md`；新文章可複製 `templates/article.md`。正文寫作彈性保留，不強制所有文章使用相同段落。
- 共用呈現入口是 `src/layouts/BlogPost.astro`，愛心／分享／贊助是 `src/components/ArticleEngagement.astro`，欄位驗證是 `src/content.config.ts`。一般文章放在 `content/posts/`，勿逐篇複製共用介面。
- 本機備份放 `.local-backups/`，不得 commit、push 或部署；未核准文章與暫緩的翻譯、留言功能也不得因同步而上線。
