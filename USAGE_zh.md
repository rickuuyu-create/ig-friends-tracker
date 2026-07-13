# IG Friends Tracker 中文使用說明

## 這是什麼？

一個「幫你記住 Instagram 上認識的人」的個人 CRM。在活動上認識新朋友、互加 IG，三週後卻想不起對方是誰？這個 App 幫每個新朋友建立記錄：在哪認識、聊過什麼、什麼時候該跟進。

**最大特點：資料完全屬於你。** 所有記錄存在**你自己 Google 雲端硬碟**裡一份名為 *IG Friends Database* 的試算表——沒有後端伺服器、沒有第三方資料庫，開發者完全看不到你的資料。

## 主要功能

| 功能 | 說明 |
|---|---|
| Google 登入 | 資料自動同步到你自己的 Google Sheet |
| 朋友記錄 | 用戶名、真名、認識場合、日期、地點、標籤、筆記、跟進提醒 |
| 頭像上傳 | 照片在瀏覽器內壓縮後存進試算表，**永不過期** |
| 永久 ID 錨定 | 記下 Instagram 的數字 ID——對方改用戶名也認得是同一人 |
| 改名歷史 | 自動記錄曾用名（Also known as @舊名），搜舊名也找得到 |
| 篩選排序 | 點標籤篩選；按最近認識／待跟進／名字排序 |
| 待跟進標籤 | 列表直接顯示「Today」「3d late」 |
| PWA | 手機可「加到主畫面」，像原生 App 一樣開啟 |
| 選用：Apify 自動查詢 | 貼上你自己的免費 Apify token，一鍵自動抓 ID、偵測改名 |

## 資料夾結構

```
├── public/              # PWA 圖示、manifest、service worker
├── src/
│   ├── components/      # 頭像、上傳欄位、ID 欄位等元件
│   ├── lib/             # Google Sheets API、Firebase 登入、Apify、圖片壓縮
│   ├── pages/           # 列表、新增、編輯、詳情、設定、隱私權頁
│   └── App.tsx          # 路由與登入門檻
├── vercel.json          # Vercel SPA 路由設定
└── .env.example         # Firebase 設定範本
```

## 安裝方式（架自己的一份，全程免費）

> **只是想「使用」這個 App？** 如果有人分享了部署好的網址給你，直接打開、用 Google 登入就能用——完全不需要下面的任何設定。以下步驟只給想自己架一份的開發者。

**前置需求**：Node.js 18+、一個 Google 帳號。

### 第 1 步：安裝依賴

```bash
git clone https://github.com/rickuuyu-create/ig-friends-tracker.git
cd ig-friends-tracker
npm install
```

### 第 2 步：建立自己的 Firebase 專案（免費）

1. 到 <https://console.firebase.google.com> →「新增專案」
2. 點網頁圖示 **`</>`** 註冊 Web 應用程式 → 複製 `firebaseConfig` 那六個值
3. **Authentication → Sign-in method → Google → 啟用**（選一個支援信箱）
4. 到 Google Cloud Console 啟用兩個 API（**最容易漏的一步**，漏了存檔會失敗）：
   - [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
   - [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com)

### 第 3 步：填設定

```bash
cp .env.example .env.local
```

把第 2 步的六個值填進 `VITE_FIREBASE_*` 欄位。這些是公開的用戶端識別碼、不是機密。

### 第 4 步：啟動

```bash
npm run dev
```

開 <http://localhost:3000>，用 Google 登入。第一次存檔時，App 會自動在你的雲端硬碟建立試算表。

### 部署到 Vercel（開放給其他人用）

1. 推上 GitHub → 在 Vercel 匯入（自動偵測 Vite）
2. 在 Vercel 專案設定加入同樣六個 `VITE_FIREBASE_*` 環境變數 → 重新部署
3. Firebase → Authentication → Settings → Authorized domains → 加上 `你的app.vercel.app`
4. 要開放任何 Google 帳號登入：到 [Google Auth Platform](https://console.cloud.google.com/auth) 填 Branding（隱私權政策網址填 `https://你的app.vercel.app/privacy`，App 內建這頁）→ Audience → **Publish app**。本 App 只用非敏感的 `drive.file` 權限，不需 Google 審核。

## 使用流程

1. **新增朋友**：填 IG 用戶名（必填），加上認識場合、標籤、筆記、跟進日期
2. **上傳頭像**：點 Upload Photo 選照片，即時預覽（為何不自動抓 IG 頭像？因為 IG 的圖片網址幾週就過期）
3. **記下永久 ID**（建議）：點 **Find ID** 免費查出對方的數字 ID 貼進來——之後對方改名也認得
4. **快速找人**：搜尋任何欄位（含曾用名）、點標籤篩選、切換排序
5. **手機安裝**：部署後用手機開網址 →「加到主畫面」

### 範例

> 在「Tech Meetup 2026」認識 @rick_no_rich（Rick），標籤 `hiking, designer`，記下 ID `1234567890`，設定兩週後跟進。
> 一個月後 Rick 改名成 @rickhhkkd——你編輯記錄更新用戶名，舊名自動存為「Also known as @rick_no_rich」，搜哪個名字都找得到他。

### 選用功能：Apify 自動查詢

到右上齒輪（Settings）貼上你自己的免費 [Apify token](https://console.apify.com/settings/integrations)，可解鎖：

- **Auto-fetch**：新增時一鍵自動抓 ID 和名字
- **Re-check username**：一鍵確認對方是否改名，蓋上檢查日期

Token 只存在你自己的瀏覽器，查詢從你的瀏覽器直連 Apify，費用算你自己的 Apify 額度（免費額度通常够個人使用）。

## 常見問題

**Q：存檔跳「Failed to save」？**
A：九成是 Google Sheets API / Drive API 沒開（安裝第 2 步第 4 點）。開完等一分鐘，重新整理再試。

**Q：登入沒反應或彈窗被擋？**
A：允許瀏覽器彈出視窗；部署後記得把網域加進 Firebase 授權清單。

**Q：開發者看得到我的資料嗎？**
A：看不到。沒有伺服器、沒有分析追蹤，`drive.file` 權限只允許 App 存取它自己建立的檔案。

**Q：怎麼刪除所有資料？**
A：到你的雲端硬碟刪掉 *IG Friends Database* 試算表，再到 [myaccount.google.com/permissions](https://myaccount.google.com/permissions) 撤銷授權。

**Q：Apify 查詢失敗？**
A：爬蟲類服務會被 Instagram 週期性封鎖，過幾天再試；手動 Find ID 永遠可用。

## 注意事項

- 頭像請用「上傳」而非貼 IG 圖片網址（後者會過期）
- Instagram 數字 ID 永久不變，是最可靠的身分依據——建議每位朋友都記
- 試算表就是你的資料庫：可以直接在 Google Sheets 開來看，但**不要改動欄位順序**
- 本專案 MIT 授權，歡迎 fork 改成自己的版本
