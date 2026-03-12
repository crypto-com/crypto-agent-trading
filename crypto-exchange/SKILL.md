---
name: spot
description: Crypto.com Exchange Spot request using the Crypto.com Exchange API. Authentication requires API key and secret key. Supports production and UAT sandbox.
metadata:
  version: 1.0.0
  author: Crypto.com
license: MIT
---

# Crypto.com Exchange Spot Skill

Spot request on Crypto.com Exchange using authenticated API endpoints. Requires API key and secret key for private endpoints. Return the result in JSON format.

## Quick Reference

| Endpoint | Method | Description | Required | Optional | Authentication |
|----------|--------|-------------|----------|----------|----------------|
| `public/get-instruments` (GET) | GET | List all supported instruments | None | None | No |
| `public/get-book` (GET) | GET | Order book for an instrument | instrument_name, depth | None | No |
| `public/get-candlestick` (GET) | GET | Candlestick/OHLCV data | instrument_name | timeframe, count, start_ts, end_ts | No |
| `public/get-trades` (GET) | GET | Recent public trades | instrument_name | count, start_ts, end_ts | No |
| `public/get-tickers` (GET) | GET | Ticker information | None | instrument_name | No |
| `public/get-valuations` (GET) | GET | Valuation data (index/mark price) | instrument_name, valuation_type | count, start_ts, end_ts | No |
| `public/get-expired-settlement-price` (GET) | GET | Expired settlement prices | instrument_type | page (must be ≥1) | No |
| `public/get-insurance` (GET) | GET | Insurance fund balance | instrument_name | count, start_ts, end_ts | No |
| `public/get-announcements` (GET) | GET | Exchange announcements (base: `https://api.crypto.com/v1/`) | None | category, product_type | No |
| `public/get-risk-parameters` (GET) | GET | Risk parameters for margin | None | None | No |
| `private/create-order` (POST) | POST | Place a new order | instrument_name, side, type | price, quantity, notional, client_oid, exec_inst, time_in_force, spot_margin, stp_scope, stp_inst, stp_id, fee_instrument_name, isolation_id, leverage, isolated_margin_amount | Yes |
| `private/create-order-list` (POST) | POST | Batch order creation (1-10, LIST only) | contingency_type, order_list | Per-order params | Yes |
| `private/amend-order` (POST) | POST | Modify an existing order | new_price, new_quantity | order_id, orig_client_oid, client_oid | Yes |
| `private/cancel-order` (POST) | POST | Cancel a single order | order_id or client_oid | None | Yes |
| `private/cancel-order-list` (POST) | POST | Batch cancel orders | contingency_type, order_list | None | Yes |
| `private/cancel-all-orders` (POST) | POST | Cancel all orders | None | instrument_name, type | Yes |
| `private/close-position` (POST) | POST | Close an open position | instrument_name, type | price, quantity, isolation_id | Yes |
| `private/get-open-orders` (POST) | POST | List ALL active open orders | None | instrument_name | Yes |
| `private/get-order-detail` (POST) | POST | Query specific order | order_id or client_oid | None | Yes |
| `private/get-order-history` (POST) | POST | Historical orders | None | instrument_name, start_time, end_time, limit, isolation_id | Yes |
| `private/get-trades` (POST) | POST | Account trade list | None | instrument_name, start_time, end_time, limit, isolation_id | Yes |
| `private/get-transactions` (POST) | POST | Transaction journal (trading, settlement, funding) | None | instrument_name, journal_type, start_time, end_time, limit, isolation_id | Yes |
| `private/user-balance` (POST) | POST | Current wallet balances | None | None | Yes |
| `private/user-balance-history` (POST) | POST | Historical balance snapshots | None | timeframe, end_time, limit | Yes |
| `private/get-accounts` (POST) | POST | Master/sub-account info | None | page_size, page | Yes |
| `private/get-subaccount-balances` (POST) | POST | All sub-account balances | None | None | Yes |
| `private/get-positions` (POST) | POST | Active positions | None | instrument_name | Yes |
| `private/create-subaccount-transfer` (POST) | POST | Transfer between accounts | from, to, currency, amount | None | Yes |
| `private/get-fee-rate` (POST) | POST | Trading fee structure | None | None | Yes |
| `private/get-instrument-fee-rate` (POST) | POST | Fee rate by instrument | instrument_name | None | Yes |
| `private/change-account-leverage` (POST) | POST | Adjust account leverage | account_id, leverage | None | Yes |
| `private/change-account-settings` (POST) | POST | Update account settings | None | stp_scope, stp_inst, stp_id, leverage | Yes |
| `private/get-account-settings` (POST) | POST | Retrieve account config | None | None | Yes |
| `private/create-withdrawal` (POST) | POST | Create a withdrawal | currency, amount, address | client_wid, address_tag, network_id | Yes |
| `private/get-deposit-address` (POST) | POST | Get deposit address | currency | None | Yes |
| `private/get-currency-networks` (POST) | POST | Get currency network info | None | None | Yes |
| `private/get-deposit-history` (POST) | POST | Get deposit history | None | currency, start_ts, end_ts, page_size, page, status | Yes |
| `private/get-withdrawal-history` (POST) | POST | Get withdrawal history | None | currency, start_ts, end_ts, page_size, page, status | Yes |
| `private/advanced/create-order` (POST) | POST | Create trigger/stop/TP order | instrument_name, side, type, quantity | price, ref_price, client_oid, time_in_force, exec_inst, stp_scope, stp_inst, stp_id, fee_instrument_name | Yes |
| `private/advanced/create-oco` (POST) | POST | Create OCO order (2 orders) | order_list (2 orders) | Per-order params | Yes |
| `private/advanced/cancel-oco` (POST) | POST | Cancel OCO order | list_id | None | Yes |
| `private/advanced/create-oto` (POST) | POST | Create OTO order (2 orders) | order_list (2 orders) | Per-order params | Yes |
| `private/advanced/cancel-oto` (POST) | POST | Cancel OTO order | list_id | None | Yes |
| `private/advanced/create-otoco` (POST) | POST | Create OTOCO order (3 orders) | order_list (3 orders) | Per-order params | Yes |
| `private/advanced/cancel-otoco` (POST) | POST | Cancel OTOCO order | list_id | None | Yes |
| `private/advanced/cancel-order` (POST) | POST | Cancel individual OTO/OTOCO leg | order_id or client_oid | None | Yes |
| `private/advanced/cancel-all-orders` (POST) | POST | Cancel all advanced orders | None | instrument_name, type | Yes |
| `private/advanced/get-open-orders` (POST) | POST | List open advanced orders | None | instrument_name | Yes |
| `private/advanced/get-order-detail` (POST) | POST | Query advanced order detail | order_id or client_oid | None | Yes |
| `private/advanced/get-order-history` (POST) | POST | Advanced order history | None | instrument_name, start_time, end_time, limit | Yes |

