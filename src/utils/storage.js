// localStorage wrappers with TTL, namespaced per wallet.

const PREFIX = 'dd:'
const TTL_MS = 10 * 60 * 1000 // 10 min cache for trade data

export function getKey(name) { return `${PREFIX}${name}` }

export function readJson(key) {
  try {
    const raw = localStorage.getItem(getKey(key))
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(getKey(key), JSON.stringify(value))
  } catch {}
}

export function remove(key) {
  try { localStorage.removeItem(getKey(key)) } catch {}
}

// API keys
export const getHeliusKey    = () => readJson('helius_key')    || ''
export const setHeliusKey    = (k) => writeJson('helius_key', k)
export const getAnthropicKey = () => readJson('anthropic_key') || ''
export const setAnthropicKey = (k) => writeJson('anthropic_key', k)

// Wallet trade cache
export function getWalletCache(wallet) {
  const entry = readJson(`wallet:${wallet}`)
  if (!entry) return null
  if (Date.now() - entry.cachedAt > TTL_MS) return null
  return entry.data
}
export function setWalletCache(wallet, data) {
  writeJson(`wallet:${wallet}`, { cachedAt: Date.now(), data })
}

// Per-trade journal entry cache (keyed by wallet+mint+entryTs)
export function getJournalEntry(walletKey, tradeKey) {
  return readJson(`journal:${walletKey}:${tradeKey}`)
}
export function setJournalEntry(walletKey, tradeKey, text) {
  writeJson(`journal:${walletKey}:${tradeKey}`, text)
}
