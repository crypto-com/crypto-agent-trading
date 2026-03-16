# Installing Crypto Agent Trading Skills for Codex

Enable crypto skills in Codex CLI via native skill discovery. Just clone, symlink.

## Prerequisites

- Git
- Crypto.com API credentials (see Setup section below)

## Setup

### 1. Get Crypto.com API Credentials

**For crypto-com-app skill:**
- Visit [Crypto.com API Key Management](https://help.crypto.com/en/articles/13843786-api-key-management)
- Generate an API key for the Crypto.com App
- Set as environment variables:
  ```bash
  export CDC_API_KEY="your-crypto-com-app-api-key"
  export CDC_API_SECRET="your-crypto-com-app-api-secret"
  ```

**For crypto-com-exchange skill:**
- Visit [Crypto.com Exchange API](https://exchange.crypto.com/)
- Create API credentials for the Exchange
- Note: Credentials are provided when using the skill

### 2. Install Skills

1. **Clone the repository:**

   ```bash
   git clone https://github.com/crypto-com/crypto-agent-trading ~/.codex/crypto-agent-trading
   ```

2. **Create the skills symlink:**

   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/crypto-agent-trading/crypto-com-app ~/.agents/skills/crypto-com-app
   ln -s ~/.codex/crypto-agent-trading/crypto-com-exchange ~/.agents/skills/crypto-com-exchange
   ```

   **Windows (PowerShell):**

   ```powershell
   New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
   cmd /c mklink /J "$env:USERPROFILE\.agents\skills\crypto-com-app" "$env:USERPROFILE\.codex\crypto-agent-trading\crypto-com-app"
   cmd /c mklink /J "$env:USERPROFILE\.agents\skills\crypto-com-exchange" "$env:USERPROFILE\.codex\crypto-agent-trading\crypto-com-exchange"
   ```

3. **Restart Codex** (quit and relaunch the CLI) to discover the skills.

## Verify

```bash
ls -la ~/.agents/skills/crypto-com-app
ls -la ~/.agents/skills/crypto-com-exchange
```

You should see the skill directories.

## Available Skills

| Skill | When to Use | Authentication |
|-------|-------------|----------------|
| `crypto-com-app` | Execute trading, check balances, token prices via Crypto.com App | Environment variables (`CDC_API_KEY`, `CDC_API_SECRET`) |
| `crypto-com-exchange` | Execute trading, check balances, token prices via Crypto.com Exchange | API credentials provided when using skill |

## Updating

```bash
cd ~/.codex/crypto-agent-trading && git pull
```

Skills update instantly through the symlink.