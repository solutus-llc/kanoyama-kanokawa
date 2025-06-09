# ふるさと納税プラットフォーム

兎 郷 追いしかの山小鮒釣りしかの川

日本のふるさと納税をもっと楽しく、もっと賢くするプラットフォームサービスです。

## 概要

20以上のふるさと納税サービスを統合し、AIによるパーソナライズされたおすすめ商品を提供するWebアプリケーションです。

### 主な機能

- **統合プラットフォーム**: 複数のふるさと納税サービスの商品を一元管理
- **AIレコメンド**: 毎日3選のパーソナライズされたおすすめ商品
- **支出分析**: 消費・浪費・投資の自動分類とアドバイス
- **LINE LIFF対応**: LINEミニアプリとして利用可能
- **高度な検索**: カテゴリ・価格帯での絞り込み機能
- **履歴管理**: おすすめ履歴と統計表示

## 技術構成

- **フロントエンド**: Nuxt.js 3 + Vue 3 + TypeScript
- **スタイリング**: Tailwind CSS + Nuxt UI
- **データ管理**: SQL.js (クライアントサイド SQLite)
- **デプロイ**: GitHub Pages
- **統合**: LINE LIFF SDK

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# 静的ファイル生成
npm run generate

# GitHub Pages デプロイ
npm run deploy
```

## デプロイ

https://solutus-llc.github.io/kanoyama-kanokawa/

## ライセンス

MIT
