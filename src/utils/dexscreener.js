// DexScreener — public, no API key. Used to enrich token metadata + current price.
// Docs: https://docs.dexscreener.com/api/reference

const BASE = 'https://api.dexscreener.com/latest/dex'

export async function getTokenInfo(mint) {
  try {
    const res = await fetch(`${BASE}/tokens/${mint}`)
    if (!res.ok) return null
    const json = await res.json()
    const pairs = (json.pairs || []).filter(p => p.chainId === 'solana')
    if (!pairs.length) return null
    // pick highest-liquidity pair
    pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
    const top = pairs[0]
    return {
      symbol: top.baseToken?.symbol,
      name:   top.baseToken?.name,
      mint,
      priceUsd: parseFloat(top.priceUsd) || null,
      marketcap: top.marketCap || top.fdv || null,
      pairCreatedAt: top.pairCreatedAt || null,
      liquidityUsd: top.liquidity?.usd || 0,
      dex: top.dexId,
      url: top.url,
    }
  } catch {
    return null
  }
}

export async function batchTokenInfo(mints) {
  // DexScreener supports comma-separated up to 30 mints per call
  const out = {}
  const chunks = []
  for (let i = 0; i < mints.length; i += 25) chunks.push(mints.slice(i, i + 25))
  for (const chunk of chunks) {
    try {
      const res = await fetch(`${BASE}/tokens/${chunk.join(',')}`)
      if (!res.ok) continue
      const json = await res.json()
      const byMint = {}
      for (const p of (json.pairs || [])) {
        if (p.chainId !== 'solana') continue
        const m = p.baseToken?.address
        if (!m) continue
        if (!byMint[m] || (p.liquidity?.usd || 0) > (byMint[m].liquidity?.usd || 0)) byMint[m] = p
      }
      for (const m of chunk) {
        const top = byMint[m]
        if (!top) { out[m] = null; continue }
        out[m] = {
          symbol: top.baseToken?.symbol,
          name:   top.baseToken?.name,
          mint:   m,
          priceUsd: parseFloat(top.priceUsd) || null,
          marketcap: top.marketCap || top.fdv || null,
          pairCreatedAt: top.pairCreatedAt || null,
          liquidityUsd: top.liquidity?.usd || 0,
          dex: top.dexId,
        }
      }
    } catch {}
  }
  return out
}
