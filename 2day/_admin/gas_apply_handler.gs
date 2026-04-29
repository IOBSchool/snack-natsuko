/**
 * TT2 2日間チャレンジ 申込ハンドラー (Google Apps Script)
 *
 * 機能:
 *   1) フォームPOST受信 → スプレッドシートに追記
 *   2) 申込者へZoom URL等を含む自動返信メール送信
 *   3) なつこさんへ通知メール送信
 *
 * セットアップ:
 *   1. 申込管理スプレッドシート(下記SHEET_ID)を作成し、1行目に下記HEADERS通りの見出しを入れる
 *   2. 「拡張機能 > Apps Script」でこのコードを貼付
 *   3. SHEET_ID / NOTIFY_EMAIL を実値に書き換え
 *   4. 「デプロイ > 新しいデプロイ > 種類:ウェブアプリ」
 *      - 次のユーザーとして実行: 自分
 *      - アクセスできるユーザー: 全員
 *   5. 出力されたウェブアプリURLをthanksページのGAS_ENDPOINTに貼る
 */

const SHEET_ID = '1yOyqxAlMLHtiH0pTUIRQKmaIb6wrZhMFq_IQWLauHz0';
const SHEET_NAME = '申込一覧';
const NOTIFY_EMAIL = 'organiclifeingermany@gmail.com';  // なつこさん通知用
const FROM_NAME = 'THE THREAD 事務局';

const HEADERS = [
  '申込日時','種別','氏名','メールアドレス','紹介者氏名','決済方法','備考'
];

const ZOOM_URL = 'https://us06web.zoom.us/j/5403853001?pwd=NnBrSmxBeWYxZXhuWkdIK1ZoZW5XQT09&omn=84461325024';
const ZOOM_ID = '540 385 3001';
const ZOOM_PW = '7RP26b';
const BAND_URL = 'https://band.us/n/aba5b15034Qbb';

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
    }

    const now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([
      now,
      params.type || '',
      params.name || '',
      params.email || '',
      params.referral_name || '',
      params.payment || '',
      ''
    ]);

    sendAutoReply(params);
    sendOwnerNotice(params, now);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendAutoReply(p) {
  if (!p.email) return;
  const subject = '【THE THREAD 2日間チャレンジ】お申込みありがとうございます';
  const body = [
    `${p.name} さま`,
    '',
    'THE THREAD 2日間チャレンジへのお申込み、',
    'ありがとうございます。',
    '',
    '── 開催情報 ──',
    '日程: 2026年5月12日(火)・13日(水)',
    '時間: 各日 20:00〜22:00 (日本時間)',
    '',
    '── Zoom接続情報 (両日共通) ──',
    `URL: ${ZOOM_URL}`,
    `ID : ${ZOOM_ID}`,
    `PW : ${ZOOM_PW}`,
    '',
    '── 参加者専用BAND ──',
    `${BAND_URL}`,
    '※開催までの時間をゆるくつなぐ場です。ぜひご参加ください。',
    '',
    '当日、お会いできるのを楽しみにしています。',
    '',
    'THE THREAD 事務局'
  ].join('\n');

  MailApp.sendEmail({
    to: p.email,
    subject: subject,
    body: body,
    name: FROM_NAME
  });
}

function sendOwnerNotice(p, now) {
  const body = [
    '【新規申込】TT2 2日間チャレンジ',
    '',
    `日時: ${now}`,
    `種別: ${p.type}`,
    `氏名: ${p.name}`,
    `メール: ${p.email}`,
    `紹介者: ${p.referral_name || '-'}`,
    `決済: ${p.payment}`,
    `BAND希望: ${p.band}`
  ].join('\n');
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: `[TT2申込] ${p.name} さん (${p.type})`,
    body: body
  });
}

function doGet() {
  return ContentService.createTextOutput('TT2 apply endpoint OK');
}