---

## Parameters

### Common Parameters

* **instrument_name**: Instrument name. Spot pairs use underscore format (e.g., `BTC_USD`, `ETH_USDT`, `CRO_USD`). **Case-sensitive** — `btc_usd` will not work
* **side**: Order side — `BUY` or `SELL`
* **type**: Order type — `LIMIT` or `MARKET`
* **quantity**: Order quantity (string, e.g., `"0.01"`)
* **notional**: Order value in quote currency (for MARKET BUY orders, use instead of quantity)
* **price**: Limit price (string, required for LIMIT orders, e.g., `"50000.00"`)
* **client_oid**: Optional client-assigned order ID (max 36 characters)
* **time_in_force**: Order duration policy
* **exec_inst**: Execution instructions (array)
* **stp_scope**: Self-trade prevention scope
* **stp_inst**: Self-trade prevention instruction
* **stp_id**: Self-trade prevention ID (0 to 32767)
* **fee_instrument_name**: Instrument to use for fee payment
* **spot_margin**: `SPOT` (default) or `MARGIN`
* **isolation_id**: Isolated margin position ID
* **leverage**: Leverage multiplier
* **isolated_margin_amount**: Amount for isolated margin
* **depth**: Order book depth. Must be ≥1 (e.g., 10, 50, 150). No hard upper limit — returns available levels
* **timeframe**: Candlestick interval
* **count**: Number of results to return. Max: 300 for candlestick, 150 for public trades. Min: 1 (0 → error 40004)
* **start_ts**: Start timestamp in Unix ms (used for public endpoints and wallet history)
* **end_ts**: End timestamp in Unix ms (used for public endpoints and wallet history)
* **start_time**: Start time in Unix time format, inclusive (used for trading history endpoints — `get-order-history`, `get-trades`, `get-transactions`). Nanosecond recommended for accurate pagination
* **end_time**: End time in Unix time format, exclusive (used for trading history endpoints). Nanosecond recommended for accurate pagination
* **limit**: Maximum number of records. Default: 100. Max: 100 (for trading history endpoints)
* **page_size**: Results per page. Default: 20. Max: 200. **Only works on wallet history endpoints** (`get-deposit-history`, `get-withdrawal-history`). Ignored on trading endpoints (`get-order-history`, `get-trades`, `get-open-orders`) — use `limit` instead
* **page**: Page number (0-based)
* **new_price**: New price for amend-order (required, must always be provided even if unchanged)
* **new_quantity**: New quantity for amend-order (required, must always be provided even if unchanged)
* **orig_client_oid**: Original client order ID for amend-order (alternative to order_id)
* **ref_price**: Trigger/reference price for advanced orders (used with STOP_LOSS, STOP_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT)
* **ref_price_type**: Reference price type — only `MARK_PRICE` supported for OCO/OTO/OTOCO trigger legs
* **contingency_type**: `LIST` for batch orders via `create-order-list` (OCO/OTO/OTOCO are **NOT** supported on this endpoint — returns 140001 API_DISABLED). Use `private/advanced/create-oco`, `create-oto`, `create-otoco` instead
* **order_list**: Array of order objects for batch/advanced order creation
* **list_id**: ID for OCO/OTO/OTOCO order groups (returned on creation, used for cancellation)
* **leg_id**: Leg identifier within OTO/OTOCO (1, 2, or 3)

