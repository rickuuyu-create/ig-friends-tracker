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
  'avatar.helpIntro': 'Instagram blocks apps from downloading profile photos directly. Use a photo your friend has agreed to share.',
  'avatar.step1Title': 'Open their profile',
  'avatar.step1Body': 'Use the button below to open the Instagram profile you entered.',
  'avatar.step2Title': 'Save a permitted copy',
  'avatar.step2Body': 'Ask your friend to share the photo, or take a screenshot and crop it with their permission.',
  'avatar.step3Title': 'Upload it here',
  'avatar.step3Body': 'Return to this form and choose Upload Photo. The image is compressed before it is stored.',
  'avatar.openProfile': 'Open Instagram profile',
  'avatar.usernameNeeded': 'Enter an IG username first to open the profile.',
  'avatar.privacyNote': 'Only upload photos you have permission to keep.',
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
  'avatar.helpIntro': 'Instagram 不允許 App 直接下載個人頭像。請使用朋友同意分享的照片。',
  'avatar.step1Title': '開啟朋友的個人檔案', 'avatar.step1Body': '使用下方按鈕開啟你輸入的 Instagram 帳號。',
  'avatar.step2Title': '取得獲允許的照片', 'avatar.step2Body': '請朋友傳送照片，或在獲得同意後截圖並裁切頭像。',
  'avatar.step3Title': '回來上傳', 'avatar.step3Body': '回到表單按「上傳照片」。圖片會先壓縮再儲存。',
  'avatar.openProfile': '開啟 Instagram 個人檔案', 'avatar.usernameNeeded': '請先輸入 IG 用戶名稱。',
  'avatar.privacyNote': '只應上傳你獲准保存的照片。',
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
};

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const detectLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === 'en' || saved === 'zh-TW') return saved;
  } catch { /* storage can be unavailable in private contexts */ }
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-TW' : 'en';
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* ignore */ }
  };

  useEffect(() => {
    document.documentElement.lang = language;
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
