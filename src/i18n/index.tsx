import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'zh-TW';

const LANGUAGE_KEY = 'ig_friends_language';

const en = {
  'common.back': 'Back',
  'common.save': 'Save',
  'common.saving': 'Saving...',
  'common.cancel': 'Cancel',
  'common.close': 'Close',
  'common.remove': 'Remove',
  'common.clearAll': 'Clear all',
  'common.optional': 'Optional',
  'common.loading': 'Loading...',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.settings': 'Settings',
  'common.sync': 'Sync',
  'common.logout': 'Log out',
  'common.open': 'Open',
  'common.done': 'Done',
  'login.title': 'IG Friends Tracker',
  'login.subtitle': 'Never forget who you met. Sign in with Google to sync with your private Google Sheets database.',
  'login.signIn': 'Sign in with Google',
  'login.signingIn': 'Signing in...',
  'login.privacy': 'Privacy Policy',
  'login.popupBlocked': 'Your browser blocked the sign-in popup. Please allow popups for this site and try again.',
  'login.cancelled': 'Sign-in was cancelled. Please try again.',
  'login.unauthorized': 'This domain is not authorized for sign-in. Add it in Firebase Authorized domains.',
  'login.failed': 'Sign-in failed ({code}). Please try again.',
  'dashboard.title': 'IG Friends',
  'dashboard.search': 'Search by IG, name, occasion, tag...',
  'dashboard.recent': 'Recent',
  'dashboard.followup': 'Follow-up',
  'dashboard.name': 'Name',
  'dashboard.noFriends': 'No friends found.',
  'dashboard.tryDifferent': 'Try a different search or tag.',
  'dashboard.addFriend': 'Add Friend',
  'dashboard.followUpBadge': 'Follow up',
  'dashboard.today': 'Today',
  'dashboard.daysLate': '{days}d late',
  'dashboard.inDays': 'in {days}d',
  'tags.filter': 'Filter by tags',
  'tags.more': 'More',
  'tags.search': 'Search tags...',
  'tags.none': 'No matching tags.',
  'tags.selected': '{count} selected',
  'tags.matchAll': 'Showing friends with all selected tags',
  'tags.label': 'Tags',
  'tags.addPlaceholder': 'Type a tag, then press Enter',
  'tags.suggestions': 'Previously used tags',
  'tags.browseHint': 'Tap to add multiple tags. Swipe sideways to browse.',
  'tags.emptyHint': 'Add your first tag above.',
  'form.newFriend': 'New Friend',
  'form.editFriend': 'Edit Friend',
  'form.profile': 'Profile',
  'form.username': 'IG Username',
  'form.realName': 'Real Name / Note Name',
  'form.meetingContext': 'Meeting Context',
  'form.occasion': 'Occasion / Event',
  'form.date': 'Date',
  'form.location': 'Location',
  'form.details': 'Details',
  'form.notes': 'Notes',
  'form.reminder': 'Reminder Date (Follow up)',
  'form.occasionPlaceholder': 'Tech Meetup 2026',
  'form.locationPlaceholder': 'Taipei',
  'form.notesPlaceholder': 'Talked about photography...',
  'form.databaseNotReady': 'The database sheet is not ready. Enable the Google Sheets API and Google Drive API, then reload.',
  'form.duplicate': 'You already saved @{username}{name}. Add another entry anyway?',
  'form.notAuthenticated': 'Not authenticated',
  'form.saveFailed': 'Failed to save. Please try again.',
  'avatar.label': 'Avatar Photo (Optional)',
  'avatar.upload': 'Upload Photo',
  'avatar.pasteUrl': '...or paste an image URL (https://...)',
  'avatar.savedHint': 'Uploaded photos are resized and saved into your sheet, so they never expire.',
  'avatar.error': 'Could not process this image. Please try another file.',
  'avatar.help': 'How to get a photo',
  'avatar.helpTitle': 'Add a friend\'s profile photo',
  'avatar.helpIntro': 'You can save a public profile picture from a download site, then upload it here.',
  'avatar.step1Title': 'Enter the username',
  'avatar.step1Body': 'Fill in the friend\'s IG username in the form.',
  'avatar.step2Title': 'Open the download site',
  'avatar.step2Body': 'Use the button below to open IGPorter. An entered username is copied automatically.',
  'avatar.step3Title': 'Download and upload',
  'avatar.step3Body': 'Paste the username, download the photo, then return here and choose Upload Photo.',
  'avatar.copyUsername': 'Copy username',
  'avatar.copied': 'Copied',
  'avatar.openDownloader': 'Open IGPorter profile photo downloader',
  'avatar.copyAndOpenHint': 'Your username is copied. Paste it into the search box on IGPorter.',
  'avatar.openWithoutUsernameHint': 'You can open the site now and enter a username there.',
  'avatar.thirdPartyNote': 'IGPorter is a third-party site for public profiles. Do not enter your Instagram password.',
  'avatar.privacyNote': 'Respect the person\'s privacy when downloading or keeping their photo. Third-party availability may change.',
  'instagramId.label': 'Instagram User ID (Optional)',
  'instagramId.autoFetch': 'Auto-fetch',
  'instagramId.fetching': 'Fetching...',
  'instagramId.find': 'Find ID',
  'instagramId.hint': 'The permanent ID stays the same even if they change their username.',
  'instagramId.enterUsername': 'Enter a username first.',
  'instagramId.notFound': 'Profile not found. Check the username.',
  'instagramId.lookupFailed': 'Lookup failed.',
  'details.friendNotFound': 'Friend not found.',
  'details.goBack': 'Go back',
  'details.context': 'Context',
  'details.metAt': 'Met at',
  'details.date': 'Date',
  'details.location': 'Location',
  'details.details': 'Details',
  'details.instagramId': 'Instagram User ID',
  'details.lastChecked': 'Last checked {date}',
  'details.alsoKnown': 'Also known as',
  'details.avatarSource': 'Avatar Source',
  'details.uploadedPhoto': 'Uploaded photo (stored in your sheet)',
  'details.reminder': 'Reminder (Follow up)',
  'details.notes': 'Notes',
  'details.recheck': 'Re-check username',
  'details.checking': 'Checking...',
  'details.deleteConfirm': 'Delete this record? This action cannot be undone.',
  'details.deleteFailed': 'Failed to delete.',
  'details.recheckFailed': 'Re-check failed.',
  'details.recheckNotFound': '@{username} was not found. They may have changed username, made the account private, or deleted it.{id}',
  'details.recheckIdMismatch': '@{username} now belongs to a different account. The saved ID is {savedId}, but the current account ID is {currentId}. Edit this friend when you learn their new username.',
  'details.recheckVerified': 'Still @{username}. Verified today.',
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.languageHint': 'Choose the language used throughout the app.',
  'settings.apifyTitle': 'Instagram Auto-Fetch (Optional)',
  'settings.apifyBody': 'Paste your own Apify API token to fetch permanent Instagram IDs. The token stays in this browser and usage belongs to your own Apify account.',
  'settings.apifyToken': 'Apify API Token',
  'settings.getToken': 'Get a free token at apify.com',
  'settings.saved': 'Saved',
  'settings.tourTitle': 'Guided tour',
  'settings.tourBody': 'Replay the interactive introduction to search, tags, photos and Instagram IDs.',
  'settings.replayTour': 'Replay tutorial',
  'tour.skip': 'Skip',
  'tour.back': 'Back',
  'tour.next': 'Next',
  'tour.finish': 'Finish',
  'tour.step': '{current} of {total}',
  'tour.settingsTitle': 'Your preferences live here',
  'tour.settingsBody': 'Change language, add your optional Apify token, or replay this tutorial from Settings.',
  'tour.searchTitle': 'Find anyone quickly',
  'tour.searchBody': 'Search names, Instagram handles, occasions, notes and even old usernames.',
  'tour.tagsTitle': 'Combine tag filters',
  'tour.tagsBody': 'Select one or more tags. When several are selected, only friends with all of them are shown.',
  'tour.addTitle': 'Record a new connection',
  'tour.addBody': 'Start here after meeting someone. The next steps show the most useful fields.',
  'tour.avatarTitle': 'Keep a reliable photo',
  'tour.avatarBody': 'Upload a permitted photo. It is compressed and stored in your own Google Sheet, so it will not expire.',
  'tour.idTitle': 'Protect against username changes',
  'tour.idBody': 'Save the permanent numeric Instagram ID. It identifies the same account even after the username changes.',
  'tour.formTagsTitle': 'Reuse your own tags',
  'tour.formTagsBody': 'Tap several existing tags or type a new one. Tags make your network easy to filter later.',
  'tour.saveTitle': 'Save to your own Drive',
  'tour.saveBody': 'Notes, reminders and profile details are stored in the private Google Sheet created for your account.',
  'privacy.title': 'Privacy Policy',
  'privacy.updated': 'Last updated: July 22, 2026',
  'privacy.whatTitle': 'What this app does',
  'privacy.whatBody': 'IG Friends Tracker helps you remember the people you meet on Instagram. Records are stored in a Google Sheet named “IG Friends Database” inside your own Google Drive, not on our servers.',
  'privacy.googleTitle': 'Google account access',
  'privacy.googleBody': 'The drive.file permission only allows the app to create and edit files it created itself. It cannot read or modify your other Google Drive files.',
  'privacy.deviceTitle': 'What stays on your device',
  'privacy.deviceBody': 'Your Google sign-in token and optional Apify token are stored only in your browser. Uploaded photos are resized locally and saved into your own Sheet.',
  'privacy.thirdPartyTitle': 'Optional third-party lookups',
  'privacy.thirdPartyBody': 'If you add your own Apify token, profile lookups go directly from your browser to Apify under your own account. This feature is optional and off by default.',
  'privacy.noTrackingTitle': 'What we do not do',
  'privacy.noTrackingBody': 'No ads, analytics or tracking. We do not sell or share your data and cannot access your friend records.',
  'privacy.deleteTitle': 'Deleting your data',
  'privacy.deleteBody': 'Delete “IG Friends Database” from Google Drive, then revoke this app at Google Account Permissions.',
  'privacy.contactTitle': 'Contact',
  'privacy.contactBody': 'Questions? Email',
  'landing.problemTitle': 'You met them on Instagram. Now who were they again?',
  'landing.problemBody': 'You swap Instagram handles at an event, a class or a trip. Three weeks later a username you do not recognise likes your post, and the context is gone. IG Friends Tracker keeps a private note for every person you meet: their real name, where you met, what you talked about, and when to follow up.',
  'landing.featuresTitle': 'What you can save for each friend',
  'landing.f1Title': 'Notes and nicknames',
  'landing.f1Body': 'Store the real name or nickname behind a handle, plus free-form notes about what you talked about.',
  'landing.f2Title': 'Where and when you met',
  'landing.f2Body': 'Record the occasion, date and location so the memory comes back instantly.',
  'landing.f3Title': 'Tags and instant search',
  'landing.f3Body': 'Tag people however you like, then filter by tag or search every field, including notes.',
  'landing.f4Title': 'Follow-up reminders',
  'landing.f4Body': 'Set a date to reach out again and see who is due right on the list.',
  'landing.f5Title': 'Survives username changes',
  'landing.f5Body': 'Instagram handles change, the numeric user ID never does. Save it once and old usernames stay searchable.',
  'landing.f6Title': 'Works like a phone app',
  'landing.f6Body': 'Add it to your home screen and it opens full screen, no app store needed.',
  'landing.privacyTitle': 'Your notes stay yours',
  'landing.privacyBody': 'There is no server and no database behind this app. Everything is written to a Google Sheet called “IG Friends Database” inside your own Google Drive, using the narrowest Google permission available. Nobody, including the developer, can read your notes. Open the sheet any time, edit it, export it or delete it.',
  'landing.howTitle': 'How it works',
  'landing.step1': 'Sign in with Google. The app creates a private spreadsheet in your own Drive.',
  'landing.step2': 'Add someone right after you meet them, with a photo, notes and tags.',
  'landing.step3': 'Search, filter by tag or check follow-ups whenever you need the context back.',
  'landing.faqTitle': 'Common questions',
  'landing.q1': 'Is it free?',
  'landing.a1': 'Yes, completely free and open source under the MIT licence. There are no ads and no paid tier.',
  'landing.q2': 'Where are my notes stored?',
  'landing.a2': 'In a Google Sheet inside your own Google Drive. The app has no backend, so your notes never touch anyone else’s server.',
  'landing.q3': 'Does it post to Instagram or need my Instagram password?',
  'landing.a3': 'No. It never connects to your Instagram account. It is a private notebook, so you only ever type in usernames yourself.',
  'landing.q4': 'What happens if a friend changes their username?',
  'landing.a4': 'Update the record and the old handle is archived automatically, so searching either name still finds them.',
  'landing.ctaTitle': 'Start remembering everyone you meet',
  'landing.ctaBody': 'Free, private and open source. Nothing to install.',
  'landing.github': 'View source on GitHub',
  'landing.q5': 'Can you add private notes about someone on Instagram?',
  'landing.a5': 'Instagram has no built-in way to save a private note or a nickname about another person. That is exactly what this app adds. Your notes live in your own Google Sheet and the other person never sees them.',
  'landing.q6': 'Is this the same as Instagram Notes?',
  'landing.a6': 'No. Instagram Notes are short public status messages that your followers can see and that disappear after 24 hours. These are private notes about other people that only you can read, and they stay until you delete them.',
  'landing.q7': 'How do I remember where I met someone on Instagram?',
  'landing.a7': 'Save the occasion, date and location when you add them. Later you can search or tap a tag and the context comes straight back.',
  'landing.q8': 'Can I give an Instagram follower a nickname or their real name?',
  'landing.a8': 'Yes. Save their real name or a nickname next to their handle, so you recognise them instantly even when the username tells you nothing.',
  'meta.title': 'IG Friends Tracker — Private Notes & Nicknames for People You Meet on Instagram',
  'meta.description': 'Instagram has no way to save private notes about someone. Keep your own notes, nicknames, tags and follow-up reminders for every friend you meet, stored privately in your own Google Sheet. Free and open source.',
} as const;

