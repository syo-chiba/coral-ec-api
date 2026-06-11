# Spring Bootで coral-ec-api をローカル閲覧する設定

`coral-ec-api` は Spring Boot のREST APIとして起動し、ブラウザまたは `curl` でAPIレスポンスを確認します。Lit/Viteの画面から見る場合は、別ターミナルでフロントエンドも起動します。

## 1. 事前に確認する設定

### DB接続設定

Spring Boot は `src/main/resources/application.yml` の設定で PostgreSQL に接続します。

| 項目 | 値 |
| --- | --- |
| URL | `jdbc:postgresql://localhost:5432/mynewapi` |
| User | `myuser` |
| Password | `mypass` |
| Flyway migration | `classpath:db/migration` |

### Docker Compose設定

`docker-compose.yml` は Spring Boot のDB接続設定と同じ値で PostgreSQL を起動します。

| 項目 | 値 |
| --- | --- |
| Container | `my-new-api-db` |
| Database | `mynewapi` |
| User | `myuser` |
| Password | `mypass` |
| Port | `5432:5432` |

## 2. バックエンドだけを見る手順

### 2-1. DBを起動

```bash
docker compose up -d
```

### 2-2. Spring Bootを起動

```bash
./gradlew bootRun
```

Spring Boot は通常 `http://localhost:8080` で起動します。

### 2-3. ブラウザで起動確認

以下をブラウザで開きます。

```text
http://localhost:8080/
```

`coral-ec is running` と表示されれば、Spring Boot は起動できています。

### 2-4. 顧客検索APIを確認

全件取得:

```text
http://localhost:8080/api/customers
```

検索条件つき:

```text
http://localhost:8080/api/customers?keyword=CT-1001
```

ブラウザでJSONが表示されれば、API確認は完了です。

## 3. 画面から見る手順

Lit/Vite の画面から確認する場合は、Spring Bootを起動したまま別ターミナルで以下を実行します。

```bash
cd frontend
npm install
npm run dev
```

その後、ブラウザで以下を開きます。

```text
http://localhost:5173
```

フロントエンドは `/api` へのリクエストを Spring Boot の `http://localhost:8080` にプロキシします。

## 4. よくあるエラー

### Docker Desktop が起動していない

Windowsで以下のようなエラーが出る場合は、Docker Desktop または Docker daemon が起動できていません。

```text
failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine
```

対処手順:

1. Windowsのスタートメニューから Docker Desktop を起動する
2. Docker Desktop の画面左下またはステータス表示が `Engine running` になるまで待つ
3. ターミナルを開き直す
4. 以下でDockerが応答するか確認する

```bash
docker version
docker compose version
```

その後、再度DBを起動します。

```bash
docker compose up -d
```

### DB接続エラーになる

まずDBコンテナが起動しているか確認します。

```bash
docker compose ps
```

起動していなければ、以下で起動します。

```bash
docker compose up -d
```

### ポート8080が使用中

別のSpring Bootやアプリが起動している可能性があります。停止するか、一時的に別ポートで起動します。

```bash
./gradlew bootRun --args='--server.port=8081'
```

この場合、ブラウザでは `http://localhost:8081/` を開きます。

### フロントエンドからAPIが見えない

Spring Boot が `http://localhost:8080` で起動しているか確認してください。Vite の proxy は `/api` を `http://localhost:8080` に転送する前提です。
