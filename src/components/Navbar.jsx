import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 dark:border-white/5 bg-[#06060C]/80 dark:bg-[#06060C]/80 backdrop-blur-xl">
      <style>{`html:not(.dark) nav { background: rgba(248,249,252,0.8); border-color: rgba(0,0,0,0.06); }`}</style>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-display font-semibold tracking-tight text-gray-900 dark:text-white">
          RESUME<span className="text-accent">SHOCK</span>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  )
}
