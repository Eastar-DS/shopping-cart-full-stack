# API 명세서

## 공통

- 요청·응답 본문은 JSON 형식입니다.
- 성공 응답 본문은 도메인 데이터를 그대로 담습니다 (envelope 래퍼 없음).
- 에러 응답 본문은 `{ "error": "<에러 이름>", "message": "<설명 메시지>" }` 형태입니다.

### 상태 코드

| 상태 코드 | 의미                             |
| --------- | -------------------------------- |
| `200`     | 요청 성공                        |
| `201`     | 리소스 생성 성공                 |
| `204`     | 요청 성공, 응답 본문 없음        |
| `400`     | 요청 본문이 없거나 유효하지 않음 |
| `404`     | 요청한 리소스가 없음             |
| `409`     | 이미 존재하는 리소스와 충돌      |
| `500`     | 서버 오류                        |

### 에러 응답 형식

성공이 아닌 응답(`4xx`, `5xx`)은 다음 형식의 본문을 가집니다. 단, `204`는 본문이 없습니다.

```json
{
  "error": "string",
  "message": "string"
}
```

| `error` 값            | 발생 상황                                 | 상태 코드 |
| --------------------- | ----------------------------------------- | --------- |
| `InvalidInputError`   | 요청 본문이 누락되거나 유효성 검증에 실패 | `400`     |
| `NotFoundError`       | 요청한 리소스가 존재하지 않음             | `404`     |
| `DuplicateNameError`  | 이미 같은 이름의 리소스가 존재함          | `409`     |
| `InternalServerError` | 예기치 못한 서버 오류                     | `500`     |

`message`는 사람이 읽을 수 있는 설명 문자열이며 사용자에게 노출 가능한 정보만 포함합니다.

## 상품

### `GET /products`

상품 목록을 조회합니다.

Response `200`

```json
[
  {
    "id": "string",
    "name": "string",
    "price": number,
    "imageUrl": "string"
  }
]
```

Responses

- `500` `InternalServerError`: 서버 오류

### `POST /products`

상품을 추가합니다.

Request

```json
{
  "name": "string",
  "price": number,
  "imageUrl": "string"
}
```

Request fields

| 필드       | 타입     | 필수 | 조건                 |
| ---------- | -------- | ---- | -------------------- |
| `name`     | `string` | 예   | 1자 이상 100자 이하  |
| `price`    | `number` | 예   | 0보다 큰 유한한 숫자 |
| `imageUrl` | `string` | 예   | 비어있지 않은 문자열 |

Request example

```json
{
  "name": "새 상품",
  "price": 1000,
  "imageUrl": "/new.png"
}
```

Response `201` — 생성된 상품 전체를 반환합니다.

```json
{
  "id": "string",
  "name": "string",
  "price": number,
  "imageUrl": "string"
}
```

Responses

- `400` `InvalidInputError`: 필수 필드 누락 또는 유효하지 않은 값
- `409` `DuplicateNameError`: 같은 이름의 상품이 이미 존재
- `500` `InternalServerError`: 서버 오류

### `DELETE /products/:id`

상품을 삭제합니다.

삭제한 상품이 장바구니에 담겨 있으면 해당 장바구니 항목도 함께 삭제합니다.

Path parameters

| 이름 | 타입     | 설명           |
| ---- | -------- | -------------- |
| `id` | `string` | 삭제할 상품 id |

Responses

- `204`: 삭제 성공 (본문 없음)
- `404` `NotFoundError`: 상품 없음
- `500` `InternalServerError`: 서버 오류

## 장바구니

### `GET /carts`

장바구니 항목 목록을 조회합니다.

Response `200`

```json
[
  {
    "id": "string",
    "product": {
      "id": "string",
      "name": "string",
      "price": number,
      "imageUrl": "string"
    },
    "quantity": number
  }
]
```

Responses

- `500` `InternalServerError`: 서버 오류

### `PATCH /carts/:id`

장바구니 항목의 수량을 변경합니다.

Path parameters

| 이름 | 타입     | 설명                           |
| ---- | -------- | ------------------------------ |
| `id` | `string` | 수량을 변경할 장바구니 항목 id |

Request

```json
{
  "quantity": number
}
```

Request fields

| 필드       | 타입     | 필수 | 조건                  |
| ---------- | -------- | ---- | --------------------- |
| `quantity` | `number` | 예   | 1 이상 99 이하의 정수 |

Request example

```json
{
  "quantity": 3
}
```

Response `200`

```json
{
  "id": "string",
  "quantity": number
}
```

Responses

- `400` `InvalidInputError`: 본문 누락 또는 유효하지 않은 수량
- `404` `NotFoundError`: 장바구니 항목 없음
- `500` `InternalServerError`: 서버 오류

### `DELETE /carts/:id`

장바구니 항목을 삭제합니다.

Path parameters

| 이름 | 타입     | 설명                    |
| ---- | -------- | ----------------------- |
| `id` | `string` | 삭제할 장바구니 항목 id |

Responses

- `204`: 삭제 성공 (본문 없음)
- `404` `NotFoundError`: 장바구니 항목 없음
- `500` `InternalServerError`: 서버 오류

### `GET /coupons`

사용 가능한 쿠폰 목록을 조회합니다.

Response `200`

```json
[
  {
    "id": 1,
    "name": "5,000원 할인 쿠폰",
    "type": "FIXED5000",
    "expirationDate": "2026-11-30"
  },
  {
    "id": 2,
    "name": "2+1 쿠폰",
    "type": "BOGO",
    "expirationDate": "2026-06-30"
  }
]
```

Responses

- `200` 쿠폰 목록 반환 성공
- `500` `InternalServerError`: 서버 오류

---

### `POST /order/preview`

선택한 장바구니 상품과 쿠폰을 바탕으로 주문금액, 할인금액, 배송비, 최종 결제금액을 계산합니다.

Request

```json
{
  "selectedItemIds": [1, 2, 3],
  "coupons": [1, 2],
  "isRemoteArea": false
}
```

Request fields

| 필드              | 타입       | 필수 | 조건                                   |
| ----------------- | ---------- | ---- | -------------------------------------- |
| `selectedItemIds` | `number[]` | 예   | 1개 이상의 CartItem id 배열            |
| `coupons`         | `number[]` | 예   | 최대 2개의 쿠폰 id 배열 (빈 배열 허용) |
| `isRemoteArea`    | `boolean`  | 예   | 제주 및 도서산간 지역 여부             |

Request example

```json
{
  "selectedItemIds": [1, 2, 3],
  "coupons": [1],
  "isRemoteArea": true
}
```

Response `200` — 계산된 주문 금액 정보를 반환합니다.

```json
{
  "orderAmount": 150000,
  "couponDiscount": 5000,
  "deliveryFee": 3000,
  "totalPrice": 148000,
  "appliedCoupons": [1]
}
```

Response fields

| 필드             | 타입       | 설명                                                         |
| ---------------- | ---------- | ------------------------------------------------------------ |
| `orderAmount`    | `number`   | 쿠폰 적용 전 주문금액                                        |
| `couponDiscount` | `number`   | 쿠폰 할인금액                                                |
| `deliveryFee`    | `number`   | 배송비                                                       |
| `totalPrice`     | `number`   | 최종 결제금액 (`orderAmount - couponDiscount + deliveryFee`) |
| `appliedCoupons` | `number[]` | 실제 적용된 쿠폰 id 배열                                     |

Responses

- `400` `InvalidInputError`: selectedItemIds가 비어있거나 coupons가 3개 이상인 경우
- `500` `InternalServerError`: 서버 오류
