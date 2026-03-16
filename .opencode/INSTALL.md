# Installing Crypto Agent Trading Skills for OpenCode

## Prerequisites

- Git
- Crypto.com API credentials (see Setup section below)

## Setup

### 1. Get Crypto.com API Credentials

**For crypto-com-app skill:**
- Visit [Crypto.com API Key Management](https://help.crypto.com/en/articles/13843786-api-key-management)
- Generate an API key for the Crypto.com App

**For crypto-com-exchange skill:**
- Visit [Crypto.com Exchange API](https://exchange.crypto.com/)
- Create API credentials for the Exchange

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/crypto-com/crypto-agent-trading ~/.config/opencode/crypto-agent-trading
```

### 2. Register the Plugin

Add the plugin to your OpenCode configuration:

```bash
# Edit ~/.config/opencode/config.json and add:
{
  "plugins": [
    "~/.config/opencode/crypto-agent-trading/.opencode/plugins/crypto-agent-trading.js"
  ]
}
```

### 3. Set Environment Variables (crypto-com-app only)

For the crypto-com-app skill, set your API credentials as environment variables:

```bash
export CDC_API_KEY="your-crypto-com-app-api-key"
export CDC_API_SECRET="your-crypto-com-app-api-secret"
```

Add these to your shell profile (e.g., `~/.bashrc` or `~/.zshrc`) for persistence.

### 4. Symlink Skills

```bash
mkdir -p ~/.config/opencode/skills
ln -s ~/.config/opencode/crypto-agent-trading/crypto-com-app ~/.config/opencode/skills/crypto-com-app
ln -s ~/.config/opencode/crypto-agent-trading/crypto-com-exchange ~/.config/opencode/skills/crypto-com-exchange
```

### 5. Restart OpenCode

Restart OpenCode. The plugin will automatically inject skill context.

Verify by asking: `"check my crypto balance"` or `"what's the price of BTC?"`

## Usage

### Available Skills

| Skill | When to Use | Authentication |
|-------|-------------|----------------|
| `crypto-com-app` | Execute trading, check balances, token prices via Crypto.com App | Environment variables (`CDC_API_KEY`, `CDC_API_SECRET`) |
| `crypto-com-exchange` | Execute trading, check balances, token prices via Crypto.com Exchange | API credentials provided when using skill |

### Loading a Skill Manually

Use OpenCode's native `skill` tool:

```
use skill tool to load crypto-agent-trading/crypto-com-app
```

## Updating

```bash
cd ~/.config/opencode/crypto-agent-trading
git pull
```

## Troubleshooting

### Plugin not loading

1. Check plugin symlink: `ls -l ~/.config/opencode/plugins/crypto-agent-trading.js`
2. Check source exists: `ls ~/.config/opencode/crypto-agent-trading/.opencode/plugins/crypto-agent-trading.js`
3. Check OpenCode logs for errors

### Skills not found

1. Check skills symlink: `ls -l ~/.config/opencode/skills/crypto-com-app`
2. Verify it points to: `~/.config/opencode/crypto-agent-trading/crypto-com-app`
3. Use `skill` tool in OpenCode to list discovered skills

### Authentication errors

1. For crypto-com-app: Verify environment variables are set:
   ```bash
   echo "API Key: ${CDC_API_KEY:+set}"
   echo "API Secret: ${CDC_API_SECRET:+set}"
   ```
2. For crypto-com-exchange: Ensure you provide API credentials when prompted by the skill

## Getting Help

- Report issues: [GitHub Issues](https://github.com/crypto-com/crypto-agent-trading/issues)
- Crypto.com API Docs: [API Documentation](https://crypto.com)