### Wallet Parameters

* **currency**: Currency symbol (e.g., `BTC`, `CRO`, `USDT`)
* **amount**: Amount as string (e.g., `"1"`)
* **address**: Withdrawal destination address
* **address_tag**: Secondary address identifier for coins like XRP, XLM (also known as memo or tag)
* **network_id**: Desired network for withdrawal. Must be whitelisted first. See `get-currency-networks` for values
* **client_wid**: Optional client withdrawal ID
* **status**: Filter by status. Deposit: `0` (Not Arrived), `1` (Arrived), `2` (Failed), `3` (Pending). Withdrawal: `0` (Pending), `1` (Processing), `2` (Rejected), `3` (Payment In-progress), `4` (Payment Failed), `5` (Completed), `6` (Cancelled)
* **journal_type**: Transaction journal type filter. Values: `TRADING`, `SESSION_SETTLE`, `FUNDING`, etc.

### Request Envelope Parameters (all requests)

* **id**: Request identifier (integer, 0 to 9,223,372,036,854,775,807)
* **method**: API endpoint name (e.g., `"private/create-order"`)
* **nonce**: Current timestamp in milliseconds
* **params**: Parameters object (can be empty `{}`)
* **api_key**: Your API key (private methods only)
* **sig**: Digital signature (private methods only)

### Enums

* **type** (order): LIMIT | MARKET
* **side**: BUY | SELL
* **time_in_force**: GOOD_TILL_CANCEL | IMMEDIATE_OR_CANCEL | FILL_OR_KILL
* **exec_inst**: POST_ONLY | SMART_POST_ONLY | ISOLATED_MARGIN (array, POST_ONLY and SMART_POST_ONLY cannot coexist)
* **stp_scope**: M (master or sub account) | S (sub account only)
* **stp_inst**: M (cancel maker) | T (cancel taker) | B (cancel both)
* **spot_margin**: SPOT | MARGIN
* **timeframe** (candlestick): 1m | 5m | 15m | 30m | 1h | 2h | 4h | 6h | 12h | 1D | 7D | 14D | 1M (legacy formats also accepted: M1, M5, M15, M30, H1, H2, H4, H12, D1, D7, D14)
* **instrument_type**: PERPETUAL_SWAP | FUTURE
* **valuation_type**: INDEX_PRICE | MARK_PRICE (context-dependent)
* **contingency_type**: LIST (batch) | OTO | OTOCO (in responses)
* **type** (advanced order): STOP_LOSS | STOP_LIMIT | TAKE_PROFIT | TAKE_PROFIT_LIMIT
* **ref_price_type**: MARK_PRICE
* **order status** (advanced open): NEW | PENDING | ACTIVE
* **order status** (advanced history): REJECTED | CANCELED | FILLED | EXPIRED

