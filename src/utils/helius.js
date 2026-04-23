// Helius Enhanced Transactions API — easier than parsing raw RPC.
// Docs: https://docs.helius.dev/api-reference/enhanced-transactions

const SOL_MINT = 'So11111111111111111111111111111111111111112'

const KNOWN_DEX_SOURCES = new Set([
  'JUPITER', 'RAYDIUM', 'PUMP_FUN', 'PUMPFUN', 'METEORA', 'ORCA', 'PHOENIX', 'LIFINITY',
])

function heliusUrl(wallet, apiKey, before) {
  const u = new URL(`https://api.helius.xyz/v0/addresses/${wallet}/transactions`)
  u.searchParams.set('api-key', apiKey)
  u.searchParams.set('limit', '100')
  if (before) u.searchParams.set('before', before)
  return u.toString()
}

export async function fetchHeliusTransactions(wallet, apiKey, { maxPages = 5 } = {}) {
  let all = []
  let before = null
  for (let i = 0; i < maxPages; i++) {
    const res = await fetch(heliusUrl(wallet, apiKey, before))
    if (!res.ok) {
      throw new Error(`Helius error ${res.status}: ${await res.text()}`)
    }
    const txs = await res.json()
    if (!Array.isArray(txs) || txs.length === 0) break
    all = all.concat(txs)
    before = txs[txs.length - 1].signature
    if (txs.length < 100) break
  }
  return all
}

// Parse Helius transactions into raw "swap" events: { mint, sol_delta, token_delta, ts, sig }
// Positive sol_delta = wallet RECEIVED sol (sold token). Negative = wallet SPENT sol (bought token).
export function parseSwapsFromTransactions(txs, wallet) {
  const swaps = []
  for (const tx of txs) {
    if (tx.transactionError) continue
    const source = (tx.source || '').toUpperCase()
    const isSwap = tx.type === 'SWAP' || KNOWN_DEX_SOURCES.has(source) || source.includes('PUMP')
    if (!isSwap) continue

    // Sum SOL deltas for this wallet from native + nativeTransfers
    let solDelta = 0
    if (Array.isArray(tx.nativeTransfers)) {
      for (const n of tx.nativeTransfers) {
        const lamports = n.amount || 0
        if (n.toUserAccount === wallet) solDelta += lamports / 1e9
        if (n.fromUserAccount === wallet) solDelta -= lamports / 1e9
      }
    }
    // also consider account fee paid (rough)
    // Sum token deltas from tokenTransfers — group by mint
    const tokenDeltaByMint = {}
    if (Array.isArray(tx.tokenTransfers)) {
      for (const t of tx.tokenTransfers) {
        const mint = t.mint
        if (!mint || mint === SOL_MINT) continue
        const amt = t.tokenAmount || 0
        if (t.toUserAccount === wallet)   tokenDeltaByMint[mint] = (tokenDeltaByMint[mint] || 0) + amt
        if (t.fromUserAccount === wallet) tokenDeltaByMint[mint] = (tokenDeltaByMint[mint] || 0) - amt
      }
    }

    for (const [mint, tokenDelta] of Object.entries(tokenDeltaByMint)) {
      if (Math.abs(tokenDelta) < 1e-9) continue
      // Only count SOL paired swaps. (Swaps via USDC won't have a SOL delta and will be skipped.)
      if (Math.abs(solDelta) < 1e-6) continue
      swaps.push({
        mint,
        sol_delta: solDelta,    // negative = bought, positive = sold
        token_delta: tokenDelta,
        timestamp: (tx.timestamp || 0) * 1000,
        signature: tx.signature,
        source,
      })
      // After attributing, zero the SOL delta so we don't double-count multi-hop swaps in one tx
      solDelta = 0
    }
  }
  return swaps
}
