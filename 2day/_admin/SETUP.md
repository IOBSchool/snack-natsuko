# TT2 2日間チャレンジ 申込管理 自動連携セットアップ

決済 → thanksページのフォーム入力 → スプレッドシート自動追記 + 自動返信メール の流れ。

## なつこさんがやる作業（5ステップ・所要15分）

### 1. 申込管理スプレッドシートを作る
1. https://sheets.google.com で新規作成
2. ファイル名: `TT2_2日間チャレンジ_申込管理`
3. 1行目に下記ヘッダーを貼り付け（タブ区切り）

```
申込日時	種別	氏名(申込者)	メールアドレス	紹介者氏名	紹介者メール	決済方法	BAND参加希望	入金確認	Zoom送付	BAND招待	Day1出席	Day2出席	備考
```

4. シート名を「申込一覧」に変更
5. URLから **スプレッドシートID** をコピー（`/d/` と `/edit` の間の文字列）

### 2. Apps Script を設定
1. スプレッドシート画面で「拡張機能 → Apps Script」
2. `_admin/gas_apply_handler.gs` の中身を全部コピペ
3. 上の方の `SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';` を**さっきコピーしたID**に書き換え
4. 保存（💾）

### 3. ウェブアプリとしてデプロイ
1. 右上「デプロイ」→「新しいデプロイ」
2. 種類の歯車から「ウェブアプリ」を選択
3. 設定:
   - 次のユーザーとして実行: **自分**
   - アクセスできるユーザー: **全員**
4. デプロイ → 権限承認
5. 表示される **ウェブアプリURL** をコピー（`https://script.google.com/macros/s/...../exec`）

### 4. thanksページにエンドポイントを差し込む
- `thanks-single.html` と `thanks-referral.html` の最下部にある
  ```js
  const GAS_ENDPOINT = 'YOUR_GAS_WEBAPP_URL_HERE';
  ```
  を、コピーしたURLに書き換える

### 5. push して公開
```bash
cd "/Users/NatsukoLempke 1/Desktop/CCBooster_MacBook/TT2_launch_2026/snack-natsuko"
git add 2day/ && git commit -m "申込フォーム自動連携を追加" && git push
```

## 動作確認
1. https://iobschool.github.io/snack-natsuko/2day/thanks-single.html を開く
2. テスト送信（自分のメールで）
3. ✅ 申込管理シートに行が増える
4. ✅ 入力したメールに自動返信が届く
5. ✅ なつこさんのGmailに通知が届く

## トラブル時
- `gas_sheet_pitfalls.md`（メモリ）参照: タブ名・302・デプロイ権限のあるある
- 自動返信が届かない → GASの実行ログを「実行数」タブで確認
- スプレッドシートに書き込まれない → SHEET_ID が正しいか / シート名が「申込一覧」か