### Important Notes

* **Must be strings**: `price`, `quantity`, `notional`, `ref_price`, `amount`, `new_price`, `new_quantity` — order/amount params must be strings (e.g., `"0.01"` not `0.01`). Sending as number returns errors: `price` → 308, `quantity` → 40101, `notional` → 50001, `ref_price` → 229
* **Must be numbers**: `limit`, `end_time` (on `user-balance-history`) — must be integers. Sending `limit` as string returns error 40003 on `get-order-history`, `get-trades`, `get-transactions`, `user-balance-history`, `advanced/get-order-history`
* **Accept both**: `page`, `page_size`, `count`, `depth`, `start_time`, `end_time` (on trading history), `start_ts`, `end_ts`

### Production Validation Notes

* **FAR_AWAY_LIMIT_PRICE (315)**: Limit orders with prices too far from market are rejected (e.g., BUY BTC @ $1 or SELL BTC @ $999,999). Keep limit prices within a reasonable range of current market price
* **Expired settlement page**: `public/get-expired-settlement-price` requires `page >= 1`. Sending `page=0` returns error 40004. Omitting `page` entirely works (returns first page)
* **Withdrawal whitelist**: `private/create-withdrawal` requires the destination address to be whitelisted in your **Exchange** withdrawal settings (not App). Non-whitelisted addresses return error 5000811 (WITHDRAW_ADDRESS_NOT_IN_WHITE_LIST)
* **Withdrawal amount is gross**: `amount` includes the fee. If you send `amount: "11"` and the network fee is 1, the recipient gets 10. The response shows `amount: 10` and `fee: 1`
* **Withdrawal network_id**: For multi-chain tokens (USDC, USDT, etc.), always specify `network_id`. Without it, the API may reject or pick an unexpected default chain
* **MARKET order + price**: MARKET orders ignore `price` if provided (no error). For MARKET BUY, use `notional`. For MARKET SELL, use `quantity`
* **POST_ONLY on MARKET**: Returns error 43005 (POST_ONLY_REJ). POST_ONLY only works with LIMIT orders
* **FOK/IOC on far-from-market LIMIT**: `FILL_OR_KILL` and `IMMEDIATE_OR_CANCEL` on limit orders far from market will immediately reject (43003/43004) since they can't fill
* **amend-order requires both**: Both `new_price` AND `new_quantity` must always be provided (even if one is unchanged). Omitting either returns 40004
* **Batch order max**: `create-order-list` accepts maximum 10 orders. 11+ returns 40004
* **HTTP methods are strict**: Public endpoints accept **GET only** (POST → 50001). Private endpoints accept **POST only** (GET → 40003)
* **Amend cancelled/filled order**: Returns 212 (INVALID_ORDERID). Can only amend ACTIVE orders
* **Unknown params are silently ignored**: Extra/unknown keys in `params` don't cause errors
* **Inverted time range**: `start_time` > `end_time` does NOT error — the API appears to ignore ordering and returns data anyway
* **cancel-all-orders scopes by instrument**: Only cancels orders for the specified `instrument_name`. Other instruments' orders are untouched
* **Multiple STOP orders on same instrument**: Allowed — no limit on concurrent trigger orders per instrument
* **OTO second leg must be trigger order**: The contingent (second) leg of an OTO must be STOP_LOSS, STOP_LIMIT, TAKE_PROFIT, or TAKE_PROFIT_LIMIT — not a plain LIMIT. Using LIMIT for the second leg returns 40004
* **OTOCO structure**: Leg 1 = primary LIMIT order, Leg 2 = take-profit trigger, Leg 3 = stop-loss trigger. Legs 2 and 3 must be trigger order types
* **MARKET BUY with both notional + quantity**: `quantity` takes priority over `notional`. If the quantity is below minimum, you get error 415 even if notional would be valid
* **get-open-orders has NO pagination**: `page`, `page_size`, `count`, and `limit` params are all ignored — returns ALL open orders regardless
* **get-order-history/get-trades pagination**: `limit` works correctly. `page`/`page_size` are **ignored** (always returns up to `limit`, default 100). Use `start_time`/`end_time` for windowed queries
* **Nonce accepts int or string** — float is rejected (40101). `id` must be a number (string → 40001)
* **Candlestick count max 300**: Requesting more silently caps at 300. `count=0` returns 40004. Min is 1
* **Public trades count max 150**: Requesting more silently caps at 150
* **get-instruments has no server-side filtering**: `inst_type`, `currency`, and other filter params are ignored — always returns ALL instruments (852+). Filter client-side
* **order_id format**: Always a numeric string (e.g., `"6530219599901000701"`). Returned as string, accepted as string or number
* **spot_margin values**: Only `"SPOT"` or `"MARGIN"` are valid. Invalid values → 50001. `"MARGIN"` requires margin access (error 416 without it)
* **get-valuations requires both params**: Must provide `instrument_name` AND `valuation_type` (only `mark_price` works for spot pairs; `index_price` → 40004). Without `valuation_type` → 40003
* **get-insurance requires instrument_name**: Not optional — omitting returns 40003
* **Candlestick valid timeframes**: `1m`, `5m`, `15m`, `30m`, `1h`, `2h`, `4h`, `6h`, `12h`, `1D`, `7D`, `14D`, `1M`. Legacy format also works: `M1`, `M5`, `M15`, `M30`, `H1`, `H2`, `H4`, `H12`, `D1`, `D7`, `D14`. Invalid timeframes (e.g., `2m`, `8h`, `3D`) return 40003
* Trading history endpoints (`get-order-history`, `get-trades`, `get-transactions`) use `start_time`/`end_time` with nanosecond precision recommended
* Wallet history endpoints (`get-deposit-history`, `get-withdrawal-history`) use `start_ts`/`end_ts` in milliseconds
* `notional` is used instead of `quantity` for MARKET BUY orders (specifies spend amount in quote currency)
* For MARKET SELL orders, use `quantity` (amount of base currency to sell)
* If you omit all parameters, you still need to pass an empty params block `params: {}` for API request consistency

