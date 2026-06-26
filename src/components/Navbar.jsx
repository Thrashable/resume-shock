import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl"
      style={{ background: 'rgba(13,17,23,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <style>{`html:not(.dark) nav { background: rgba(250,251,252,0.85) !important; border-color: rgba(0,0,0,0.08) !important; }`}</style>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-display font-bold tracking-tight" style={{ color: '#E6EDF3' }}>
          RESUME<span style={{ color: '#00D4FF' }}>SHOCK</span>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  )
}
