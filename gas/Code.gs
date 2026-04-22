/**
 * スナックなつこ 申込受付GAS
 *
 * 【セットアップ手順】
 * 1. Googleスプレッドシートを新規作成し、シート名を「申込」に変更
 *    1行目(ヘッダ): timestamp | name | email | source | message | event
 * 2. 拡張機能 > Apps Script を開き、このCode.gsを貼り付ける
 * 3. 下の SHEET_ID を、上記スプレッドシートのURLから取得して差し替える
 *    (https://docs.google.com/spreadsheets/d/ ★ここ★ /edit)
 * 4. ADMIN_EMAIL を管理者のGmailアドレスに差し替える
 * 5. デプロイ > 新しいデプロイ > 種類「ウェブアプリ」
 *    - 実行するユーザー: 自分
 *    - アクセスできるユーザー: 全員
 *    - デプロイ → 発行されたWeb App URL を form.js の GAS_ENDPOINT に貼る
 * 6. 権限承認(初回のみGmail/スプレッドシートアクセス許可)
 */

const SHEET_ID = "★スプレッドシートのIDをここに貼る★";
const SHEET_NAME = "申込";
const ADMIN_EMAIL = "organiclifeingermany@gmail.com";
const EVENT_LABEL = "スナックなつこ (2026/4/28 20:00)";
const ZOOM_URL = "https://us06web.zoom.us/j/89417697625?pwd=MLWA37wP1i2CiOl9bwub8jJna6rm4j.1";
const ZOOM_ID = "894 1769 7625";
const ZOOM_PASS = "717165";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    writeToSheet(data);
    sendThanksMail(data);
    sendAdminMail(data);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeToSheet(d) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow([
    d.timestamp || new Date().toISOString(),
    d.name || "",
    d.email || "",
    d.source || "",
    d.message || "",
    d.event || "",
  ]);
}

function sendThanksMail(d) {
  if (!d.email) return;
  const subject = `【受付完了】${EVENT_LABEL}`;
  const body = [
    `${d.name} 様`,
    ``,
    `この度はスナックなつこにお申し込みいただき、ありがとうございます。`,
    `以下の日時にお待ちしております。`,
    ``,
    `■ 日時: 2026年4月28日(火) 20:00〜21:00(盛り上がったら延長もあり)`,
    `■ 場所: オンライン(Zoom)`,
    `■ 参加費: 無料`,
    ``,
    `■ Zoom URL:`,
    `${ZOOM_URL}`,
    ``,
    `  ミーティングID: ${ZOOM_ID}`,
    `  パスコード: ${ZOOM_PASS}`,
    ``,
    `カメラ・マイクはオフのままでOKです。`,
    `途中入退室・聞くだけ参加も歓迎です。`,
    ``,
    `当日、お会いできるのを楽しみにしています。`,
    ``,
    `─────────────`,
    `Institut für Organic Business GmbH / THE THREAD`,
  ].join("\n");

  MailApp.sendEmail({ to: d.email, subject, body });
}

function sendAdminMail(d) {
  const subject = `[申込] ${EVENT_LABEL} - ${d.name}`;
  const body = [
    `新しい申込が届きました。`,
    ``,
    `お名前: ${d.name}`,
    `メール: ${d.email}`,
    `知ったきっかけ: ${d.source}`,
    `メッセージ: ${d.message}`,
    `受信時刻: ${d.timestamp}`,
  ].join("\n");
  MailApp.sendEmail({ to: ADMIN_EMAIL, subject, body });
}
