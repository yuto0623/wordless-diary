# Wordless-Diary  
感情だけを記録する日記アプリ 設計書（MVP）

---

## １．概要

### コンセプト
文章を一切書かせない。
1日1回、**感情を選ぶだけ**のミニマル日記アプリ。

- 理由か記録しない
- 過去は修正できない
- 感情の推移だけが残る

---

## ２．技術スタック

### フロントエンド
- Expo (React Native)
- TypeScript

### データベース
- expo-sqlite (SQLite)

### バックエンド
- なし（ローカルストレージのみ）

---

## ３．アプリ構成

---

## 4. データ設計（SQLite）

### データベース
- DB名: `wordless.db`

### テーブル定義

```sql
CREATE TABLE emotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,        -- YYYY-MM-DD
  emotion TEXT NOT NULL,            -- 感情キー
  created_at INTEGER NOT NULL       -- Unix timestamp
);
```

### 制約
- `date`は一意制約を持ち、1日に1回のみ記録可能
- 更新・削除は行わない

---

## ５．感情マスタ設計
### Emotion型
```typescript
export type EmotionType =
  | "calm"
  | "happy"
  | "sad"
  | "anxiety"
  | "anger"
  | "empty";
```

### 感情定義
| key | 意味 | UI表示 |
|-----|------|--------|
| calm | 落ち着き | 色とアイコン |
| happy | 高揚 | 色とアイコン |
| sad | 落ち込み | 色とアイコン |
| anxiety | 不安 | 色とアイコン |
| anger | 苛立ち | 色とアイコン |
| empty | 虚無 | 色とアイコン |

※ テキストラベルは基本表示しない

---
## ６．画面設計

### 6.1 Today画面 （起動画面）

**状態分岐**
- 今日の感情が未記録 → 感情選択UI表示
- 今日の感情が記録済み → 完了状態

**完了状態UI**
- 選択した感情のアイコンと色を表示
- 編集・再選択不可

### 6.2 感情選択UI
- 感情アイコンをグリッド表示
- タップ時にHaptic Feedback
- タップで選択、DBに保存
- 保存後、Today画面の完了状態に遷移

### 6.3 振り返り画面
- カレンダー表示（月単位）
- 各日付に感情アイコンを表示
- 過去の感情を閲覧可能
- 編集・削除不可
- 月間の感情統計表示（グラフ等）

---

## 7.ロジック設計

### 今日の判定
- 端末のローカル日時を使用
- 日付フォーマット: `YYYY-MM-DD`

### 1日１回の制御
- 感情記録時に`date`の一意制約で制御
- 上書き・更新処理は実装しない

---

## 8.非機能要件
- アカウント機能なし
- クラウド同期なし
- テキスト入力なし
- SNS共有なし
