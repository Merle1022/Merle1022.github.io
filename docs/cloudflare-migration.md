# Cloudflare 主機搬遷

日期：2026-10-16。Merle 確認實際購入網域為 merle188.com，取代先前討論的 merlejuan.com。

## 設計
保留 GitHub repository 與文章路徑，使用 Cloudflare Workers Static Assets 提供 Astro 產生的靜態檔案。建置 npm run build、部署 npm run deploy，Node 22.16.0。純靜態內容不增加 SSR、會員或付費服務。

## 完成順序與驗收
1. 使用現行 main 的七篇文章與版型；不使用舊工作目錄的未發佈內容。
2. 建置並確認所有文章、Sitemap、RSS、canonical、OG、robots.txt 均指向新網址；超過25MiB檔案先處理。
3. Cloudflare 連接 GitHub，限定網站 repository；建立 merle-website，確認首次部署成功。
4. 先驗收 Cloudflare 預覽網址；再將 merle188.com 接為 custom domain。
5. HTTPS、首頁、七篇文章、圖片、中文路徑、404 均需驗收；www 應永久導向裸網域且保留路徑及參數。
6. 處理舊 GitHub Pages 網址的永久導向。其他 repository 的專案網站（例如 tealove-schedule）必須另測，不可讓它們被錯導向個人網站。
7. Search Console 驗證新網域、提交新 Sitemap，再視舊站導向與資格執行網址變更。索引申請不代表收錄。
8. Notion 更新正式網址與實際部署狀態，Kagami 記錄決策與限制。

## 可能問題與處理
| 問題 | 處理 |
|---|---|
| GitHub 登入或 Cloudflare app 授權 | Merle 完成登入；只開放本站 repository，授權完成後繼續 |
| 建置失敗 | 查看第一個錯誤，核對 Node 版本、npm ci、build command 與 dist；不盲目重跑 |
| DNS 或憑證未生效 | 等候並查狀態，不以關閉 HTTPS 或略過安全警告處理 |
| Sitemap 有 localhost／舊網域 | 核對 SITE_URL、BASE_PATH 與硬編碼 HTML，重新建置 |
| 網頁顯示卻是404或舊版 | 核對部署 commit、輸出目錄與 trailing slash，確認中文路徑 |
| 舊站與新站並存 | 設定永久導向與一致 canonical，保留原文章路徑 |
| 外部作品連結失效 | 分開處理專案網站；不可全面字串替換所有 github.io URL |
| 搜尋尚未收錄 | 檢查新資源與 Sitemap 狀態；不以重新申請冒充已收錄 |

## 回復
新站驗收前保持 GitHub Pages 舊站可用。若切換失敗，先回復原 DNS／部署設定並保留兩站內容，避免刪除舊 repo 或文章。已啟用的永久導向需評估瀏覽器快取再修改。

## 當前狀態
本機 Astro build、兩項閱讀時間測試及 Wrangler 4.151.1 dry-run 均通過；輸出58個檔案。Sitemap 17個網址的 canonical 全部一致，含七篇文章；RSS、robots.txt、404 noindex 與單檔25MiB限制均通過。Cloudflare 網域為 Active。GitHub 登入／Cloudflare GitHub 連接待 Merle 完成。尚未宣稱正式搬站成功，部署驗收後追加紀錄。