type TranslationKey = keyof typeof en;

const zhTW: Record<TranslationKey, string> = {
  'common.back': '返回', 'common.save': '儲存', 'common.saving': '儲存中…', 'common.cancel': '取消',
  'common.close': '關閉', 'common.remove': '移除', 'common.clearAll': '全部清除', 'common.optional': '選填',
  'common.loading': '載入中…', 'common.delete': '刪除', 'common.edit': '編輯', 'common.settings': '設定',
  'common.sync': '同步', 'common.logout': '登出', 'common.open': '開啟', 'common.done': '完成',
  'login.title': 'IG Friends Tracker',
  'login.subtitle': '記住每一位認識過的人。使用 Google 登入，資料會同步到你私人的 Google 試算表。',
  'login.signIn': '使用 Google 登入', 'login.signingIn': '登入中…', 'login.privacy': '私隱政策',
  'login.popupBlocked': '瀏覽器封鎖了登入視窗。請允許此網站開啟彈出式視窗後再試。',
  'login.cancelled': '登入已取消，請再試一次。',
  'login.unauthorized': '此網域尚未獲 Firebase 授權，請把它加入 Authorized domains。',
  'login.failed': '登入失敗（{code}），請再試一次。',
  'dashboard.title': 'IG 朋友', 'dashboard.search': '搜尋 IG、名字、場合、標籤…',
  'dashboard.recent': '最近認識', 'dashboard.followup': '待跟進', 'dashboard.name': '名字',
  'dashboard.noFriends': '找不到朋友。', 'dashboard.tryDifferent': '試試其他搜尋字或標籤。',
  'dashboard.addFriend': '新增朋友', 'dashboard.followUpBadge': '待跟進', 'dashboard.today': '今天',
  'dashboard.daysLate': '逾期 {days} 日', 'dashboard.inDays': '{days} 日後',
  'tags.filter': '按標籤篩選', 'tags.more': '更多', 'tags.search': '搜尋標籤…',
  'tags.none': '沒有相符標籤。', 'tags.selected': '已選 {count} 個',
  'tags.matchAll': '只顯示同時包含所有已選標籤的朋友', 'tags.label': '標籤',
  'tags.addPlaceholder': '輸入標籤後按 Enter', 'tags.suggestions': '曾經使用的標籤',
  'tags.browseHint': '可點選多個標籤，左右滑動查看更多。', 'tags.emptyHint': '在上方新增第一個標籤。',
  'form.newFriend': '新增朋友', 'form.editFriend': '編輯朋友', 'form.profile': '個人資料',
  'form.username': 'IG 用戶名稱', 'form.realName': '真實姓名／備註名稱',
  'form.meetingContext': '認識背景', 'form.occasion': '場合／活動', 'form.date': '日期',
  'form.location': '地點', 'form.details': '詳細資料', 'form.notes': '筆記',
  'form.reminder': '提醒日期（跟進）', 'form.occasionPlaceholder': '2026 科技交流會',
  'form.locationPlaceholder': '台北', 'form.notesPlaceholder': '談過攝影、設計…',
  'form.databaseNotReady': '資料試算表尚未準備好。請啟用 Google Sheets API 和 Google Drive API，然後重新整理。',
  'form.duplicate': '你已儲存 @{username}{name}。仍要新增另一筆嗎？',
  'form.notAuthenticated': '尚未登入', 'form.saveFailed': '儲存失敗，請再試一次。',
  'avatar.label': '頭像（選填）', 'avatar.upload': '上傳照片', 'avatar.pasteUrl': '…或貼上圖片網址（https://…）',
  'avatar.savedHint': '照片會先縮小，再儲存到你的試算表中，因此不會因外部網址失效。',
  'avatar.error': '無法處理這張圖片，請選擇另一個檔案。', 'avatar.help': '如何取得照片',
  'avatar.helpTitle': '加入朋友的個人照片',
  'avatar.helpIntro': '你可以透過下載網站儲存公開帳號的頭像，再上傳到這裡。',
  'avatar.step1Title': '輸入用戶名稱', 'avatar.step1Body': '先在表單填寫朋友的 IG 用戶名稱。',
  'avatar.step2Title': '開啟下載網站', 'avatar.step2Body': '按下方按鈕前往 IGPorter；已填寫的用戶名稱會自動複製。',
  'avatar.step3Title': '下載後上傳', 'avatar.step3Body': '貼上用戶名稱並下載頭像，再回到這裡按「上傳照片」。',
  'avatar.copyUsername': '複製用戶名稱', 'avatar.copied': '已複製',
  'avatar.openDownloader': '開啟 IGPorter 頭像下載網站', 'avatar.copyAndOpenHint': '用戶名稱已複製，請在 IGPorter 的搜尋欄貼上。',
  'avatar.openWithoutUsernameHint': '你也可以先開啟網站，再直接輸入用戶名稱。',
  'avatar.thirdPartyNote': 'IGPorter 是第三方網站，只支援公開帳號。請勿輸入你的 Instagram 密碼。',
  'avatar.privacyNote': '下載或保存照片時，請尊重對方的私隱。第三方網站日後可能會改動或停止服務。',
  'instagramId.label': 'Instagram 用戶 ID（選填）', 'instagramId.autoFetch': '自動取得',
  'instagramId.fetching': '取得中…', 'instagramId.find': '查找 ID',
  'instagramId.hint': '即使對方更改用戶名稱，永久 ID 仍然不變。',
  'instagramId.enterUsername': '請先輸入用戶名稱。', 'instagramId.notFound': '找不到帳號，請檢查用戶名稱。',
  'instagramId.lookupFailed': '查詢失敗。',
  'details.friendNotFound': '找不到這位朋友。', 'details.goBack': '返回', 'details.context': '認識背景',
  'details.metAt': '認識場合', 'details.date': '日期', 'details.location': '地點', 'details.details': '詳細資料',
  'details.instagramId': 'Instagram 用戶 ID', 'details.lastChecked': '上次檢查：{date}',
  'details.alsoKnown': '曾用名稱', 'details.avatarSource': '頭像來源',
  'details.uploadedPhoto': '已上傳照片（儲存在你的試算表）', 'details.reminder': '提醒（跟進）',
  'details.notes': '筆記', 'details.recheck': '重新檢查用戶名稱', 'details.checking': '檢查中…',
  'details.deleteConfirm': '確定刪除這筆記錄嗎？刪除後無法復原。', 'details.deleteFailed': '刪除失敗。',
  'details.recheckFailed': '重新檢查失敗。',
  'details.recheckNotFound': '找不到 @{username}。對方可能已更改用戶名稱、轉為私人帳號或刪除帳號。{id}',
  'details.recheckIdMismatch': '@{username} 現在屬於另一個帳號。已儲存的 ID 是 {savedId}，目前帳號 ID 是 {currentId}。知道對方的新用戶名稱後，請編輯這位朋友。',
  'details.recheckVerified': '@{username} 仍是同一帳號，今天已完成驗證。',
  'settings.title': '設定', 'settings.language': '語言', 'settings.languageHint': '選擇整個 App 使用的語言。',
  'settings.apifyTitle': 'Instagram 自動查詢（選用）',
  'settings.apifyBody': '貼上你自己的 Apify API token，即可取得 Instagram 永久 ID。Token 只保存在這個瀏覽器，使用量屬於你自己的 Apify 帳戶。',
  'settings.apifyToken': 'Apify API Token', 'settings.getToken': '到 apify.com 免費取得 token',
  'settings.saved': '已儲存', 'settings.tourTitle': '功能教學',
  'settings.tourBody': '重新播放搜尋、標籤、照片和 Instagram ID 的互動教學。',
  'settings.replayTour': '重新播放教學',
  'tour.skip': '跳過', 'tour.back': '上一步', 'tour.next': '下一步', 'tour.finish': '完成',
  'tour.step': '第 {current}／{total} 步',
  'tour.settingsTitle': '偏好設定在這裡', 'tour.settingsBody': '你可以在設定中切換語言、加入選用的 Apify token，或重新播放這個教學。',
  'tour.searchTitle': '快速找到任何人', 'tour.searchBody': '搜尋名字、IG 用戶名稱、認識場合、筆記，甚至對方的舊用戶名稱。',
  'tour.tagsTitle': '組合多個標籤', 'tour.tagsBody': '可同時選取多個標籤；選得越多，結果會收窄至同時包含所有標籤的朋友。',
  'tour.addTitle': '記錄新認識的朋友', 'tour.addBody': '剛認識新朋友後由這裡開始。接下來會介紹最重要的欄位。',
  'tour.avatarTitle': '保存可靠的照片', 'tour.avatarBody': '上傳獲允許使用的照片。圖片會壓縮後存進你自己的 Google 試算表，不會過期。',
  'tour.idTitle': '避免改名後認錯人', 'tour.idBody': '保存永久的 Instagram 數字 ID。即使對方更改用戶名稱，仍可辨認是同一帳號。',
  'tour.formTagsTitle': '重用自己的標籤', 'tour.formTagsBody': '點選多個舊標籤，或輸入新標籤，日後就能快速整理和篩選人脈。',
  'tour.saveTitle': '儲存到自己的雲端硬碟', 'tour.saveBody': '筆記、提醒和個人資料會存進專屬於你的私人 Google 試算表。',
  'privacy.title': '私隱政策', 'privacy.updated': '最後更新：2026 年 7 月 22 日',
  'privacy.whatTitle': '本 App 的用途', 'privacy.whatBody': 'IG Friends Tracker 協助你記住在 Instagram 認識的人。所有記錄都存放在你自己的 Google Drive 內、名為「IG Friends Database」的試算表，而不是我們的伺服器。',
  'privacy.googleTitle': 'Google 帳戶權限', 'privacy.googleBody': 'drive.file 權限只允許 App 建立及編輯由它自行建立的檔案，不能讀取或修改你 Google Drive 中的其他檔案。',
  'privacy.deviceTitle': '只保存在裝置上的資料', 'privacy.deviceBody': 'Google 登入 token 和選用的 Apify token 只保存在你的瀏覽器。照片會在裝置上縮小，再存入你自己的試算表。',
  'privacy.thirdPartyTitle': '選用的第三方查詢', 'privacy.thirdPartyBody': '如你加入自己的 Apify token，個人檔案查詢會由瀏覽器直接傳送到 Apify，並使用你自己的帳戶。此功能預設關閉。',
  'privacy.noTrackingTitle': '我們不會做的事', 'privacy.noTrackingBody': '沒有廣告、分析或追蹤。我們不會出售或分享你的資料，也無法存取你的朋友記錄。',
  'privacy.deleteTitle': '刪除你的資料', 'privacy.deleteBody': '在 Google Drive 刪除「IG Friends Database」，再到 Google 帳戶權限撤銷此 App，即可移除所有資料。',
  'privacy.contactTitle': '聯絡', 'privacy.contactBody': '如有問題，請電郵',
  'landing.problemTitle': '在 IG 認識了，過幾星期卻想不起他是誰？',
  'landing.problemBody': '在活動、課堂或旅行中互相交換 Instagram，三星期後一個陌生的 username 讚了你的貼文，你已經完全記不起對方是誰。IG Friends Tracker 讓你為每位認識的人寫下私人備註：真實姓名、在哪認識、聊過什麼、什麼時候該再聯絡。',
  'landing.featuresTitle': '每位朋友可以記下什麼',
  'landing.f1Title': '備註與暱稱',
  'landing.f1Body': '記下 IG 帳號背後的真名或暱稱，再加上自由書寫的備註，記錄你們聊過的內容。',
  'landing.f2Title': '在哪裡、什麼時候認識',
  'landing.f2Body': '記錄認識的場合、日期和地點，回憶立刻回來。',
  'landing.f3Title': '標籤與即時搜尋',
  'landing.f3Body': '用你自己的方式為朋友加標籤，之後可按標籤篩選，或搜尋任何欄位（包括備註）。',
  'landing.f4Title': '跟進提醒',
  'landing.f4Body': '設定下次聯絡的日期，列表上直接看到誰該跟進了。',
  'landing.f5Title': '改了 username 也認得',
  'landing.f5Body': 'Instagram 帳號名稱會變，數字 ID 永遠不變。記錄一次，舊帳號名稱仍然搜尋得到。',
  'landing.f6Title': '像手機 App 一樣使用',
  'landing.f6Body': '加到主畫面即可全螢幕開啟，不需要下載任何 App。',
  'landing.privacyTitle': '你的備註只屬於你',
  'landing.privacyBody': '這個 App 沒有伺服器，也沒有資料庫。所有內容都寫進你自己 Google 雲端硬碟裡一份名為「IG Friends Database」的試算表，並且只使用 Google 權限中範圍最窄的一種。沒有任何人（包括開發者）能讀取你的備註。你隨時可以打開、編輯、匯出或刪除那份試算表。',
  'landing.howTitle': '怎麼運作',
  'landing.step1': '用 Google 登入，App 會在你自己的雲端硬碟建立一份私人試算表。',
  'landing.step2': '認識新朋友後立刻新增，可加上照片、備註和標籤。',
  'landing.step3': '需要時用搜尋、標籤篩選或跟進清單，把當時的記憶找回來。',
  'landing.faqTitle': '常見問題',
  'landing.q1': '要收費嗎？',
  'landing.a1': '完全免費，並以 MIT 授權開源。沒有廣告，也沒有付費方案。',
  'landing.q2': '我的備註存在哪裡？',
  'landing.a2': '存在你自己 Google 雲端硬碟的試算表內。這個 App 沒有後端，你的備註不會經過任何人的伺服器。',
  'landing.q3': '它會發文到 Instagram，或需要我的 IG 密碼嗎？',
  'landing.a3': '不會。它完全不會連接你的 Instagram 帳號。這只是一本私人筆記，所有帳號名稱都由你自己輸入。',
  'landing.q4': '如果朋友改了 username 怎麼辦？',
  'landing.a4': '更新記錄後，舊的帳號名稱會自動保存下來，用新舊名字搜尋都找得到這個人。',
  'landing.ctaTitle': '開始記住你認識的每一個人',
  'landing.ctaBody': '免費、私密、開源，不用安裝任何東西。',
  'landing.github': '在 GitHub 查看原始碼',
  'landing.q5': 'IG 可以幫朋友加備註嗎？',
  'landing.a5': 'Instagram 本身沒有替其他人加私人備註或備註名的功能。這正是這個 App 補上的：你的備註存在自己的 Google 試算表裡，對方永遠看不到。',
  'landing.q6': '這跟 IG 的「備註」（便利貼）功能一樣嗎？',
  'landing.a6': '不一樣。IG 的備註是你自己發出、追蹤者看得到、24 小時後消失的公開短訊息；這裡是你寫給自己、記錄別人的私人筆記，只有你看得到，而且不會消失。',
  'landing.q7': '怎麼記住是在哪裡認識這個 IG 朋友的？',
  'landing.a7': '新增朋友時就填上認識的場合、日期和地點。之後用搜尋或點一下標籤，當時的情境立刻回來。',
  'landing.q8': '可以幫 IG 朋友設暱稱或記下真實姓名嗎？',
  'landing.a8': '可以。在對方帳號名稱旁邊記下真名或暱稱，就算 username 完全看不出是誰，你也能一眼認出來。',
  'meta.title': 'IG Friends Tracker — 幫 IG 朋友加備註、暱稱與筆記的免費工具',
  'meta.description': 'Instagram 沒有替朋友加私人備註的功能。這個免費工具讓你為每位在 IG 認識的人記下備註、暱稱、標籤和跟進提醒，資料存在你自己的 Google 試算表，別人看不到。',
};

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const SITE_URL = 'https://ig-friends-tracker.vercel.app';

