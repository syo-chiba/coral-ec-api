# 顧客詳細APIをローカル作業で追加する手順

この手順は、`main` から作業ブランチを作成し、ローカルで実装・確認してからリモートへ `push` する前提です。まずは Spring Boot 側に `GET /api/customers/{customerId}` を追加し、画面追加は別Issue/別PRに分けると進めやすいです。

## 1. 作業ブランチを main から作る

作業前に未コミット変更がないことを確認します。

```bash
git status
```

`main` に切り替えて最新化します。

```bash
git switch main
git pull origin main
```

顧客詳細API用のブランチを作成します。

```bash
git switch -c feature/customer-detail-api
```

ブランチ名は、今回のようなAPI追加なら `feature/customer-detail-api` のように「何を追加するか」が分かる名前にします。

## 2. 今回作るAPIの仕様

| 項目 | 内容 |
| --- | --- |
| Method | `GET` |
| Path | `/api/customers/{customerId}` |
| 正常レスポンス | `200 OK` |
| 見つからない場合 | `404 Not Found` |
| 用途 | 顧客IDを指定して、1顧客の契約回線詳細を取得する |

確認用URL例:

```text
http://localhost:8080/api/customers/C001
```

想定レスポンス例:

```json
{
  "customerId": "C001",
  "customerName": "山田太郎",
  "contractNo": "CT-1001",
  "phoneNumber": "090-1111-2222",
  "planName": "法人ギガライト",
  "lineStatus": "ACTIVE",
  "billingAmount": 12800,
  "lastCommunicationDate": "2026-06-10"
}
```

## 3. 最小実装で編集するファイル

まずはDB接続やRepositoryを増やさず、既存のサンプルデータから1件検索する形で進めます。

| ファイル | 作業内容 |
| --- | --- |
| `src/main/java/com/example/coral_ec/customer/CustomerController.java` | `GET /api/customers/{customerId}` を追加 |
| `src/main/java/com/example/coral_ec/exception/CustomerNotFoundException.java` | 顧客未存在の業務例外を追加 |
| `src/main/java/com/example/coral_ec/exception/ApiExceptionHandler.java` | `CustomerNotFoundException` を `404 Not Found` に変換 |
| `src/test/java/com/example/coral_ec/customer/CustomerControllerTest.java` | 正常系/404系のテストを追加 |

## 4. 実装イメージ

### 4-1. Controllerに詳細取得を追加

`CustomerController` に `@GetMapping("/{customerId}")` を追加します。

```java
@GetMapping("/{customerId}")
public CustomerResponse getCustomer(@PathVariable String customerId) {
    return CUSTOMERS.stream()
            .filter(customer -> customer.customerId().equalsIgnoreCase(customerId))
            .findFirst()
            .orElseThrow(() -> new CustomerNotFoundException(customerId));
}
```

必要なimport:

```java
import com.example.coral_ec.exception.CustomerNotFoundException;
import org.springframework.web.bind.annotation.PathVariable;
```

### 4-2. 顧客未存在例外を追加

```java
package com.example.coral_ec.exception;

public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(String customerId) {
        super("Customer not found: " + customerId);
    }
}
```

### 4-3. ExceptionHandlerに404変換を追加

```java
@ExceptionHandler(CustomerNotFoundException.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
public Map<String, String> handleCustomerNotFound(CustomerNotFoundException ex) {
    return Map.of("error", ex.getMessage());
}
```

## 5. ローカル確認手順

DBを起動します。

```bash
docker compose up -d
```

Spring Bootを起動します。

```bash
./gradlew bootRun
```

別ターミナルで正常系を確認します。

```bash
curl -i http://localhost:8080/api/customers/C001
```

期待する結果:

- HTTPステータスが `200 OK`
- `customerId` が `C001` のJSONが返る

存在しない顧客IDも確認します。

```bash
curl -i http://localhost:8080/api/customers/UNKNOWN
```

期待する結果:

- HTTPステータスが `404 Not Found`
- `error` メッセージが返る

## 6. テストとビルド

バックエンドのテストを実行します。

```bash
./gradlew test
```

必要に応じてjar作成も確認します。

```bash
./gradlew bootJar
```

フロントエンドを触っていない場合でも、PR前に全体確認として実行すると安心です。

```bash
cd frontend
npm run build
```

## 7. コミット前確認

変更内容を確認します。

```bash
git status
git diff
```

想定外のファイルが入っていないか確認してから、必要なファイルだけaddします。

```bash
git add src/main/java/com/example/coral_ec/customer/CustomerController.java \
  src/main/java/com/example/coral_ec/exception/CustomerNotFoundException.java \
  src/main/java/com/example/coral_ec/exception/ApiExceptionHandler.java \
  src/test/java/com/example/coral_ec/customer/CustomerControllerTest.java
```

コミットします。

```bash
git commit -m "Add customer detail API"
```

## 8. リモートへpushする

```bash
git push -u origin feature/customer-detail-api
```

push後、GitHubでPull Requestを作成します。

## 9. PR本文に書くこと

PRには最低限以下を書きます。

```markdown
## Summary
- Add `GET /api/customers/{customerId}` to fetch one customer by ID.
- Return `404 Not Found` when the customer does not exist.
- Add controller tests for success and not-found cases.

## Testing
- `./gradlew test`
- `./gradlew bootJar`
- `curl -i http://localhost:8080/api/customers/C001`
- `curl -i http://localhost:8080/api/customers/UNKNOWN`
```

## 10. 次のPRでやるとよいこと

顧客詳細APIができたら、次はフロントエンド側を別PRで進めます。

1. `frontend/src/services/customer-api.ts` に `getCustomer(customerId: string)` を追加する
2. `frontend/src/components/customer-detail.ts` を追加する
3. 一覧の行クリックまたは詳細ボタンから詳細表示へつなぐ
4. ローディング、404、APIエラー表示を追加する
