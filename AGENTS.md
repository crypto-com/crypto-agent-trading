# Crypto Agent Trading — Agent Instructions

This file provides guidance to AI assistants when working with this repository.

## Project Overview

This is a collection of skills for crypto trading and exchange operations using the Crypto.com API. The project provides skills for trading, account management, and market data queries across fiat and crypto wallets.

## Architecture

- **crypto-com-app/** — Crypto.com App trading skill (SKILL.md with YAML frontmatter + script references)
- **crypto-com-exchange/** — Crypto.com Exchange trading skill (SKILL.md with references)

## Skill Discovery

Each skill contains a `SKILL.md` with:

- YAML frontmatter (name, description, metadata)
- Script command references with parameters
- Usage examples
- Error handling

## Available Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| crypto-com-app | Trading and market data | User wants to buy/sell/swap crypto, check balances, view trades through crypto.com App |
| crypto-com-exchange | Trading and market data | User wants to buy/sell/swap crypto, check prices, coin discovery through crypto.com Exchange |

## Environment Setup

- Set `CDC_API_KEY` and `CDC_API_SECRET` as environment variables for crypto-com-app API authentication.
- For production, use personal API keys; avoid shared keys for security.
- Each skill may have specific command references in their SKILL.md files.