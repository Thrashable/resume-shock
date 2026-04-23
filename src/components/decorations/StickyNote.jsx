export default function StickyNote({ children, rotate = 3, className = '' }) {
  return (
    <div
      className={`sticky-note ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  )
}
