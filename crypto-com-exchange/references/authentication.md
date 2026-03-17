# Crypto.com Exchange Authentication

All private endpoints require HMAC-SHA256 signed requests.

## Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://api.crypto.com/exchange/v1/{method}` |
| UAT Sandbox | `https://uat-api.3ona.co/exchange/v1/{method}` |

## Request Structure

All requests (public and private) use the following JSON envelope:

```json
{
  "id": 1,
  "method": "private/create-order",
  "api_key": "your_api_key",
  "params": {
    "instrument_name": "BTC_USDT",
    "side": "BUY",
    "type": "LIMIT",
    "price": "50000.00",
    "quantity": "0.001"
  },
  "sig": "generated_signature_hex",
  "nonce": 1234567890123
}
```

**Public endpoints** only require `id`, `method`, `params`, and `nonce`.
**Private endpoints** additionally require `api_key` and `sig`.

## Required Headers

```
Content-Type: application/json
User-Agent: crypto-com-exchange/1.0.1 (Skill)
```

## Signing Process

### Step 1: Sort Parameters

Sort the keys in `params` alphabetically in ascending order.

Example params:
```json
{
  "instrument_name": "BTC_USDT",
  "side": "BUY",
  "type": "LIMIT",
  "price": "50000.00",
  "quantity": "0.001"
}
```

Sorted keys: `instrument_name`, `price`, `quantity`, `side`, `type`

### Step 2: Build Parameter String

Concatenate each key with its value (no separators, no spaces):

```
instrument_nameBTC_USDTprice50000.00quantity0.001sideBUYtypeLIMIT
```

**For nested arrays/objects:** Recursively sort and concatenate. For arrays, concatenate each element's string representation directly (no index numbers). For objects within arrays, sort their keys and concatenate key+value pairs. For `None`/`null` values, use the string `"null"`.

**For empty params `{}`:** The parameter string is empty `""`.

**Example with array params** (`order_list`):
```json
{
  "contingency_type": "LIST",
  "order_list": [
    {"instrument_name": "BTC_USDT", "side": "BUY", "type": "LIMIT", "price": "50000", "quantity": "0.1"},
    {"instrument_name": "ETH_USDT", "side": "BUY", "type": "LIMIT", "price": "3000", "quantity": "1"}
  ]
}
```
Parameter string: `contingency_typeLISTorder_listinstrument_nameBTC_USDTprice50000quantity0.1sideBUYtypeLIMITinstrument_nameETH_USDTprice3000quantity1sideBUYtypeLIMIT`

Note: The outer key `order_list` appears once, then each array element's sorted key-value pairs are concatenated directly — **no array indices**.

### Step 3: Build Signing Payload

Concatenate in this exact order:

```
{method}{id}{api_key}{param_string}{nonce}
```

Example:
```
private/create-order1your_api_keyinstrument_nameBTC_USDTprice50000.00quantity0.001sideBUYtypeLIMIT1234567890123
```

### Step 4: Generate Signature

Create HMAC-SHA256 hash of the signing payload using your secret key, output as hex:

```bash
echo -n "private/create-order1your_api_keyinstrument_nameBTC_USDTprice50000.00quantity0.001sideBUYtypeLIMIT1234567890123" | \
  openssl dgst -sha256 -hmac "your_secret_key"
```

### Step 5: Include Signature in Request

Add the hex signature as the `sig` field in the request body.

## Complete Example

### Bash

```bash
#!/bin/bash
API_KEY="your_api_key"
SECRET_KEY="your_secret_key"
BASE_URL="https://api.crypto.com/exchange/v1"

# Get current timestamp in milliseconds
NONCE=$(date +%s%3N)

# Request ID
ID=1

# Method
METHOD="private/create-order"

# Build param string (keys sorted alphabetically, concatenated with values)
PARAM_STRING="instrument_nameBTC_USDTprice50000.00quantity0.001sideBUYtypeLIMIT"

# Build signing payload
PAYLOAD="${METHOD}${ID}${API_KEY}${PARAM_STRING}${NONCE}"

# Generate HMAC-SHA256 signature
SIG=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET_KEY" | cut -d' ' -f2)

# Make request
curl -X POST "${BASE_URL}/${METHOD}" \
  -H "Content-Type: application/json" \
  -H "User-Agent: crypto-com-exchange/1.0.1 (Skill)" \
  -d "{
    \"id\": ${ID},
    \"method\": \"${METHOD}\",
    \"api_key\": \"${API_KEY}\",
    \"params\": {
      \"instrument_name\": \"BTC_USDT\",
      \"side\": \"BUY\",
      \"type\": \"LIMIT\",
      \"price\": \"50000.00\",
      \"quantity\": \"0.001\"
    },
    \"sig\": \"${SIG}\",
    \"nonce\": ${NONCE}
  }"
```

