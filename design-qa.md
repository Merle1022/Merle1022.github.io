# 首頁第 2 版驗收 — 2026-10-17

- Source visual truth: 私人備份 `design/concepts/homepage-2.png`（Merle 明確選定的第 2 張）。
- Implementation: http://localhost:4321/；桌機 `design/qa/desktop-final.png`、手機 `design/qa/mobile-final.png`。
- Full-view comparison: `design/qa/comparison-final.png`，來源與實作同一張並排比較；未依記憶判斷。
- Focused comparison: `design/qa/typography-focus.png`，比較標題、介紹、按鈕。圖片與側欄文字另在原尺寸畫面檢視。
- 上述證據皆位於本專案 `.local-backups/private-github/merle-website-private-backup/`，已納入獨立私人備份，避免將備份資料公開部署。
- Source 1402×1122 px；implementation 1402×1122 px；CSS viewport 1402×1122，deviceScaleFactor 1。無縮放密度落差。手機 390×844 px，DPR 1，內容寬 375 px（扣除捲軸）。
- State: 首頁初始狀態、淺色、無登入；Astro 開發工具列於截圖時隱藏。右側粉色瀏覽器擴充套件標記不屬網站。

## Findings / comparison history

1. 第一輪 [P2] 容器僅 1080px、摘要過長，右欄與作品入口向下延伸。改為首頁限定 1180px，文章摘要取符合真實內容的首頁短文；完整文章未修改。
2. 第二輪 [P2] 主圖／右欄比例與作品高度仍偏離。將左右 grid 調整為 1.55:1，縮小側欄分隔間距及主區底距、調整標題與次要按鈕寬度。
3. 最終並排比較：主文章、側欄、作者與作品入口完整呈現；作品區 y=1024.7–1112.9，未被視窗切掉。沒有剩餘 P0/P1/P2。

## Required fidelity surfaces

- 字體：延用網站 Noto Sans TC／system-ui；黑色粗標題、較小日期與灰色內文，層級及換行與設計相近。生成稿字形細節無法逐像素重現，列為 P3。
- 留白／版面：1180px 容器，左右文章欄、細分隔線，下方作品橫列；手機轉單欄，沒有水平溢位。
- 色彩：既有 #f7f6f2、#111、灰色細線、黃色主按鈕。小標採較深 #766800，避免設計稿亮黃色文字在米白底對比不足，此為可讀性修正。
- 圖片：使用原網站正式角色卡封面；保留圖片內文字，不以 HTML 覆蓋。作品縮圖重用真實封面，葉片與箭頭為 Bootstrap Icons 正式素材。未沿用生成稿虛構作品標誌。
- 文案：保留選定標題／作者介紹；摘要核對真實文章，未聲稱尚未開放的 AI 自動組隊可用。保留既有閱讀時間。未新增假數字、評論或人像。

## Interactions / checks

- 實際點擊「開始閱讀」→ /blog/，8 篇文章。
- 實際點擊「看看我的作品」→ /works/，4 件作品。
- 檢查主文章、兩篇最新文章、作者與作品連結目標。
- 手機所有 5 個導覽入口可見，最小高度 44px；頁面 scrollWidth=clientWidth=375。
- 圖片全部成功載入；首頁 Runtime／Log 未見網站本身 error 或 uncaught exception（排除瀏覽器擴充套件訊息）。
- npm run build、reading-time 兩個測試、git diff --check 通過。文章互動後端未變更，未對正式愛心資料作寫入測試。

## Follow-up polish

P3：生成稿與真實中文字型筆畫、個別字距略有差異；首頁短摘要與真實作品縮圖屬有意調整。既有依賴的 npm audit 10 項公告另案處理，新增 bootstrap-icons 未列於公告中。

final result: passed
