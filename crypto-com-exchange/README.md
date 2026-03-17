# Crypto.com Exchange Spot Skill

AI agent skill for trading on Crypto.com Exchange Spot markets via REST API.

## What This Skill Does

Gives your AI agent the ability to:
- Place, amend, and cancel spot orders (LIMIT, MARKET)
- Create advanced orders (STOP_LOSS, STOP_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT)
- Manage OCO, OTO, and OTOCO order groups
- Query balances, positions, order history, and trade history
- Withdraw funds and check deposit/withdrawal status
- Read market data (tickers, order book, candlesticks, trades)

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill definition — 52 endpoints, parameters, edge cases, agent behavior |
| `references/authentication.md` | HMAC-SHA256 signing implementation (Python, JavaScript, Bash), error codes |
| `LICENSE.md` | MIT License |

## Setup

1. Install the skill files into your agent
2. Provide your Crypto.com Exchange API key and secret
3. The agent handles authentication, signing, and request formatting automatically

### Getting API Keys

1. Log in to [Crypto.com Exchange](https://crypto.com/exchange)
2. Go to **Settings → API Keys**
3. Create a new key with desired permissions (Spot Trading, Withdrawal, etc.)
4. Set IP whitelist for production use
5. Store the API key and secret securely

## Environments

| Environment | Base URL |
|-------------|----------|
| Production | `https://api.crypto.com/exchange/v1/` |
| UAT Sandbox | `https://uat-api.3ona.co/exchange/v1/` |

UAT Sandbox requires separate credentials (institutional access only).

## Coverage

- **52 endpoints** — public market data, private trading, advanced orders, wallet, account management
- **Production-tested** — every endpoint verified against live API with real orders
- **66 edge cases documented** — param types, pagination quirks, error codes, validation rules

## Key Things Your Agent Should Know

- Order params (`price`, `quantity`, `notional`, `ref_price`, `amount`) must be **strings**
- `limit` must be a **number** (not string)
- Instrument names are case-sensitive: `BTC_USD` not `btc_usd`
- Public endpoints = GET only, Private endpoints = POST only
- All private requests use JSON body with HMAC-SHA256 signature

See `SKILL.md` for the full reference.

## License

MIT
