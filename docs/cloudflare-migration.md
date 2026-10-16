# Cloudflare 主機搬遷

日期：2026-10-16。Merle 確認實際購入網域為 merle188.com，取代先前討論的 merlejuan.com。

## 設計
保留 GitHub repository 與文章路徑，使用 Cloudflare Pages 提供 Astro 產生的靜態檔案。建置 npm run build、輸出 dist，由 Pages Git 整合自動部署，Node 22.16.0。純靜態內容不增加 SSR、會員或付費服務。

## 完成順序與驗收
1. 使用現行 main 的七篇文章與版型；不使用舊工作目錄的未發佈內容。
2. 建置並確認所有文章、Sitemap、RSS、canonical、OG、robots.txt 均指向新網址；超過25MiB檔案先處理。
3. Cloudflare 連接 GitHub，限定網站 repository；建立 Pages 專案 merle-website，確認首次部署成功。
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

## 初始準備狀態（歷史紀錄）
本機 Astro build、兩項閱讀時間測試及 Wrangler 4.151.1 dry-run 均通過；輸出58個檔案。Sitemap 17個網址的 canonical 全部一致，含七篇文章；RSS、robots.txt、404 noindex 與單檔25MiB限制均通過。Cloudflare 網域為 Active。GitHub 登入／Cloudflare GitHub 連接已由 Merle 完成。尚未宣稱正式搬站成功，部署驗收後追加紀錄。

## Pages 路徑調整
Cloudflare Workers 的自動建置會建立跨服務 API token；純靜態網站改採 Pages Git 整合，不新增該 token。移除尚未上線的 Wrangler 套件與設定。自動審核擋下直接 push main，先用 codex/cloudflare-migration 作為 Pages production branch；main 與原 GitHub Pages 設定尚未變更，待新站驗收後取得明確核准。

## 舊站轉址方案（等待 main 核准）
GitHub Pages 不提供任意 HTTP 301 規則，且使用者網站 CNAME 可能連帶影響其他專案網站，因此不變更 CNAME。獨立分支已準備 scripts/build-legacy-redirects.mjs：GitHub workflow 建置後複製輸出，僅將本站17個HTML頁面改為立即 meta refresh、指向新頁的canonical及保留query/hash的location.replace；404與靜態資產保留。Cloudflare仍只部署正常dist。須取得Merle對更新main／舊站部署的明確確認後才啟用。

## Cloudflare 上線驗收（2026-10-16）
- Pages 專案 merle-website 部署成功，初始 commit ff96d49。主機採 Pages Git 整合，不使用額外API token。
- merle188.com 與 www.merle188.com 均 Active、SSL enabled；啟用初期的522已消失。
- 正式站17頁 HTTP200且canonical正確，含七篇文章；17個圖片、CSS、JS等資產均HTTP200；不存在路徑確實404。
- Cloudflare帳戶Bulk Redirect清單merle_canonical與規則Merle canonical domain均啟用；www及merle-website.pages.dev導向merle188.com，301、保留query、子路徑及path suffix。正常瀏覽器導覽已驗證兩種別名均保留文章路徑和query。
- Search Console新網址資源已透過Google代碼管理工具自動驗證；sitemap-index.xml已成功提交。提交時報表仍無法擷取、探索0。21:17:51（Asia/Taipei）Google即時測試擷取成功且允許檢索，這不代表Sitemap報表已處理或文章已收錄。
- 草稿PR：https://github.com/Merle1022/Merle1022.github.io/pull/3 。舊站轉址workflow已透過GitHub網頁提交到搬站分支並核對與本機相同，未部署舊站。
- 自動審核拒絕直接更新main，理由為可能改變既有GitHub Pages部署。main仍為be856083；已向Merle請求明確同意合併PR、Pages改追main及啟用舊站轉址，未收到同意前不執行。
- URL-prefix資源已驗證；沒有宣稱完成DNS網域資源或Search Console網址變更。舊站轉址尚未啟用，因此不先宣稱完整搜尋搬站已結束。

## main 切換完成（2026-10-16）
Merle 明確同意合併並啟用舊站轉址。PR #3 已合併（9d479d5），GitHub Pages Source 已切換為 Actions；轉址部署成功。Cloudflare production branch 已改為 main，自動部署啟用。瀏覽器實測舊文章網址可保留路徑、query 與 fragment 到新站。其後 main 另有已發布文章／作品更新 8e7269e，搬站不回退該更新。Search Console 主 Sitemap 報表重查仍顯示無法擷取／探索0；先前 Google 即時擷取成功，尚不能宣稱已收錄或已完成網址變更工具。