---

## Advanced Order Management API

Advanced order types (trigger orders, OCO, OTO, OTOCO) are managed through the `private/advanced/*` endpoints. These are **Spot-only** for now.

### private/advanced/create-order

Creates a trigger order (STOP_LOSS, STOP_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT).

- `STOP_LIMIT` and `TAKE_PROFIT_LIMIT` execute a LIMIT order when `ref_price` is reached
- `STOP_LOSS` and `TAKE_PROFIT` execute a MARKET order when `ref_price` is reached

**Trigger direction:**
- `ref_price` below market: SELL STOP_LOSS/STOP_LIMIT, BUY TAKE_PROFIT/TAKE_PROFIT_LIMIT
- `ref_price` above market: BUY STOP_LOSS/STOP_LIMIT, SELL TAKE_PROFIT/TAKE_PROFIT_LIMIT

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| instrument_name | string | Y | e.g., BTC_USD |
| side | string | Y | BUY, SELL |
| type | string | Y | STOP_LOSS, STOP_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT |
| price | string | Depends | For STOP_LIMIT and TAKE_PROFIT_LIMIT only: limit price (e.g., `"0.12"`) |
| quantity | string | Y | Order quantity (e.g., `"10"`) |
| ref_price | string | N | Trigger price (e.g., `"0.12"`) |
| client_oid | string | N | Client order ID (max 36 chars) |
| time_in_force | string | N | GOOD_TILL_CANCEL (default), FILL_OR_KILL, IMMEDIATE_OR_CANCEL |
| exec_inst | array | N | POST_ONLY, SMART_POST_ONLY (cannot coexist) |
| stp_scope | string | N | M (master/sub) or S (sub only) |
| stp_inst | string | N* | M (cancel maker), T (cancel taker), B (cancel both). Required if stp_scope is set |
| stp_id | string | N | 0 to 32767 |
| fee_instrument_name | string | N | Preferred fee token |

```json
{
  "id": 6573,
  "method": "private/advanced/create-order",
  "params": {
    "instrument_name": "CRO_USD",
    "side": "SELL",
    "type": "STOP_LIMIT",
    "quantity": "10",
    "price": "0.12",
    "ref_price": "0.12",
    "client_oid": "c5f682ed-7108-4f1c-b755-972fcdca0f02"
  }
}
```

