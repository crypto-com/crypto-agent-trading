# crypto-agent-trading

An agent skill for trading cryptocurrency via the Crypto.com API. Works with OpenClaw, other SKILL.md-compatible agent platforms.

## Features

- **Trade**: Market buy, sell, swap, and exchange across 200+ tokens (BTC, ETH, CRO, and more)
- **Balances**: Query fiat and crypto portfolio holdings
- **Prices**: Discover coins and check market prices
- **History**: View recent transaction history
- **Trading Limits**: Check weekly trading budget usage
- **Kill Switch**: Emergency API key revocation

## Quickstart

### 1. Set environment variables

First, generate an API key following the [API Key Management](https://help.crypto.com/en/articles/13843786-api-key-management) guide. Then export the key and secret in your terminal:

```bash
export CDC_API_KEY="your-api-key"
export CDC_API_SECRET="your-api-secret"
```

### 2. Install the skill

copy manually:

```bash
cp -r crypto-agent-trading ~/.openclaw/skills/
```

- **OpenClaw** — say "Initialize the crypto-agent-trading skill" in any OpenClaw client (TUI, web, or API).
- **Other agents** — point your agent at the installed `SKILL.md`.

## Example Conversation

```
User: "Buy CRO with 100 USD"
Agent: (runs quote) "Confirm: buy 1,250 CRO for 100 USD? This quote expires in 15 seconds."
User: "Yes"
Agent: (runs confirm) "Done! Purchased 1,250 CRO for 100 USD."
```

```
User: "What's my balance?"
Agent: (runs balance check) "You hold 1,250 CRO ($105.00) and 400.00 USD."
```

```
User: "Swap 500 CRO to BTC"
Agent: (runs quote) "Confirm: swap 500 CRO for 0.00045 BTC? Expires in 15 seconds."
User: "No, make it 200 CRO instead"
Agent: (runs new quote) "Confirm: swap 200 CRO for 0.00018 BTC? Expires in 15 seconds."
User: "Confirm"
Agent: (runs confirm) "Done! Swapped 200 CRO for 0.00018 BTC."
```

## File Structure

```
crypto-agent-trading/
├── _meta.json          # OpenClaw package metadata
├── SKILL.md            # Core skill: configs, commands, business logic
├── README.md           # This file
├── CHANGELOG.md        # Version history
├── references/
│   └── errors.md       # Detailed error scenarios + recovery
└── scripts/
    ├── lib/
    │   ├── api.ts      # HTTP client, HMAC signing
    │   └── output.ts   # Structured output + error codes
    ├── account.ts      # Balances, trading limit, kill switch
    ├── trade.ts        # Quotations, orders, history
    └── coins.ts        # Coin discovery
```

## Prerequisites

- Node.js 18+ (for `npx tsx` and built-in `fetch`)
- A Crypto.com account with API key and secret

## Security

- **No withdrawal permissions** -- the API key can only trade; it cannot withdraw funds from your account
- **Weekly trading limit** -- a configurable cap on total trading volume acts as a financial guardrail against runaway spending
- **HMAC-SHA256 signing** -- all requests are signed to prevent tampering and replay attacks
- **Environment-only credentials** -- API keys are read from environment variables only and never stored in files
- **Kill switch** -- instantly revoke API access in emergencies to stop all further trading

## FAQ & Resources

- [OpenClaw Integration with Agent Key](https://help.crypto.com/en/collections/18662855-openclaw-integration-with-agent-key)
- [OpenClaw Trading Overview](https://help.crypto.com/en/articles/13843765-openclaw-trading-overview)
- [Getting Started](https://help.crypto.com/en/articles/13843782-getting-started)
- [API Key Management](https://help.crypto.com/en/articles/13843786-api-key-management)
- [Trading with OpenClaw](https://help.crypto.com/en/articles/13843788-trading-with-openclaw)
- [Weekly Trading Limit](https://help.crypto.com/en/articles/13843797-weekly-trading-limit)
- [Safety and Security](https://help.crypto.com/en/articles/13843804-safety-and-security)
- [Notifications](https://help.crypto.com/en/articles/13843811-notifications)

## License

Apache License 2.0
