# ローカル中心で進めるための準備チェックリスト

このリポジトリは、バックエンドを Spring Boot、フロントエンドを TypeScript + Lit + Vite、DBを PostgreSQL で動かす前提です。AWS は最初から準備せず、ローカル環境と GitHub の Issue / Pull Request / Actions で業務開発の流れを練習します。

## 1. 最初に用意するもの

| 種別 | 推奨 | 確認コマンド |
| --- | --- | --- |
| Java | 21 | `java -version` |
| Node.js | 22 LTS | `node -v` |
| npm | Node.js同梱版 | `npm -v` |
| Docker Desktop | PostgreSQL起動用 | `docker --version` |
| Git | ブランチ/コミット/PR用 | `git --version` |
| エディタ | VS Code または IntelliJ IDEA | 任意 |

Java はこのプロジェクトの `build.gradle` で Java 21 toolchain を指定しています。Node.js は GitHub Actions のフロントエンドCIでも 22 を使う想定です。

## 2. ローカル作業の基本順序

1. GitHubでリポジトリを作成またはforkする
2. ローカルへcloneする
3. DBを Docker Compose で起動する
4. Spring Boot APIを起動する
5. Vite dev serverを起動する
6. `feature/*` ブランチで小さく実装する
7. ローカルでビルド/テストを実行する
8. commit / push / Pull Request の順で反映する

## 3. 初回セットアップ

### 3-1. リポジトリをclone

```bash
git clone <your-repository-url>
cd coral-ec-api
```

### 3-2. DBを起動

```bash
docker compose up -d
```

PostgreSQL の接続情報は `src/main/resources/application.yml` にあります。

| 項目 | 値 |
| --- | --- |
| DB | `mynewapi` |
| User | `myuser` |
| Password | `mypass` |
| Port | `5432` |

### 3-3. バックエンドを起動

```bash
./gradlew bootRun
```

起動時に Flyway が `src/main/resources/db/migration` 配下のSQLを適用します。

### 3-4. フロントエンドを起動

```bash
cd frontend
npm install
npm run dev
```

フロントエンドは `http://localhost:5173` で起動します。Vite の proxy 設定により、画面からの `/api` 呼び出しは `http://localhost:8080` の Spring Boot API に転送されます。

## 4. 起動確認

### 4-1. API単体確認

```bash
curl 'http://localhost:8080/api/customers'
```

検索条件つき:

```bash
curl 'http://localhost:8080/api/customers?keyword=CT-1001'
```

### 4-2. 画面確認

1. ブラウザで `http://localhost:5173` を開く
2. 顧客検索画面が表示されることを確認する
3. `山田`、`CT-1001`、`090` などで検索する
4. 該当なしのキーワードで0件表示を確認する

## 5. 日々の作業ルール

### 5-1. ブランチを切る

```bash
git switch -c feature/customer-search-improvement
```

ブランチ名は以下のように目的が分かる名前にします。

| 種別 | 例 |
| --- | --- |
| 画面追加 | `feature/customer-detail-page` |
| API追加 | `feature/customer-detail-api` |
| 不具合修正 | `fix/customer-search-error-message` |
| ドキュメント | `docs/local-setup-guide` |

### 5-2. 変更前後を確認する

```bash
git status
git diff
```

### 5-3. ローカル確認を実行する

バックエンド:

```bash
./gradlew test
```

フロントエンド:

```bash
cd frontend
npm run build
```

### 5-4. コミットする

```bash
git add <changed-files>
git commit -m "Add customer search loading state"
```

### 5-5. pushしてPRを作る

```bash
git push -u origin feature/customer-search-improvement
```

PR本文には、最低限以下を書きます。

- 目的
- 変更点
- 確認したコマンド
- 画面変更がある場合はスクリーンショット

## 6. まず作るとよいIssue

ローカル中心で進めるなら、最初は以下の順番がおすすめです。

1. 顧客検索画面の表示確認をREADME化する
2. 顧客検索APIのレスポンス項目をAPI仕様としてdocsに書く
3. 顧客詳細API `GET /api/customers/{customerId}` を追加する
4. 顧客詳細コンポーネント `<customer-detail>` を追加する
5. APIエラー時の表示パターンを増やす
6. GitHub Actions が成功するようにpackage-lockを再作成してコミットする

## 7. つまずきやすい点

### npm install が失敗する

会社PCやプロキシ配下では npm registry へのアクセスが制限されることがあります。まず以下を確認します。

```bash
npm config get registry
npm config list
```

社内プロキシが必要な場合は、会社の開発環境手順に従って npm proxy / registry を設定してください。

### Spring Boot がDB接続で失敗する

Docker のDBが起動しているか確認します。

```bash
docker compose ps
```

DBを作り直したい場合は、データが消えることを理解したうえで実行します。

```bash
docker compose down -v
docker compose up -d
```

### Flywayで失敗する

SQLファイル名は `V{番号}__{説明}.sql` の形式にします。すでに適用済みのSQLを編集すると checksum mismatch になるため、新しい `V3__...sql` を追加して変更します。