Response: `{ "order_id": "5755600460443882762", "client_oid": "..." }`

### private/advanced/create-oco

Creates a One-Cancels-the-Other order. When one leg is partially/fully executed, the other is automatically canceled. Exactly **2 orders** required: one LIMIT + one trigger (STOP_LOSS, STOP_LIMIT, TAKE_PROFIT, or TAKE_PROFIT_LIMIT).

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| order_list | array | Y | Exactly 2 orders. One must be LIMIT, other must be a trigger type |

Each order in `order_list` follows `private/create-order` params. For `ref_price_type` of the trigger order, only `MARK_PRICE` is supported.

```json
{
  "method": "private/advanced/create-oco",
  "id": 123456789,
  "nonce": 123456789000,
  "params": {
    "order_list": [
      {
        "instrument_name": "BTC_USD",
        "quantity": "0.1",
        "type": "LIMIT",
        "price": "93000",
        "side": "SELL"
      },
      {
        "instrument_name": "BTC_USD",
        "quantity": "0.1",
        "type": "STOP_LOSS",
        "ref_price": "80000",
        "side": "SELL"
      }
    ]
  }
}
```

Response: `{ "list_id": 6498090546073120100 }`

### private/advanced/create-oto

Creates a One-Triggers-the-Other order. When the first order (LIMIT) is fully executed, the second order (trigger) takes effect. Exactly **2 orders** required. The trigger order must be on the **opposite side** of the working LIMIT order (e.g., BUY LIMIT + SELL STOP_LOSS, or SELL LIMIT + BUY STOP_LOSS).

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| order_list | array | Y | Exactly 2 orders. One LIMIT + one trigger type. Trigger must be opposite side |

```json
{
  "method": "private/advanced/create-oto",
  "id": 123456789,
  "nonce": 123456789000,
  "params": {
    "order_list": [
      {
        "instrument_name": "BTC_USD",
        "quantity": "0.1",
        "type": "LIMIT",
        "price": "93000",
        "side": "BUY"
      },
      {
        "instrument_name": "BTC_USD",
        "quantity": "0.1",
        "type": "STOP_LOSS",
        "ref_price": "80000",
        "side": "SELL"
      }
    ]
  }
}
```

Response: `{ "list_id": 6498090546073120100 }`

### private/advanced/create-otoco

Creates a One-Triggers-a-One-Cancels-the-Other order. When the first LIMIT order is fully executed, two trigger orders take effect. When either trigger executes, the other is canceled. Exactly **3 orders** required: one LIMIT + one STOP_LOSS/STOP_LIMIT + one TAKE_PROFIT/TAKE_PROFIT_LIMIT. The trigger orders must be on the **opposite side** of the working LIMIT order.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| order_list | array | Y | Exactly 3 orders. One LIMIT + one stop + one take-profit. Triggers must be opposite side |

```json
{
  "method": "private/advanced/create-otoco",
  "id": 123456789,
  "nonce": 123456789000,
  "params": {
    "order_list": [
      {
        "instrument_name": "BTC_USD",
        "quantity": "0.1",
        "type": "LIMIT",
        "price": "93000",
        "side": "BUY"
      },
      {
        "instrument_name": "BTC_USD",
        "quantity": "0.1",
        "type": "STOP_LOSS",
        "ref_price": "80000",
        "side": "SELL"
      },
      {
        "instrument_name": "BTC_USD",
        "quantity": "0.1",
        "type": "TAKE_PROFIT",
        "ref_price": "108000",
        "side": "SELL"
      }
    ]
  }
}
```

Response: `{ "list_id": 6498090546073120100 }`

### private/advanced/cancel-oco, cancel-oto, cancel-otoco

Cancel an OCO/OTO/OTOCO order group.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| list_id | string | Y | List ID returned from create |

```json
{ "method": "private/advanced/cancel-oco", "id": 1234, "nonce": 123456789000, "params": { "list_id": "4421958062479290999" } }
```

### private/advanced/cancel-order

Cancel an individual leg of an OTO/OTOCO order.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| order_id | number or string | Depends | Either order_id or client_oid must be present. String format recommended |
| client_oid | string | Depends | Either order_id or client_oid must be present |

