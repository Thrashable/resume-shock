// Orchestrates the full pipeline: Helius transactions → swap parsing → token info
// → position reconstruction → pattern detection.

import { fetchHeliusTransactions, parseSwapsFromTransactions } from './helius'
import { batchTokenInfo } from './dexscreener'
import { buildPositions } from './positions'
import { annotateLedger } from './patterns'
import { getWalletCache, setWalletCache } from './storage'

export async function loadWalletData(wallet, heliusKey, { force = false, onProgress } = {}) {
  if (!force) {
    const cached = getWalletCache(wallet)
    if (cached) {
      onProgress?.('cached')
      return { ...cached, fromCache: true }
    }
  }

  onProgress?.('fetching transactions…')
  const txs = await fetchHeliusTransactions(wallet, heliusKey, { maxPages: 5 })

  onProgress?.(`parsing ${txs.length} transactions…`)
  const swaps = parseSwapsFromTransactions(txs, wallet)

  const mints = [...new Set(swaps.map(s => s.mint))]
  onProgress?.(`pulling token info for ${mints.length} tokens…`)
  const tokenInfo = await batchTokenInfo(mints)

  onProgress?.('reconstructing positions…')
  const positions = buildPositions(swaps, tokenInfo)
  const flags = annotateLedger(positions)

  const data = { wallet, positions, flags, fetchedAt: Date.now() }
  setWalletCache(wallet, data)
  return data
}
