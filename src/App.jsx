import { useState, useCallback } from 'react'
import Landing from './components/Landing'
import Notebook from './components/Notebook'
import { loadWalletData } from './utils/loadWallet'
import { getHeliusKey } from './utils/storage'
import { getMockData } from './data/mockTrades'
import { Squiggle, PencilCursor } from './components/decorations/Doodles'

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [fromMock, setFromMock] = useState(false)

  const handleSubmit = useCallback(async (wallet) => {
    setError('')
    setLoading(true)
    setFromMock(false)
    try {
      const heliusKey = getHeliusKey()
      const result = await loadWalletData(wallet, heliusKey, { onProgress: setProgress })
      if (result.positions.length === 0) {
        setError("found 0 memecoin trades on this wallet. try another wallet — or hit 'just show me a demo'.")
      } else {
        setData(result)
      }
    } catch (err) {
      setError(err.message || 'something broke')
    } finally {
      setLoading(false)
      setProgress('')
    }
  }, [])

  const handleDemo = useCallback(() => {
    setFromMock(true)
    setData(getMockData())
  }, [])

  const handleReset = useCallback(() => {
    setData(null)
    setError('')
    setFromMock(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="relative">
          <div className="absolute -left-12 -top-2 wobble">
            <PencilCursor className="w-14 h-14" />
          </div>
          <h2 className="hand-title text-[48px] ink-graphite">writing your journal…</h2>
        </div>
        <div className="w-72 mt-3"><Squiggle className="w-full h-3 ink-blue" /></div>
        <p className="hand-write ink-pencil text-[18px] italic mt-6">{progress || 'thinking…'}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <>
        <Landing onSubmit={handleSubmit} onDemo={handleDemo} />
        {error && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-[480px] px-4 py-3 rotate-[-0.5deg]"
               style={{ background: 'rgba(194, 59, 34, 0.10)' }}>
            <p className="hand-write ink-red text-[16px] italic">! {error}</p>
            <button onClick={() => setError('')} className="ml-2 print-hand ink-pencil text-[13px] underline">dismiss</button>
          </div>
        )}
      </>
    )
  }

  return <Notebook data={data} onReset={handleReset} fromMock={fromMock} />
}