### private/advanced/cancel-all-orders

Cancel all advanced orders for an instrument.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| instrument_name | string | N | e.g., BTC_USD. Omit to cancel ALL instruments |
| type | string | N | LIMIT, TRIGGER, or ALL |

### private/advanced/get-open-orders

Get all open advanced orders.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| instrument_name | string | N | e.g., BTC_USD. Omit for all |

**Response fields per order:** account_id, order_id, client_oid, order_type, time_in_force, side, exec_inst, quantity, limit_price, order_value, maker_fee_rate, taker_fee_rate, avg_price, cumulative_quantity, cumulative_value, cumulative_fee, status (NEW/PENDING/ACTIVE), order_date, instrument_name, fee_instrument_name, list_id, contingency_type (OTO/OTOCO), leg_id, create_time, create_time_ns, update_time

### private/advanced/get-order-detail

Get details for a specific advanced order.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| order_id | number or string | Depends | String format recommended |
| client_oid | string | Depends | Either order_id or client_oid required |

**Response fields:** Same as get-open-orders, with status including: NEW, PENDING, REJECTED, ACTIVE, CANCELED, FILLED

### private/advanced/get-order-history

Get historical advanced orders.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| instrument_name | string | N | Omit for all |
| start_time | number or string | N | Unix timestamp (ns recommended). Default: end_time - 1 day |
| end_time | number or string | N | Unix timestamp (ns recommended). Default: current time |
| limit | int | N | Max results. Default: 100, Max: 100 |

**Note:** If you omit all parameters, you still need to pass `params: {}` for API request consistency.

**Response fields:** Same as get-open-orders, with status including: REJECTED, CANCELED, FILLED, EXPIRED

**Note:** To detect partial fills, check for status `ACTIVE` with `cumulative_quantity > 0`.

---

## Wallet API

### private/create-withdrawal

Creates a withdrawal request. Withdrawal setting must be enabled for your API Key. Withdrawal addresses must first be whitelisted in your account's Withdrawal Whitelist page.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| currency | string | Y | e.g., BTC, CRO, USDT |
| amount | string | Y | **Gross** amount to withdraw (fee is deducted from this). e.g., `"11"` with fee=1 sends 10 to destination |
| address | string | Y | Destination address. Must be whitelisted in Exchange withdrawal settings |
| client_wid | string | N | Optional client withdrawal ID (max 36 chars) |
| address_tag | string | N | Secondary identifier for XRP, XLM, etc. (memo/tag) |
| network_id | string | N | Network for multi-chain tokens (e.g., `"ARB"`, `"ETH"`, `"SOL"`). **Strongly recommended** for multi-chain currencies — use `get-currency-networks` to list available networks and fees |

### private/get-deposit-address

Get deposit addresses for a currency.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| currency | string | Y | e.g., BTC, CRO |

### private/get-currency-networks

Get all supported currency networks including withdrawal fees, minimum amounts, and deposit/withdrawal status.

No required parameters (pass empty `params: {}`).

### private/get-deposit-history

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| currency | string | N | e.g., BTC, CRO |
| start_ts | long | N | Default: 90 days from current timestamp |
| end_ts | long | N | Default: current timestamp |
| page_size | int | N | Page size (Default: 20, Max: 200) |
| page | int | N | Page number (0-based) |
| status | string | N | `0` (Not Arrived), `1` (Arrived), `2` (Failed), `3` (Pending) |

**Note:** Works for master account only, not for sub-accounts.

### private/get-withdrawal-history

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| currency | string | N | e.g., BTC, CRO |
| start_ts | long | N | Default: 90 days from current timestamp |
| end_ts | long | N | Default: current timestamp |
| page_size | int | N | Page size (Default: 20, Max: 200) |
| page | int | N | Page number (0-based) |
| status | string | N | `0` (Pending), `1` (Processing), `2` (Rejected), `3` (Payment In-progress), `4` (Payment Failed), `5` (Completed), `6` (Cancelled) |

**Note:** Works for master account only, not for sub-accounts.

---

## Authentication

For endpoints that require authentication (all `private/` methods), you will need to provide Crypto.com Exchange API credentials.

Required credentials:

* **apiKey**: Your Crypto.com Exchange API key (for request identification and header)
* **secretKey**: Your Crypto.com Exchange API secret (for HMAC-SHA256 signing)

