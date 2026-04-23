// Base58 alphabet (Solana addresses are base58, 32–44 chars)
const BASE58_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

export function isValidSolanaAddress(addr) {
  if (!addr || typeof addr !== 'string') return false
  return BASE58_RE.test(addr.trim())
}

export function shortAddr(addr, head = 4, tail = 4) {
  if (!addr) return ''
  if (addr.length <= head + tail + 1) return addr
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`
}

export function fmtSol(n, digits = 3) {
  if (n == null || isNaN(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1000) return `${n.toFixed(0)} SOL`
  if (abs >= 1)    return `${n.toFixed(2)} SOL`
  return `${n.toFixed(digits)} SOL`
}

export function fmtUsd(n) {
  if (n == null || isNaN(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000)     return `$${(n / 1_000).toFixed(1)}k`
  if (abs >= 1)         return `$${n.toFixed(2)}`
  if (abs >= 0.01)      return `$${n.toFixed(4)}`
  return `$${n.toExponential(2)}`
}

export function fmtPct(n, digits = 0) {
  if (n == null || isNaN(n)) return '—'
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(digits)}%`
}

export function fmtDuration(ms) {
  if (ms == null || isNaN(ms)) return '—'
  const m = Math.floor(ms / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d ${h % 24}h`
  if (h > 0) return `${h}h ${m % 60}m`
  if (m > 0) return `${m}m`
  return `${Math.floor(ms / 1000)}s`
}

export function fmtAge(ms) {
  if (ms == null || isNaN(ms)) return '—'
  const m = Math.floor(ms / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d old`
  if (h > 0) return `${h}h old`
  if (m > 0) return `${m}m old`
  return `fresh`
}
