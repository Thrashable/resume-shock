export default function WashiTape({ color = 'pink', className = '', style }) {
  const colorClass = {
    pink:   'washi-tape',
    blue:   'washi-tape washi-blue',
    green:  'washi-tape washi-green',
    yellow: 'washi-tape washi-yellow',
  }[color] || 'washi-tape'
  return <div className={`${colorClass} ${className}`} style={style} aria-hidden />
}
