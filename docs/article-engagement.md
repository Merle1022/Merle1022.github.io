# 文章愛心、分享與贊助入口

2026-10-17：Merle 同意先完成不需本人操作的功能。

## 行為
- 全部已發布文章共用 ArticleEngagement 元件；文章正文保持原樣。
- LINE、Threads、Facebook 使用正式 canonical URL；複製連結附手動複製備援。支援 navigator.share 的裝置顯示「更多分享」；取消不誤報失敗。未承諾 IG 直接發布，未新增 IG API。
- 免費愛心與付費支持分開。贊助按鈕連到既有 Portaly merle1022/support；確認公開頁有100／200元選項及信用卡表單，沒有提交付款、開新收款帳戶或改費率。
- 愛心在讀者接近文章尾端時才載入。伺服器以 HttpOnly、Secure、SameSite=Lax 隨機 Cookie（最長一年）識別瀏覽器，D1 的文章／讀者複合主鍵去重。PUT 設定目標狀態而非切換，可安全重試、可取消；跨瀏覽器不等於同一人。
- 僅已發布文章可操作。API 限同源 JSON 寫入、限制body大小；每網路位址每10分鐘最多60次寫入。私密D1隨機鹽HMAC處理識別值，不保存原始IP。限流過期資料於後續操作時分批清除。匿名去重是基本防灌票，無法保證一人一票。
- 網路／資料庫失敗不偽造計數；顯示重試入口，分享與贊助連結仍可使用。隱私權頁同步資料使用說明。

## Cloudflare
- Pages 專案 merle-website；production 綁定 LIKES_DB → merle-article-likes。
- db/article-likes.sql 為可重複執行的新增 schema，不重置愛心，不將私密鹽寫入repo。
- functions/api/likes.js 為唯一動態路由；public/_routes.json 限制 /api/likes，其餘頁面與資產維持靜態。未加入 Astro SSR adapter、付費方案或新前端框架。
- npm run build 在 Astro 產生HTML後建立已發布文章allowlist，排除草稿及不存在的slug；產物在lib/engagement/generated，不提交。
- Preview 不綁定 production D1，避免預覽測試污染正式數字；未綁定時愛心顯示暫時不可用。整合測試使用獨立本機 D1。
- GitHub Pages 仍只部署 legacy-dist 的轉址頁；Cloudflare Functions 不被部署到 GitHub。

## 驗證
- npm run build；node --test tests/reading-time.test.mjs。
- 對隔離的 wrangler pages dev + D1 執行 node tests/article-likes.integration.mjs：並發重複送出、取消冪等、跨讀者／文章隔離、Cookie、錯誤格式、CSRF、請求大小、限流與測試資料清理。
- 實際瀏覽器點按、重載保留、取消、複製成功及剪貼簿受限備援；桌面／390px版面檢查。

## 尚未代做
不變更 Portaly 方案、提領資料、費率或銀行帳戶；未申請 Buy Me a Coffee／Ko-fi，未進行真實刷卡。若日後換收款工具，只需替換贊助入口並另驗證結帳。
