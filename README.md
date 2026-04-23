# degen diary

Paste a Solana wallet → get a brutally honest journal of every memecoin trade
that wallet has made. Each trade gets reconstructed, analyzed for behavioral
patterns, and written up in first person — as if you sat down at 3am after
your bags hit zero and tried to be honest with yourself.

No login. No backend. No data leaves your browser.

## What it does

- Pulls every SPL token swap from your wallet via Helius
- Reconstructs each position (entry, exits, peak, P&L, hold time, size %)
- Detects red flags (topblasting, oversizing, bag-holding, paper hands,
  panic dumps, revenge sizing, FOMO wicks) and green flags (scaled exits,
  sane sizing, early sniping, cut losers, realized gains)
- Generates a 2-4 sentence journal entry per trade via the Anthropic API
- Renders it all as a hand-written notebook: cream paper, washi tape,
  rubber stamps, margin doodles, wobbly circles around the P&L

## Tabs

- **today** — most recent trades, freshly written
- **the ledger** — every trade, chronological
- **patterns noticed** — flag tallies and stats
- **hall of fame** — your top 5 wins, gold pen
- **hall of shame** — your top 5 losses, red pen, lessons in the margin
- **health check** — behavior score, exposure, prescription

## Run

```bash
npm install
npm run dev
```

Visit http://localhost:5173. Hit "just show me a demo with fake trades" to
see it without keys.

## Keys

- **Helius** — get a free key at [helius.dev](https://helius.dev). Required
  for live wallets.
- **Anthropic** — get a key at [console.anthropic.com](https://console.anthropic.com).
  Optional. Without it the demo uses canned commentary.

Both keys live in `localStorage`. They never leave your browser.

## Stack

- React + Vite + Tailwind v4
- Helius Enhanced Transactions API
- DexScreener public API
- Anthropic Messages API (`claude-sonnet-4-5`)
- Deployed to Netlify

## License

MIT
