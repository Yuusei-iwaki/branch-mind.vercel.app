# Branch Mind 🧠
AIがあなたの`git diff`を読み取り、最適なブランチ名とコミットメッセージを提案するWebアプリ。

---

## 🚀 プロジェクト概要

**Branch Mind** は、開発者がコミットメッセージやブランチ名を考える時間を削減するためのAIアシスタントです。  
Gitの変更内容 (`git diff`) を貼り付けるだけで、AIが適切な命名を生成します。

---

## 🛠️ 技術スタック

| 分類 | 使用技術 |
|------|-----------|
| フレームワーク | Next.js (TypeScript, App Router) |
| UI | Tailwind CSS |
| AI | OpenAI GPT API |
| デプロイ | Vercel (無料プラン) |

---

## ⚙️ セットアップ手順

```bash
# クローン
git clone https://github.com/<your-name>/branch-mind-app.git
cd branch-mind-app

# 依存関係のインストール
npm install

# 環境変数を設定
echo "OPENAI_API_KEY=sk-xxxxxx" > .env.local

# 開発サーバー起動
npm run dev