### Python

```python
import hmac
import hashlib
import time
import json
import requests

API_KEY = "your_api_key"
SECRET_KEY = "your_secret_key"
BASE_URL = "https://api.crypto.com/exchange/v1"

MAX_LEVEL = 3


def params_to_str(obj, level):
    """
    Recursively convert params to signing string.
    Based on official Crypto.com reference implementation.
    - Dict keys are sorted alphabetically
    - Arrays: elements are concatenated directly (no indices)
    - None values become 'null'
    - Recursion limited to MAX_LEVEL depth
    """
    if level >= MAX_LEVEL:
        return str(obj)

    if not isinstance(obj, dict):
        return str(obj)

    return_str = ""
    for key in sorted(obj):
        return_str += key
        if obj[key] is None:
            return_str += "null"
        elif isinstance(obj[key], list):
            for sub_obj in obj[key]:
                return_str += params_to_str(sub_obj, level + 1)
        else:
            return_str += str(obj[key])
    return return_str


def sign_request(req: dict) -> None:
    """Sign a request dict in-place by adding the 'sig' field."""
    param_str = ""
    if "params" in req:
        param_str = params_to_str(req["params"], 0)

    payload = req["method"] + str(req["id"]) + req["api_key"] + param_str + str(req["nonce"])
    req["sig"] = hmac.new(
        bytes(SECRET_KEY, "utf-8"),
        msg=bytes(payload, "utf-8"),
        digestmod=hashlib.sha256
    ).hexdigest()


def send_request(method: str, params: dict) -> dict:
    """Send a signed request to the Crypto.com Exchange API."""
    req = {
        "id": 1,
        "method": method,
        "api_key": API_KEY,
        "params": params,
        "nonce": int(time.time() * 1000)
    }
    sign_request(req)

    response = requests.post(
        f"{BASE_URL}/{method}",
        json=req,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "crypto-com-exchange/1.0.1 (Skill)"
        }
    )
    return response.json()


# Example: Place a limit buy order
result = send_request("private/create-order", {
    "instrument_name": "BTC_USDT",
    "side": "BUY",
    "type": "LIMIT",
    "price": "50000.00",
    "quantity": "0.001"
})
print(json.dumps(result, indent=2))
```

### JavaScript / Node.js

```javascript
const crypto = require("crypto");

const API_KEY = "your_api_key";
const SECRET_KEY = "your_secret_key";
const BASE_URL = "https://api.crypto.com/exchange/v1";

/**
 * Convert params to signing string.
 * Based on official Crypto.com reference implementation.
 * - Object keys sorted alphabetically
 * - Arrays: elements concatenated directly (NO indices)
 * - null/undefined → ""
 */
function isObject(obj) {
  return obj !== undefined && obj !== null && obj.constructor === Object;
}

function isArray(obj) {
  return obj !== undefined && obj !== null && obj.constructor === Array;
}

function arrayToString(arr) {
  return arr.reduce((a, b) => {
    return a + (isObject(b) ? objectToString(b) : isArray(b) ? arrayToString(b) : b);
  }, "");
}

function objectToString(obj) {
  if (obj == null) return "";
  return Object.keys(obj)
    .sort()
    .reduce((a, b) => {
      return (
        a +
        b +
        (isArray(obj[b])
          ? arrayToString(obj[b])
          : isObject(obj[b])
            ? objectToString(obj[b])
            : obj[b])
      );
    }, "");
}

function signRequest(requestBody) {
  const { id, method, params, nonce } = requestBody;
  const paramsString = objectToString(params);
  const sigPayload = method + id + API_KEY + paramsString + nonce;
  requestBody.sig = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(sigPayload)
    .digest("hex");
}

async function sendRequest(method, params = {}) {
  const body = {
    id: 1,
    method,
    api_key: API_KEY,
    params,
    nonce: Date.now(),
  };
  signRequest(body);

  const response = await fetch(`${BASE_URL}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "crypto-com-exchange/1.0.1 (Skill)",
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

// Example: Place a limit buy order
sendRequest("private/create-order", {
  instrument_name: "BTC_USDT",
  side: "BUY",
  type: "LIMIT",
  price: "50000.00",
  quantity: "0.001",
}).then((res) => console.log(JSON.stringify(res, null, 2)));
```

## Public Endpoint Example (No Auth)

Public endpoints don't require `api_key` or `sig`:

```bash
curl -X GET "https://api.crypto.com/exchange/v1/public/get-tickers?instrument_name=BTC_USDT" \
  -H "Content-Type: application/json" \
  -H "User-Agent: crypto-com-exchange/1.0.1 (Skill)"
