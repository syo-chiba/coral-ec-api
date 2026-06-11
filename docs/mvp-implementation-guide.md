# Coral EC 初期リリース実装ガイド（学習向け）

このドキュメントは「自分でソースを書く」前提で、
最小ER設計をローカルに反映し、最終的にリモートへ反映するまでの手順をまとめています。

## 1. まず全体像を決める

初期リリース対象:

- 会員登録 / ログイン / プロフィール
- 出品
- 商品一覧・検索・絞り込み
- 商品詳細
- お気に入り（可能なら）
- チャット / コメント
- 評価・レビュー
- 通報 / ブロック

後回し:

- 通知

## 2. DBを先に作る（Flyway）

本リポジトリでは Flyway を使うため、`src/main/resources/db/migration` に
バージョン付きSQLを追加して進めます。

- 既存: `V1__init.sql`
- 追加: `V2__initial_release_schema.sql`

### 2-1. マイグレーション命名ルール

`V{連番}__{説明}.sql`

例:

- `V3__add_item_images.sql`
- `V4__add_purchase_table.sql`

## 3. 実装を進める順番（おすすめ）

1. 認証（register/login）
2. プロフィール取得・更新
3. 商品CRUD
4. 商品一覧（検索/絞り込み）
5. 商品詳細
6. お気に入り
7. コメント
8. チャット
9. レビュー
10. 通報・ブロック

## 4. ローカル反映手順

### 4-1. DBを起動

```bash
docker compose up -d
```

### 4-2. アプリ起動（Flyway自動実行）

```bash
./gradlew bootRun
```

### 4-3. テスト実行

```bash
./gradlew test
```

## 5. リモート反映手順

### 5-1. ブランチ作成

```bash
git switch -c feature/mvp-schema
```

### 5-2. 変更確認

```bash
git status
git diff
```

### 5-3. コミット

```bash
git add src/main/resources/db/migration/V2__initial_release_schema.sql docs/mvp-implementation-guide.md
git commit -m "Add MVP initial-release database schema and implementation guide"
```

### 5-4. push

```bash
git push -u origin feature/mvp-schema
```

### 5-5. PR作成

- 目的: 初期リリースMVPの土台となるテーブル定義追加
- 変更点: users拡張、profiles/items/favorites/comments/chat/reviews/reports/blocks追加
- 確認項目: Flywayが正常実行されること、既存機能影響がないこと

## 6. 学習効率を上げるコツ

- 1機能ごとに小さくコミットする
- SQLを先に書いてからAPIに進む
- Controllerより先にServiceのテストを書く
- 迷ったら「最低限動く形」でまず通す

## 7. 会員登録API（最小実装）

- Endpoint: `POST /api/auth/register`
- Request JSON:

```json
{
  "name": "Taro",
  "email": "taro@example.com",
  "password": "password123"
}
```

- Response: `201 Created`
- 重複メール時: `409 Conflict`
- バリデーションエラー: `400 Bad Request`

## 8. Step2: 登録ロジックだけを先に完成させる（DTO + Service + 業務例外）

Step2では、Controllerに進む前に「登録の中身」を完成させます。
この段階のゴールは、`UserRegistrationService.register()` が単体で正しく動くことです。

### 8-1. 追加/編集するファイル

- `src/main/java/com/example/coral_ec/dto/RegisterRequest.java`
- `src/main/java/com/example/coral_ec/dto/RegisterResponse.java`
- `src/main/java/com/example/coral_ec/exception/EmailAlreadyExistsException.java`
- `src/main/java/com/example/coral_ec/user/UserRegistrationService.java`

### 8-2. RegisterRequest の役割

- API入力の型を明示するためのDTO
- バリデーションをここに集約する
  - `name`: 必須、最大100文字
  - `email`: 必須、メール形式、最大255文字
  - `password`: 必須、8〜72文字

ポイント: Controller/Serviceで個別にチェックを書かずに済むようにする。

### 8-3. RegisterResponse の役割

- API出力の型を固定するためのDTO
- レスポンスにパスワードやハッシュ値を含めない

含める値（最小）:

- `id`
- `name`
- `email`
- `role`
- `createdAt`

### 8-4. EmailAlreadyExistsException の役割

- 「業務的にNG」なケース（重複メール）を表現する例外
- 想定内エラーを `IllegalStateException` 等で雑に扱わない

使いどころ:

- `existsByEmailIgnoreCase(email)` が true のときに throw

### 8-5. UserRegistrationService.register() の流れ

1. メール重複チェック
2. `name/email` の normalize（trim、小文字化）
3. `password` をBCryptでハッシュ化
4. `User` を保存
5. `RegisterResponse` に詰め替えて返却

擬似コード:

```text
if (email already exists) throw EmailAlreadyExistsException
user.name = trim(name)
user.email = lower(trim(email))
user.passwordHash = bcrypt(password)
saved = userRepository.save(user)
return RegisterResponse(saved...)
```

### 8-6. この段階での確認（Controllerなし）

- `UserRegistrationServiceTest` で以下を確認
  - 正常登録でレスポンスが返る
  - 重複メールで `EmailAlreadyExistsException` が投げられる

### 8-7. Step2が終わったら

次のStep3で Controller + ExceptionHandler を追加し、
HTTPステータス（201 / 409 / 400）をAPIとして確定させる。

## 9. Step A: Litフロント土台を作る

### 9-1. 初期セットアップ

`frontend/` に TypeScript + Lit + Vite の最小構成を配置。

### 9-2. 起動手順

```bash
cd frontend
npm install
npm run dev
```

### 9-3. ローカルAPI連携

Vite dev server は `/api` を Spring Boot の `http://localhost:8080` へプロキシします。詳細なローカル準備は `docs/local-development-preparation.md` を参照してください。

### 9-4. 環境変数

`.env.example` を `.env` にコピーし、API接続先を必要に応じて変更する。

```bash
cp .env.example .env
```

- `VITE_API_BASE_URL=http://localhost:8080`

### 9-4. 完了条件

- `http://localhost:5173` で画面が表示される
- 画面にAPI Base URLが表示される
- 次のStepで会員登録フォームを追加できる
