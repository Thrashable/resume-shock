import LZString from 'lz-string'

export function compressData(data) {
  const json = JSON.stringify(data)
  return LZString.compressToEncodedURIComponent(json)
}

export function decompressData(compressed) {
  try {
    const json = LZString.decompressFromEncodedURIComponent(compressed)
    if (!json) return null
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function generateShareURL(data) {
  const compressed = compressData(data)
  return `${window.location.origin}/view#${compressed}`
}

export function getCompressedSize(data) {
  const compressed = compressData(data)
  return new Blob([compressed]).size
}
