// Reconstruct Position objects from per-mint swap events.

export function buildPositions(swaps, tokenInfoByMint = {}) {
  // Group swaps by mint
  const byMint = {}
  for (const s of swaps) {
    if (!byMint[s.mint]) byMint[s.mint] = []
    byMint[s.mint].push(s)
  }

  const positions = []
  for (const [mint, list] of Object.entries(byMint)) {
    list.sort((a, b) => a.timestamp - b.timestamp)
    const buys  = list.filter(s => s.sol_delta < 0 && s.token_delta > 0)
    const sells = list.filter(s => s.sol_delta > 0 && s.token_delta < 0)
    if (buys.length === 0) continue

    const totalSolSpent  = buys.reduce((sum, b) => sum + Math.abs(b.sol_delta), 0)
    const totalTokenIn   = buys.reduce((sum, b) => sum + b.token_delta, 0)
    const avgEntryPrice  = totalTokenIn > 0 ? totalSolSpent / totalTokenIn : 0

    const totalSolRecv   = sells.reduce((sum, s) => sum + s.sol_delta, 0)
    const totalTokenOut  = sells.reduce((sum, s) => sum + Math.abs(s.token_delta), 0)
    const stillHoldingAmount = Math.max(0, totalTokenIn - totalTokenOut)
    const stillHolding   = stillHoldingAmount > totalTokenIn * 0.02 // > 2% of bag remains

    const realized = totalSolRecv - totalSolSpent * (totalTokenOut / totalTokenIn || 0)

    const info = tokenInfoByMint[mint] || {}
    const currentPrice = info.priceUsd && info.solUsd ? info.priceUsd / info.solUsd : null
    const unrealized = stillHolding && currentPrice
      ? stillHoldingAmount * currentPrice - totalSolSpent * (1 - totalTokenOut / totalTokenIn)
      : 0

    const firstBuy = buys[0]
    const lastEvent = list[list.length - 1]

    positions.push({
      id: `${mint}-${firstBuy.timestamp}`,
      token: {
        symbol: info.symbol || mint.slice(0, 6),
        name:   info.name   || 'unknown token',
        mint,
        age_at_entry_ms: info.pairCreatedAt ? (firstBuy.timestamp - info.pairCreatedAt) : null,
      },
      entry: {
        price: avgEntryPrice,
        marketcap: info.marketcap || null,
        sol_spent: totalSolSpent,
        timestamp: firstBuy.timestamp,
      },
      exits: sells.map(s => ({
        price: Math.abs(s.token_delta) > 0 ? s.sol_delta / Math.abs(s.token_delta) : 0,
        marketcap: null,
        sol_received: s.sol_delta,
        timestamp: s.timestamp,
      })),
      peak_price_during_hold: avgEntryPrice, // best-effort placeholder; real impl would need candles
      realized_pnl_sol: realized,
      unrealized_pnl_sol: unrealized,
      still_holding: stillHolding,
      position_size_pct: 0, // filled in below
      hold_duration_ms: lastEvent.timestamp - firstBuy.timestamp,
      current_price: currentPrice,
    })
  }

  // Compute position_size_pct: spent SOL / total SOL spent in window at time of entry
  const sortedByEntry = [...positions].sort((a, b) => a.entry.timestamp - b.entry.timestamp)
  let runningSpent = 0
  for (const p of sortedByEntry) {
    runningSpent += p.entry.sol_spent
    p.position_size_pct = runningSpent > 0 ? (p.entry.sol_spent / runningSpent) * 100 : 0
  }

  return positions.sort((a, b) => b.entry.timestamp - a.entry.timestamp)
}
