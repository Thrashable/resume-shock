export default function Stamp({ kind = 'win', children, className = '', style }) {
  const cls = {
    win:  'stamp stamp-win',
    loss: 'stamp stamp-loss',
    rekt: 'stamp stamp-rekt',
    mid:  'stamp stamp-mid',
  }[kind] || 'stamp'
  const label = children ?? {
    win: 'W',
    loss: 'LOSS',
    rekt: 'REKT',
    mid: 'MID',
  }[kind]
  return <span className={`${cls} ${className}`} style={style}>{label}</span>
}
