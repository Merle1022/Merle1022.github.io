# 網站私人備份

獨立私人倉庫：[merle-website-private-backup](https://github.com/Merle1022/merle-website-private-backup)。建立日期 2026-10-17；只作還原，不連接部署。

備份工作副本位於本專案 `.local-backups/private-github/merle-website-private-backup/`。主網站的 `.gitignore` 會排除整個 `.local-backups/`，兩個倉庫分開提交。

保存網站原始碼與文章、圖片、AGENTS 與文章框架、共用技能、網站相關 Kagami／Notion 紀錄、Git 歷史及 stash、先前未發布實驗、Cloudflare Pages／DNS／導向設定與 D1 愛心資料庫、三張首頁概念稿與驗收畫面。BUILDLOG、檔案校驗清單與還原說明位於私人倉庫根目錄。

不備份登入 Cookie、OAuth／API token、SSH 私鑰與銀行驗證資料。Portaly 目前未登入，只保存公開贊助方案，私人交易與提領資料需登入後另行匯出。Notion 與 Kagami 僅保存網站相關內容，並非帳戶完整備份。

這是手動日期快照，不會自動追蹤未來文章或愛心資料變更。下次更新需重新匯出與推送；不要將含未核准文章或資料庫的私人備份推送到公開網站倉庫。

還原時先 clone 私人備份、執行 `python3 scripts/verify-backup.py`，再依 README 在隔離副本還原網站與全新資料庫，確認後才恢復部署。
