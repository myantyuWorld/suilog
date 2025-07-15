# cc-multi-template
以下の記事を実践してみた。
- https://chatgpt-lab.com/n/na59171855b1e

## 喫煙記録アプリの仕様

このプロジェクトでは喫煙記録を管理するWebアプリケーションを開発しています。

### 主な機能
- 喫煙記録の追加・編集・削除
- 日次・月次の目標設定機能
- 進捗状況の可視化
- 統計情報の表示

### 技術スタック
- Frontend: Vue with TypeScript
- Styling: TailwindCSS v4
- CI/CD: GitHub Actions
- Deployment: GitHub Pages

## 開発手法

### git worktreeを使ったマルチセッション開発

このプロジェクトでは、git worktreeとClaude Codeのマルチセッション機能を活用した並列開発を実施しました。

#### 利点
- 複数のfeatureブランチで同時作業が可能
- ブランチ切り替えなしでの並列開発
- Claude Codeの複数セッションによる効率的な開発フロー
