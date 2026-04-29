/**
 * スナックなつこ 申込受付GAS
 *
 * 【セットアップ手順】
 * 1. 既存スプレッドシートに「第2夜_0507」タブを新規追加(第1夜の申込と分離)
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
const SHEET_NAME = "第2夜_0507";
const ADMIN_EMAIL = "organiclifeingermany@gmail.com";
const EVENT_LABEL = "スナックなつこ 第2夜 (2026/5/7 20:00)";
const ZOOM_URL = "https://us06web.zoom.us/j/81756990799?pwd=3vpTe24JJXVEXPXiq6fdusp9MItmE4.1";
const ZOOM_ID = "817 5699 0799";
const ZOOM_PASS = "303200";

function doPost(e) { return handle(e); }
function doGet(e)  { return handle(e); }

function handle(e) {
  try {
    let data;
    if (e && e.parameter && e.parameter.payload) {
      data = JSON.parse(e.parameter.payload);
    } else if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error("no payload");
    }
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
    `■ 日時: 2026年5月7日(木) 20:00〜21:00(盛り上がったら延長もあり)`,
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