```

## Troubleshooting

### Common Error Codes

| Code | HTTP | Message Code | Description |
|------|------|--------------|-------------|
| 0 | 200 | -- | Success |
| 40001 | 400 | BAD_REQUEST | Bad request |
| 40002 | 400 | METHOD_NOT_FOUND | Method not found |
| 40003 | 400 | INVALID_REQUEST | Invalid request |
| 40004 | 400 | MISSING_OR_INVALID_ARGUMENT | Required argument is blank or missing |
| 40101 | 401 | UNAUTHORIZED | Not authenticated, or key/signature incorrect |
| 40102 | 400 | INVALID_NONCE | Nonce value differs by more than 60 seconds |
| 40103 | 401 | IP_ILLEGAL | IP address not whitelisted |
| 42901 | 429 | TOO_MANY_REQUESTS | Requests have exceeded rate limits |

### Trading Error Codes

| Code | HTTP | Message Code | Description |
|------|------|--------------|-------------|
| 204 | 400 | DUPLICATE_CLORDID | Duplicate client order id |
| 208 | 400 | INSTRUMENT_NOT_TRADABLE | Instrument is not tradable |
| 209 | 400 | INVALID_INSTRUMENT | Instrument is invalid |
| 213 | 400 | INVALID_ORDERQTY | Invalid order quantity |
| 218 | 400 | INVALID_ORDTYPE | Invalid order type |
| 220 | 400 | INVALID_SIDE | Invalid side |
| 221 | 400 | INVALID_TIF | Invalid time_in_force |
| 224 | 400 | REJ_BY_MATCHING_ENGINE | Rejected by matching engine |
| 229 | 400 | INVALID_REF_PRICE | Invalid ref price |
| 306 | 500 | INSUFFICIENT_AVAILABLE_BALANCE | Insufficient available balance |
| 308 | 400 | INVALID_PRICE | Invalid price |
| 314 | 400 | EXCEEDS_MAX_ORDER_SIZE | Exceeds max order size |
| 318 | 400 | EXCEEDS_MAX_ALLOWED_ORDERS | Exceeds max allowed orders |
| 315 | 400 | FAR_AWAY_LIMIT_PRICE | Limit price too far from current market price |
| 415 | 500 | BELOW_MIN_ORDER_SIZE | Below min order size |
| 416 | 400 | USER_NO_MARGIN_ACCESS | Account does not have margin access |
| 5000811 | 400 | WITHDRAW_ADDRESS_NOT_IN_WHITE_LIST | Withdrawal address not whitelisted in account settings |
| 40401 | 404 | NOT_FOUND | Order/resource not found |
| 43003 | 400 | FILL_OR_KILL | FOK order could not be fully filled (rejected) |
| 43004 | 400 | IMMEDIATE_OR_CANCEL | IOC order could not be filled (rejected) |
| 43005 | 400 | POST_ONLY_REJ | POST_ONLY order would have matched (rejected). Also returned for POST_ONLY on MARKET orders |
| 140001 | 400 | API_DISABLED | Feature disabled for this endpoint (e.g., OCO on `create-order-list` instead of `advanced/create-oco`) |

### Advanced Order Error Codes

| Code | Message Code | Description |
|------|--------------|-------------|
| 50002 | INVALID_PRICE | Price too far from market or invalid for order type |
| 50007 | INVALID_TRIGGER_PRICE | Trigger/ref_price direction is wrong relative to market price |
| 50010 | INVALID_ORDER_PARAMETERS | Invalid order configuration (e.g., OTO/OTOCO with same-side orders) |

### Tips

* **Must be strings**: `price`, `quantity`, `notional`, `ref_price`, `amount`, `new_price`, `new_quantity` (e.g., `"0.001"` not `0.001`)
* **Must be numbers**: `limit`, `end_time` on `user-balance-history` (e.g., `100` not `"100"`). Sending `limit` as string returns error 40003
* **Accept both**: `page`, `page_size`, `count`, `depth`, `start_time`, `end_time` (trading history), `start_ts`, `end_ts`
* Use UAT Sandbox for development: `https://uat-api.3ona.co/exchange/v1/`
* UAT Sandbox credentials are separate from production
* Add a 1-second delay after WebSocket connection before sending requests
* Verify server time if nonce errors occur
* Enable only required API permissions (no withdrawal access for trading-only keys)
* Use IP whitelist in Crypto.com Exchange API settings

## Security Notes

* Never share your secret key
* Use IP whitelist in API settings
* Enable only required permissions (spot trading, no withdrawals)
* Use UAT Sandbox for development and testing
* Sandbox credentials are separate from production
