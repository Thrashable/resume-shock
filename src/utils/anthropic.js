// Calls the Anthropic Messages API directly from the browser. The user supplies
// their own key (stored in localStorage). Use the latest Claude Sonnet.

import { FLAG_LABEL } from './patterns'

const MODEL = 'claude-sonnet-4-5-20250929'
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

const SYSTEM = `You are writing a short trading journal entry as if you ARE the trader.
22-year-old Solana memecoin degen with self-awareness.
Use slang naturally: aped, rekt, printed, bagholder, diamond hands, paper hands,
topblasted, rugged, farmed, sniped, bundled.
2 to 4 sentences. Be blunt about mistakes but not mean. Celebrate wins genuinely.
Lowercase. No quotes around the entry. No preamble. Just the entry itself.`

function buildPrompt(position, flags) {
  const compact = {
    token: position.token.symbol,
    age_at_entry: position.token.age_at_entry_ms,
    entry_marketcap: position.entry.marketcap,
    sol_spent: round(position.entry.sol_spent, 3),
    position_size_pct: round(position.position_size_pct, 1),
    realized_pnl_sol: round(position.realized_pnl_sol, 3),
    unrealized_pnl_sol: round(position.unrealized_pnl_sol, 3),
    still_holding: position.still_holding,
    exit_count: position.exits.length,
    peak_x: position.peak_price_during_hold && position.entry.price
      ? round(position.peak_price_during_hold / position.entry.price, 2)
      : null,
    hold_hours: round((position.hold_duration_ms || 0) / 3.6e6, 1),
  }
  const redLabels = (flags.red || []).map(f => FLAG_LABEL[f] || f)
  const greenLabels = (flags.green || []).map(f => FLAG_LABEL[f] || f)
  return `Trade data:\n${JSON.stringify(compact)}\n\nRed flags: ${redLabels.join(', ') || 'none'}\nGreen flags: ${greenLabels.join(', ') || 'none'}\n\nWrite the entry.`
}

function round(n, d) {
  if (n == null || isNaN(n)) return null
  const m = Math.pow(10, d)
  return Math.round(n * m) / m
}

export async function generateEntry({ apiKey, position, flags }) {
  if (!apiKey) throw new Error('No Anthropic API key')
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      system: SYSTEM,
      messages: [{ role: 'user', content: buildPrompt(position, flags) }],
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Anthropic ${res.status}: ${t.slice(0, 200)}`)
  }
  const json = await res.json()
  const text = json.content?.[0]?.text || ''
  return text.trim()
}
