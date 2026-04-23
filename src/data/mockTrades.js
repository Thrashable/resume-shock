// Mocked trade data so the UI can be developed and demoed without real API calls.

import { annotateLedger } from '../utils/patterns'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const NOW = Date.now()

export const MOCK_WALLET = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'

export const MOCK_POSITIONS = [
  {
    id: 'wif-1',
    token: { symbol: 'WIF', name: 'dogwifhat', mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', age_at_entry_ms: 6 * HOUR },
    entry: { price: 0.018, marketcap: 180_000, sol_spent: 4.2, timestamp: NOW - 3 * DAY },
    exits: [
      { price: 0.034, marketcap: 340_000, sol_received: 2.1, timestamp: NOW - 2.6 * DAY },
      { price: 0.082, marketcap: 820_000, sol_received: 5.8, timestamp: NOW - 2 * DAY },
    ],
    peak_price_during_hold: 0.094,
    realized_pnl_sol: 3.7,
    unrealized_pnl_sol: 0,
    still_holding: false,
    position_size_pct: 11,
    hold_duration_ms: 1 * DAY,
  },
  {
    id: 'rekt-1',
    token: { symbol: 'PNUT', name: 'Peanut the Squirrel', mint: '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump', age_at_entry_ms: 3 * HOUR },
    entry: { price: 0.0012, marketcap: 1_400_000, sol_spent: 8.5, timestamp: NOW - 5 * DAY },
    exits: [],
    peak_price_during_hold: 0.0014,
    realized_pnl_sol: 0,
    unrealized_pnl_sol: -6.1,
    still_holding: true,
    position_size_pct: 38,
    hold_duration_ms: 5 * DAY,
    current_price: 0.00018,
  },
  {
    id: 'paper-1',
    token: { symbol: 'CHILLGUY', name: 'Just a chill guy', mint: 'Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump', age_at_entry_ms: 14 * HOUR },
    entry: { price: 0.004, marketcap: 400_000, sol_spent: 1.5, timestamp: NOW - 8 * DAY },
    exits: [
      { price: 0.0046, marketcap: 460_000, sol_received: 1.7, timestamp: NOW - 7.8 * DAY },
    ],
    peak_price_during_hold: 0.024, // 6x peak
    realized_pnl_sol: 0.2,
    unrealized_pnl_sol: 0,
    still_holding: false,
    position_size_pct: 6,
    hold_duration_ms: 4 * HOUR,
  },
  {
    id: 'snipe-1',
    token: { symbol: 'GOAT', name: 'Goatseus Maximus', mint: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump', age_at_entry_ms: 25 * 60 * 1000 },
    entry: { price: 0.00009, marketcap: 90_000, sol_spent: 0.8, timestamp: NOW - 12 * DAY },
    exits: [
      { price: 0.00045, marketcap: 450_000, sol_received: 1.2, timestamp: NOW - 11.5 * DAY },
      { price: 0.0021, marketcap: 2_100_000, sol_received: 3.4, timestamp: NOW - 10 * DAY },
      { price: 0.011, marketcap: 11_000_000, sol_received: 9.6, timestamp: NOW - 6 * DAY },
    ],
    peak_price_during_hold: 0.018,
    realized_pnl_sol: 13.4,
    unrealized_pnl_sol: 0,
    still_holding: false,
    position_size_pct: 4,
    hold_duration_ms: 6 * DAY,
  },
  {
    id: 'fomo-1',
    token: { symbol: 'POPCAT', name: 'Popcat', mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', age_at_entry_ms: 2 * DAY },
    entry: { price: 0.84, marketcap: 8_400_000, sol_spent: 3.0, timestamp: NOW - 18 * DAY },
    exits: [
      { price: 0.42, marketcap: 4_200_000, sol_received: 1.4, timestamp: NOW - 17 * DAY },
    ],
    peak_price_during_hold: 0.91,
    realized_pnl_sol: -1.6,
    unrealized_pnl_sol: 0,
    still_holding: false,
    position_size_pct: 18,
    hold_duration_ms: 1 * DAY,
  },
  {
    id: 'topblast-1',
    token: { symbol: 'MOODENG', name: 'Moo Deng', mint: 'ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY', age_at_entry_ms: 8 * HOUR },
    entry: { price: 0.21, marketcap: 2_100_000, sol_spent: 5.0, timestamp: NOW - 14 * HOUR },
    exits: [],
    peak_price_during_hold: 0.23,
    realized_pnl_sol: 0,
    unrealized_pnl_sol: -1.8,
    still_holding: true,
    position_size_pct: 22,
    hold_duration_ms: 14 * HOUR,
    current_price: 0.13,
  },
  {
    id: 'smart-1',
    token: { symbol: 'BONK', name: 'Bonk', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', age_at_entry_ms: 30 * DAY },
    entry: { price: 0.0000012, marketcap: 800_000, sol_spent: 1.0, timestamp: NOW - 25 * DAY },
    exits: [
      { price: 0.0000028, marketcap: 1_900_000, sol_received: 1.2, timestamp: NOW - 22 * DAY },
      { price: 0.0000052, marketcap: 3_600_000, sol_received: 1.4, timestamp: NOW - 19 * DAY },
    ],
    peak_price_during_hold: 0.0000061,
    realized_pnl_sol: 1.6,
    unrealized_pnl_sol: 0.4,
    still_holding: true,
    position_size_pct: 5,
    hold_duration_ms: 25 * DAY,
    current_price: 0.0000048,
  },
  {
    id: 'panic-1',
    token: { symbol: 'PEPE', name: 'Pepe SOL', mint: 'BzN8wCGJfYbuV2vFu7G2PpYoa3kqmpQv2QPgxuXeZX1', age_at_entry_ms: 4 * HOUR },
    entry: { price: 0.0085, marketcap: 850_000, sol_spent: 2.0, timestamp: NOW - 22 * DAY },
    exits: [
      { price: 0.0072, marketcap: 720_000, sol_received: 1.7, timestamp: NOW - 22 * DAY + 6 * 60 * 1000 },
    ],
    peak_price_during_hold: 0.0085,
    realized_pnl_sol: -0.3,
    unrealized_pnl_sol: 0,
    still_holding: false,
    position_size_pct: 8,
    hold_duration_ms: 6 * 60 * 1000,
  },
]

export const MOCK_JOURNAL_ENTRIES = {
  'wif-1': "took 4 SOL into WIF when it was still 180k mc, scaled out at 2x and 4.5x like an actual person for once. left some on the table — peak was 5x — but i'd rather book the bag than watch it round-trip again. clean trade, would do again.",
  'rekt-1': "topblasted PNUT at 1.4M mc, 38% of my entire bag, on a 3-hour-old coin. classic. it's down 85% and i'm still holding because admitting it hurts more than the unrealized loss. this is the trade i'll show my therapist.",
  'paper-1': "had CHILLGUY at 400k mc and panic-sold for 13% gain after the first wick. coin went 6x in the next four hours. paper hands of the highest order. i scrolled twitter for the next two days quietly seething.",
  'snipe-1': "actually sniped GOAT at 90k mc, 0.8 SOL position, scaled out at 5x, 23x and 122x. printed 13.4 SOL. kept the position size sane and didn't let the win get to my head. this is the trade i tell people about at parties.",
  'fomo-1': "aped POPCAT at 8.4M mc, 18% of my bag, right after a green wick because i couldn't watch it run without me. it dumped 50% the next day and i sold the bottom for half my SOL back. fomo entries are tax i pay to discord.",
  'topblast-1': "another 2M mc entry on an 8h coin. 22% of my SOL. why do i keep doing this. it's down 38% already and i'm telling myself it's a hold. it's not a hold. i'm just stuck.",
  'smart-1': "took 1 SOL into BONK at 800k, scaled out twice and still hold a third. up 60% realized + small unrealized. small position, scaled exits, no drama. proof that boring trades pay.",
  'panic-1': "PEPE entry, dropped 15% in six minutes, i clicked sell so fast i didn't even read the chart. textbook panic dump. it bottomed two minutes later and ran 3x. -0.3 SOL is the cost of my heartbeat.",
}

// Tag positions with implicit flags only known at parse time
MOCK_POSITIONS.find(p => p.id === 'fomo-1')._fomoWick = true

export function getMockData() {
  return {
    wallet: MOCK_WALLET,
    positions: MOCK_POSITIONS,
    flags: annotateLedger(MOCK_POSITIONS),
    journal: MOCK_JOURNAL_ENTRIES,
    fetchedAt: NOW,
  }
}
