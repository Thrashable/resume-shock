// Pure pattern detection functions. Each takes a Position (and optional context)
// and returns true/false. Composed in detectPatterns().

const HOUR = 60 * 60 * 1000

// ----- Red flags -----

export function isTopblasting(p) {
  return p.token.age_at_entry_ms < 24 * HOUR && p.entry.marketcap > 1_000_000
}

export function isOversizing(p) {
  return p.position_size_pct > 25
}

export function isBagHolding(p) {
  if (!p.still_holding) return false
  if (p.exits.length > 0) return false
  if (p.hold_duration_ms < 48 * HOUR) return false
  const cur = p.current_price ?? p.peak_price_during_hold
  const drawdown = (cur - p.entry.price) / p.entry.price
  return drawdown <= -0.7
}

export function isPaperHands(p) {
  // Held through 5x+ then gave it all back
  if (!p.peak_price_during_hold) return false
  const peakX = p.peak_price_during_hold / p.entry.price
  if (peakX < 5) return false
  const realizedAvgExit = avgExitPrice(p)
  if (realizedAvgExit == null) return false
  return realizedAvgExit < p.entry.price * 1.2
}

export function isFomoWick(p) {
  // Tagged at parse time when we have candle context. Default false otherwise.
  return !!p._fomoWick
}

export function isPanicDump(p) {
  if (p.exits.length === 0) return false
  if (p.realized_pnl_sol >= 0) return false
  const firstExit = p.exits[0]
  return (firstExit.timestamp - p.entry.timestamp) < 10 * 60 * 1000
}

export function isChasingExits(p) {
  return !!p._chasedRebuy
}

// Revenge sizing & FOMO wick are detected at the ledger level.

// ----- Green flags -----

export function isScaledOut(p) {
  return p.exits.length >= 2
}

export function isSaneRisk(p) {
  return p.position_size_pct < 10
}

export function isCutLoser(p) {
  if (p.exits.length === 0) return false
  if (p.realized_pnl_sol >= 0) return false
  const avgExit = avgExitPrice(p)
  if (avgExit == null) return false
  const drawdown = (avgExit - p.entry.price) / p.entry.price
  return drawdown >= -0.2
}

export function isEarlySniper(p) {
  return p.entry.marketcap < 200_000
}

export function isRealizedGain(p) {
  return p.realized_pnl_sol > 0
}

// ----- Helpers -----

function avgExitPrice(p) {
  if (p.exits.length === 0) return null
  const totalSol = p.exits.reduce((s, e) => s + e.sol_received, 0)
  // weighted by sol_received per exit price
  const weightedNum = p.exits.reduce((s, e) => s + e.sol_received * e.price, 0)
  return totalSol > 0 ? weightedNum / totalSol : null
}

// ----- Compose -----

export function detectPatterns(position) {
  const red = []
  const green = []
  if (isTopblasting(position))    red.push('topblasting')
  if (isOversizing(position))     red.push('oversizing')
  if (isBagHolding(position))     red.push('bag_holding')
  if (isPaperHands(position))     red.push('paper_hands')
  if (isFomoWick(position))       red.push('fomo_wick')
  if (isPanicDump(position))      red.push('panic_dumping')
  if (isChasingExits(position))   red.push('chasing_exits')

  if (isScaledOut(position))      green.push('scaled_out')
  if (isSaneRisk(position))       green.push('sane_size')
  if (isCutLoser(position))       green.push('cut_losers')
  if (isEarlySniper(position))    green.push('early_sniper')
  if (isRealizedGain(position))   green.push('realized_gains')

  return { red, green }
}

// Ledger-level analysis: revenge sizing, spread-across-plays.
export function annotateLedger(positions) {
  const sorted = [...positions].sort((a, b) => a.entry.timestamp - b.entry.timestamp)
  const flags = {}
  let lastLossSize = null

  for (const p of sorted) {
    const f = detectPatterns(p)
    // revenge sizing: previous trade was a realized loss, this trade size went up
    if (lastLossSize != null && p.entry.sol_spent > lastLossSize * 1.5) {
      f.red.push('revenge_sizing')
    }
    if (p.realized_pnl_sol < 0 && !p.still_holding) {
      lastLossSize = p.entry.sol_spent
    } else if (p.realized_pnl_sol > 0) {
      lastLossSize = null
    }
    flags[p.id] = f
  }

  // spread-across-plays: 5+ different tokens
  if (sorted.length >= 5) {
    for (const p of sorted) {
      if (p.position_size_pct < 15) flags[p.id].green.push('spread')
    }
  }

  return flags
}

// ----- Display labels for flags -----

export const FLAG_LABEL = {
  topblasting:    'Topblasting',
  oversizing:     'Oversizing',
  bag_holding:    'Bag holding',
  paper_hands:    'Hands of paper mache',
  fomo_wick:      'FOMO wick-buy',
  revenge_sizing: 'Revenge sizing',
  panic_dumping:  'Panic dumping',
  chasing_exits:  'Chasing exits',
  scaled_out:     'Scaled out',
  sane_size:      'Sane risk',
  cut_losers:     'Cut the loser',
  early_sniper:   'Early sniper',
  realized_gains: 'Realized gains',
  spread:         'Spread plays',
}