Base URLs:

| Environment | REST API | User WebSocket | Market WebSocket |
|-------------|----------|----------------|------------------|
| Production | `https://api.crypto.com/exchange/v1/{method}` | `wss://stream.crypto.com/exchange/v1/user` | `wss://stream.crypto.com/exchange/v1/market` |
| UAT Sandbox | `https://uat-api.3ona.co/exchange/v1/{method}` | `wss://uat-stream.3ona.co/exchange/v1/user` | `wss://uat-stream.3ona.co/exchange/v1/market` |

### Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| `private/create-order`, `private/cancel-order`, `private/cancel-all-orders` | 15 requests per 100ms each |
| `private/get-order-detail` | 30 requests per 100ms |
| `private/get-trades` | 1 request per second |
| `private/get-order-history` | 1 request per second |
| All other private REST | 3 requests per 100ms each |
| Public market data (`get-book`, `get-tickers`, `get-trades`, etc.) | 100 requests per second each (per IP) |
| User API WebSocket | 150 requests per second |
| Market Data WebSocket | 100 requests per second |

### Open Order Limits

| Condition | Limit |
|-----------|-------|
| Max open orders per trading pair per account/subaccount | 200 |
| Max open orders across all pairs per account/subaccount | 1000 |

---

## Security

### Share Credentials

Users can provide Crypto.com Exchange API credentials by sending a file where the content is in the following format:

```bash
abc123...xyz
secret123...key
```

### Never Display Full Secrets

When showing credentials to users:
- **API Key:** Show first 5 + last 4 characters: `dG9rZ...8akf`
- **Secret Key:** Always mask, show only last 5: `***...ws1eK`

Example response when asked for credentials:
```
Account: main
API Key: dG9rZ...8akf
Secret: ***...ws1eK
Environment: Production
```

### Listing Accounts

When listing accounts, show names and environment only — never keys:
```
Crypto.com Exchange Accounts:
* main (Production)
* sandbox-dev (UAT Sandbox)
```

### Transactions in Production

When performing transactions in production, always confirm with the user before proceeding by asking them to write "CONFIRM" to proceed.

---

## Crypto.com Exchange Accounts

### main
- API Key: your_production_api_key
- Secret: your_production_secret
- Sandbox: false

### sandbox-dev
- API Key: your_sandbox_api_key
- Secret: your_sandbox_secret
- Sandbox: true

### TOOLS.md Structure

```bash
## Crypto.com Exchange Accounts

### main
- API Key: abc123...xyz
- Secret: secret123...key
- Sandbox: false
- Description: Primary trading account

### sandbox-dev
- API Key: test456...abc
- Secret: testsecret...xyz
- Sandbox: true
- Description: Development/testing
```

---

## Agent Behavior

1. Credentials requested: Mask secrets (show last 5 chars only)
2. Listing accounts: Show names and environment, never keys
3. Account selection: Ask if ambiguous, default to main
4. When doing a transaction in production, confirm with user before by asking to write "CONFIRM" to proceed
5. New credentials: Prompt for name, environment
6. Order params (`price`, `quantity`, `notional`, `ref_price`, `amount`) must be strings. `limit` must be a number. `page`/`page_size` accept both
7. Always include `Content-Type: application/json` header

## Adding New Accounts

When user provides new credentials:

* Ask for account name
* Ask: Production or UAT Sandbox
* Store in `TOOLS.md` with masked display confirmation

---

## Signing Requests

All private endpoints require HMAC-SHA256 signature.

### Signature Process

1. Sort `params` keys in ascending alphabetical order
2. Concatenate all param keys and values into a single string (no delimiters): `key1value1key2value2...`
   - For arrays: the key appears once, then each element's sorted key+value pairs are concatenated directly (**no array indices**)
   - For `None`/`null` values: use the string `"null"`
   - Recursion depth is limited to 3 levels
3. Build the signing payload: `{method}{id}{api_key}{param_string}{nonce}`
4. HMAC-SHA256 hash the payload using your secret key, output as hex string
5. Include `sig` in the request body

### User Agent Header

Include `User-Agent` header with the following string: `crypto-com-spot/1.0.0 (Skill)`

See [`references/authentication.md`](./references/authentication.md) for implementation details.