const detectLanguage = (): Language => {
  // ?lang= wins so each language has its own crawlable URL. Search engine
  // crawlers report an English navigator language, so without this the
  // Chinese version would never be indexed.
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'en' || fromUrl === 'zh-TW') return fromUrl;
  } catch { /* URL may be unavailable in exotic contexts */ }
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === 'en' || saved === 'zh-TW') return saved;
  } catch { /* storage can be unavailable in private contexts */ }
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-TW' : 'en';
};

// Keep the crawlable head metadata in step with the language being rendered.
const applyMetadata = (title: string, description: string) => {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);

  // The canonical follows the URL, never the visitor's browser language:
  // "/" is the English address even when a Chinese browser is shown Chinese.
  const path = window.location.pathname;
  const isZhUrl = new URLSearchParams(window.location.search).get('lang') === 'zh-TW';
  const url = `${SITE_URL}${path}${isZhUrl ? '?lang=zh-TW' : ''}`;
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* ignore */ }
  };

  useEffect(() => {
    document.documentElement.lang = language === 'zh-TW' ? 'zh-Hant' : 'en';
    const strings = language === 'zh-TW' ? zhTW : en;
    applyMetadata(strings['meta.title'], strings['meta.description']);
  }, [language]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key, values) => {
      let result = language === 'zh-TW' ? zhTW[key] : en[key];
      if (values) {
        Object.entries(values).forEach(([name, value]) => {
          result = result.replaceAll(`{${name}}`, String(value));
        });
      }
      return result;
    },
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = (): I18nContextValue => {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
};
