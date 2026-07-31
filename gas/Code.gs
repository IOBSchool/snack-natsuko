/**
 * スナックなつこ 申込受付GAS（第4夜/第5夜/第6夜・複数日程選択対応）
 */

const SHEET_ID = "1tlJPlJofgcBNdKf0-H0zdoFbKJbAqrLFFxcItxTwRng";
const ADMIN_EMAIL = "organiclifeingermany@gmail.com";

// Zoomは今後恒久的にこの部屋を使う（2日間チャレンジと共通）
const ZOOM_URL = "https://us06web.zoom.us/j/5403853001?pwd=NnBrSmxBeWYxZXhuWkdIK1ZoZW5XQT09&omn=82181333557";
const ZOOM_ID = "540 385 3001";
const ZOOM_PASS = "7RP26b";

// 日程ごとの設定（value=フォームのcheckbox値）
const EVENTS = {
  "2026-08-28": { label: "第4夜(2026/8/28 20:00〜21:00)", sheetName: "第4夜_0828" },
  "2026-09-25": { label: "第5夜(2026/9/25 20:00〜21:00)", sheetName: "第5夜_0925" },
  "2026-10-30": { label: "第6夜(2026/10/30 20:00〜21:00)", sheetName: "第6夜_1030" },
};
const SHEET_HEADER = ["受付日時", "お名前", "メールアドレス", "知ったきっかけ", "メッセージ", "選択した夜(全体)"];

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

function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(SHEET_HEADER);
    sheet.getRange(1, 1, 1, SHEET_HEADER.length).setFontWeight("bold");
  }
  return sheet;
}

function labelsForDates(dates) {
  return (dates || []).map(function (d) { return EVENTS[d] ? EVENTS[d].label : d; });
}

function writeToSheet(data) {
  const { name = "", email = "", source = "", message = "", dates = [], timestamp } = data;
  const ts = timestamp || new Date().toISOString();
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const allLabels = labelsForDates(dates).join("・");

  dates.forEach(function (d) {
    const ev = EVENTS[d];
    if (!ev) return;
    const sheet = getOrCreateSheet(spreadsheet, ev.sheetName);
    sheet.appendRow([ts, name, email, source, message, allLabels]);
  });
}

function sendThanksMail(data) {
  const { name = "", email = "", dates = [] } = data;
  if (!email) return;
  const labels = labelsForDates(dates);
  const subject = "【受付完了】スナックなつこ " + labels.join("・");
  const body = [
    name + " 様",
    "",
    "この度はスナックなつこにお申し込みいただき、ありがとうございます。",
    "以下の日時にお待ちしております。",
    "",
    "■ お申し込みの夜:",
    labels.map(function (l) { return "・" + l; }).join("\n"),
    "",
    "■ 場所: オンライン(Zoom)",
    "■ 参加費: 無料",
    "",
    "■ Zoom URL(毎回共通・このままずっと使えます):",
    ZOOM_URL,
    "",
    "  ミーティングID: " + ZOOM_ID,
    "  パスコード: " + ZOOM_PASS,
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
  const { name = "", email = "", source = "", message = "", dates = [], timestamp = "" } = data;
  const labels = labelsForDates(dates);
  const subject = "[申込] スナックなつこ " + labels.join("・") + " - " + name;
  const body = [
    "新しい申込が届きました。",
    "",
    "お名前: " + name,
    "メール: " + email,
    "選択した夜: " + labels.join("・"),
    "知ったきっかけ: " + source,
    "メッセージ: " + message,
    "受信時刻: " + timestamp,
  ].join("\n");
  MailApp.sendEmail({ to: ADMIN_EMAIL, subject: subject, body: body });
}
