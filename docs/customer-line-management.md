# 顧客回線管理システム 学習用MVP

Spring Boot + TypeScript + Lit + GitHub Actions の実務寄り学習用として、顧客検索画面を最小スコープにしています。

## 対象スコープ

- 顧客名・契約番号・回線番号による検索条件入力
- `GET /api/customers` によるSpring Boot API連携
- 検索結果一覧表示
- 0件表示
- ローディング表示
- APIエラー表示

## 推奨ブランチ運用

| ブランチ | 用途 |
| --- | --- |
| `main` | 安定版 |
| `develop` | 開発統合 |
| `feature/customer-search` | 顧客検索画面 |
| `feature/customer-api` | 顧客検索API |
| `fix/search-error-handling` | 検索エラー表示修正 |

## 初期Issue例

1. 顧客検索画面のHTML構成を作成する
2. 顧客検索APIを作成する
3. 顧客検索画面からAPIを呼び出す
4. 0件時メッセージを表示する
5. APIエラー時のエラー表示を実装する
6. GitHub Actionsでフロントとバックエンドのビルドを実行する

## ローカル起動

```bash
./gradlew bootRun
```

```bash
cd frontend
npm install
npm run dev
```

Vite dev server は `/api` を `http://localhost:8080` にプロキシします。
