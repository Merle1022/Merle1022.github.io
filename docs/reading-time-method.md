# 閱讀時間估算與版本核對

更新：2026-10-16。

採用每分鐘約 400 個中文字與 238 個英文單字，以正文分別計數、相加並向上取整，至少 1 分鐘。排除 Markdown 連結網址、圖片標記、註解及程式碼區塊；不另計停下思考、看圖或照做教學所需時間。

依據：Marc Brysbaert (2019), How many words do we read per minute? A review and meta-analysis of reading rate, Journal of Memory and Language 109, 104047. DOI: https://doi.org/10.1016/j.jml.2019.104047 。英文非小說默讀估計為每分鐘 238 詞；中文默讀分析納入 18 項研究、786 人，估計每分鐘 260 詞，部分資料採每詞 1.5 字轉換。本網站將約 390 字／分鐘取整為 400 字，屬編輯估算值，不能說是台灣全民平均值。中文「詞」不可直接當成「字」。

版本核對：此 worktree 以 2026-10-16 實際核對的 GitHub main（974a18b）為基礎，包含七篇文章。先前原工作目錄在舊分支，只有兩篇，不能代表現行網站。這次沒有改寫或刪除文章正文，保留現行版型、圖片、FAQ 與文章更新紀錄。

翻譯、語言偵測、留言依 Merle 決定暫緩；此修正版不含語言選單、翻譯工作流程或留言服務。舊目錄的翻譯程式僅保留供日後參考，不自動啟用。

驗證：以正式 SITE_URL 執行 npm run build；node --test tests/reading-time.test.mjs。部署沿用 GitHub Pages 工作流程；本次只修改導覽與閱讀估算，不改寫文章正文。
