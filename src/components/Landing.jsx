import { useState, useEffect, useRef } from 'react'
import { isValidSolanaAddress, shortAddr } from '../utils/solana'
import { getHeliusKey, setHeliusKey, getAnthropicKey, setAnthropicKey } from '../utils/storage'
import { MOCK_WALLET } from '../data/mockTrades'
import WashiTape from './decorations/WashiTape'
import StickyNote from './decorations/StickyNote'
import {
  ArrowDoodle, StarDoodle, Squiggle, Underline, CoffeeStain,
  WobblyCircle, SkullDoodle, Paperclip,
} from './decorations/Doodles'

export default function Landing({ onSubmit, onDemo }) {
  const [addr, setAddr] = useState('')
  const [heliusKey, setHelius] = useState(getHeliusKey())
  const [anthropicKey, setAnthropic] = useState(getAnthropicKey())
  const [showKeys, setShowKeys] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const valid = isValidSolanaAddress(addr)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!valid) { setError("that doesn't look like a solana address"); return }
    if (!heliusKey) { setError('need a helius api key to pull your trades'); setShowKeys(true); return }
    setHeliusKey(heliusKey)
    if (anthropicKey) setAnthropicKey(anthropicKey)
    onSubmit(addr.trim())
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-12 pb-20 px-6 overflow-hidden">

      {/* Coffee stain, bottom-right */}
      <div className="pointer-events-none absolute bottom-[-40px] right-[-30px] w-[260px] opacity-80 rotate-[14deg]">
        <CoffeeStain />
      </div>
      <div className="pointer-events-none absolute top-[40%] left-[-60px] w-[180px] opacity-60 -rotate-[22deg]">
        <CoffeeStain />
      </div>

      {/* Header: notebook label + washi tape */}
      <div className="relative w-full max-w-3xl">
        <WashiTape color="pink" className="left-[8%] top-[-2px] rotate-[-6deg]" />
        <WashiTape color="blue" className="right-[14%] top-[6px] rotate-[4deg] !w-[130px]" />
      </div>

      {/* Cover title */}
      <header className="relative w-full max-w-3xl mt-16 text-center">
        <div className="absolute -top-6 right-[12%] wobble">
          <StarDoodle className="w-12 h-12 ink-gold" />
        </div>
        <div className="absolute -top-2 left-[6%] -rotate-12">
          <SkullDoodle className="w-10 h-12 ink-graphite opacity-70" />
        </div>

        <h1 className="hand-title text-[88px] md:text-[124px] leading-[0.9] ink-graphite" style={{ letterSpacing: '-0.02em' }}>
          <span className="inline-block -rotate-1">degen</span>{' '}
          <span className="inline-block rotate-1">diary</span>
        </h1>
        <div className="mx-auto mt-1 w-[320px]">
          <Underline className="w-full h-4 ink-red" />
        </div>

        <p className="mt-6 print-hand text-[22px] ink-pencil rotate-[-0.4deg]">
          property of:{' '}
          <span className="typewriter ink-blue">
            {shortAddr(MOCK_WALLET)}
          </span>
          <span className="ml-3 ink-red">(maybe you?)</span>
        </p>
      </header>

      {/* Main prompt */}
      <section className="relative mt-16 w-full max-w-2xl">
        <div className="notebook-card paper-lined rounded-[3px] px-8 pt-10 pb-8 rotate-[-0.6deg]">
          <WashiTape color="yellow" className="top-[-10px] left-[30%] rotate-[-3deg]" />

          <div className="flex items-start gap-3 mb-6">
            <div className="flex-1">
              <p className="print-hand text-[15px] ink-pencil uppercase tracking-widest">entry 001</p>
              <h2 className="hand-title text-[46px] ink-graphite mt-1 leading-none">
                drop your wallet.
              </h2>
              <p className="hand-write text-[19px] ink-pencil mt-2 italic">
                i'll write the journal for you.
              </p>
            </div>
            <ArrowDoodle className="w-16 h-10 ink-blue mt-4 hidden md:block" dir="down" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={addr}
                onChange={(e) => { setAddr(e.target.value); setError('') }}
                placeholder="paste solana wallet address here…"
                className="ink-input ink-input-big"
                spellCheck={false}
                autoComplete="off"
              />
              {valid && (
                <div className="absolute -right-2 -top-2 -rotate-6 ink-bleed">
                  <WobblyCircle className="w-28 h-12 ink-green" />
                  <span className="absolute inset-0 flex items-center justify-center print-hand ink-green text-[14px]">
                    looks good
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="rotate-[-1deg]">
                <span className="hand-write ink-red text-[18px] italic">× {error}</span>
              </div>
            )}

            {/* Keys accordion */}
            <div className="border-t border-dashed border-[#A8C5E8] pt-5">
              <button
                type="button"
                onClick={() => setShowKeys(s => !s)}
                className="print-hand ink-pencil text-[15px] hover:ink-graphite"
              >
                {showKeys ? '▾' : '▸'} api keys
                <span className="ml-2 ink-red italic">
                  ({heliusKey ? '✓ helius saved' : 'need helius'}
                  {anthropicKey ? ', ✓ anthropic saved' : ', anthropic optional'})
                </span>
              </button>
              {showKeys && (
                <div className="mt-4 space-y-4 ink-bleed">
                  <label className="block">
                    <span className="print-hand text-[14px] ink-pencil">helius api key</span>
                    <span className="ml-2 hand-write text-[13px] ink-red italic">(required — get a free one at helius.dev)</span>
                    <input
                      type="password"
                      value={heliusKey}
                      onChange={(e) => setHelius(e.target.value)}
                      placeholder="xxxx-xxxx-xxxx"
                      className="ink-input mt-1"
                    />
                  </label>
                  <label className="block">
                    <span className="print-hand text-[14px] ink-pencil">anthropic api key</span>
                    <span className="ml-2 hand-write text-[13px] ink-pencil italic">(optional — without it, entries use canned commentary)</span>
                    <input
                      type="password"
                      value={anthropicKey}
                      onChange={(e) => setAnthropic(e.target.value)}
                      placeholder="sk-ant-xxxxxxxx"
                      className="ink-input mt-1"
                    />
                  </label>
                  <p className="hand-write text-[14px] ink-pencil italic leading-relaxed">
                    both keys stay in your browser. no server. if you don't trust it, read the source.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-end justify-between flex-wrap gap-4 pt-4">
              <button type="submit" className="ink-button">
                open the ledger →
              </button>
              <button
                type="button"
                onClick={onDemo}
                className="print-hand ink-pencil text-[15px] underline underline-offset-4 decoration-wavy decoration-[#C23B22] hover:ink-graphite"
              >
                just show me a demo with fake trades
              </button>
            </div>
          </form>

          {/* Paperclip in top-right */}
          <div className="absolute -right-3 top-6 -rotate-[18deg] pointer-events-none">
            <Paperclip className="w-6 h-10" />
          </div>
        </div>

        {/* Sticky note disclaimer */}
        <div className="absolute -right-8 -bottom-10 hidden md:block max-w-[220px]">
          <StickyNote rotate={5}>
            <p className="text-[15px] leading-snug">
              warning: this journal does <span className="highlighter">not</span> sugar-coat.
            </p>
            <p className="text-[13px] mt-2 italic ink-pencil">— the honest version of you</p>
          </StickyNote>
        </div>
      </section>

      {/* Footer scribbles */}
      <footer className="relative mt-24 max-w-3xl w-full text-center">
        <div className="flex items-center justify-center gap-3 opacity-70">
          <Squiggle className="w-24 h-3 ink-pencil" />
          <span className="print-hand ink-pencil text-[14px]">made for people who journal after getting rekt</span>
          <Squiggle className="w-24 h-3 ink-pencil" />
        </div>
      </footer>
    </div>
  )
}
