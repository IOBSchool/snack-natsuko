/**
 * スナックなつこ 申込受付GAS（第3夜・7/31用）
 */

const SHEET_ID = "1tlJPlJofgcBNdKf0-H0zdoFbKJbAqrLFFxcItxTwRng";
const SHEET_NAME = "第3夜_0731";
const ADMIN_EMAIL = "organiclifeingermany@gmail.com";
const EVENT_LABEL = "スナックなつこ 第3夜 (2026/7/31 20:00)";
const ZOOM_URL = "https://us06web.zoom.us/j/82181333557";
const ZOOM_ID = "821 8133 3557";

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

function writeToSheet(data) {
  const { name = "", email = "", source = "", message = "", event = "", timestamp } = data;
  const ts = timestamp || new Date().toISOString();
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow([ts, name, email, source, message, event]);
}

function sendThanksMail(data) {
  const { name = "", email = "" } = data;
  if (!email) return;
  const subject = "【受付完了】" + EVENT_LABEL;
  const body = [
    name + " 様",
    "",
    "この度はスナックなつこにお申し込みいただき、ありがとうございます。",
    "以下の日時にお待ちしております。",
    "",
    "■ 日時: 2026年7月31日(金) 20:00〜21:00(盛り上がったら延長もあり)",
    "■ 場所: オンライン(Zoom)",
    "■ 参加費: 無料",
    "",
    "■ Zoom URL:",
    ZOOM_URL,
    "",
    "  ミーティングID: " + ZOOM_ID,
    "",
    "カメラ・マイクはオフのままでOKです。",
    "途中入退室・聞くだけ参加も歓迎です。",
    "",
    "当日、お会いできるのを楽しみにしています。",
    "",
    "─────────────",
    "Institut für Organic Business GmbH / THE THREAD",
  ].join("\n");

  MailApp.sendEmail({ to: email, subject: subject, body: body });
}

function sendAdminMail(data) {
  const { name = "", email = "", source = "", message = "", timestamp = "" } = data;
  const subject = "[申込] " + EVENT_LABEL + " - " + name;
  const body = [
    "新しい申込が届きました。",
    "",
    "お名前: " + name,
    "メール: " + email,
    "知ったきっかけ: " + source,
    "メッセージ: " + message,
    "受信時刻: " + timestamp,
  ].join("\n");
  MailApp.sendEmail({ to: ADMIN_EMAIL, subject: subject, body: body });
}
