# スナックなつこ 申込LP

2026年4月28日(火)21:00開催「スナックなつこ」の申込LP。GitHub Pagesでホスト、申込はGoogle Apps Script経由でGoogleスプレッドシートに記録＋自動返信メール。

## 構成

```
snack-natsuko/
├── index.html      # LP本体
├── style.css       # スタイル
├── form.js         # フォーム送信(GASへPOST)
├── gas/Code.gs     # Apps Script (スプレッドシート書込+メール送信)
└── README.md
```

## セットアップ手順

### 1. GAS側(Googleフォーム代わり)

1. 新しいGoogleスプレッドシートを作成、シート名を`申込`に変更。1行目に `timestamp | name | email | source | message | event` のヘッダ。
2. 拡張機能 > Apps Script を開く。
3. `gas/Code.gs` の内容を貼り付け、以下を差し替え:
   - `SHEET_ID` …スプレッドシートURLの `/d/◯◯◯/edit` の◯◯◯部分
   - `ADMIN_EMAIL` …管理者Gmail
   - `ZOOM_URL` …当日のZoom URL
4. 「デプロイ > 新しいデプロイ > ウェブアプリ」
   - 実行するユーザー: 自分
   - アクセスできるユーザー: **全員**
5. 発行されたWeb App URLをコピー。
6. `form.js` の `GAS_ENDPOINT` に貼り付ける。

### 2. GitHubにpushしてGitHub Pagesで公開

ターミナルで以下を実行:

```bash
cd "~/Desktop/CCBooster_MacBook/TT2_launch_2026/snack-natsuko"
git init
git add .
git commit -m "init: snack-natsuko LP"
git branch -M main
```

GitHubで新規リポジトリ `snack-natsuko` を作成(Public)。その後:

```bash
git remote add origin https://github.com/iobschool/snack-natsuko.git
git push -u origin main
```

GitHubのリポジトリページで:
- Settings > Pages
- Source: `Deploy from a branch`
- Branch: `main` / `/ (root)` → Save

1〜2分後、`https://iobschool.github.io/snack-natsuko/` で公開される。

### 3. 更新するとき

```bash
git add .
git commit -m "update: 内容"
git push
```

## メモ

- GASのdoPostはCORSプリフライトを受けられないため、form.jsでは`mode: "no-cors"`で送信している(レスポンスは読めないが書込・メール送信は動く)。
- 申込の確認はスプレッドシートで。
- 公開前のテスト送信を忘れずに。
