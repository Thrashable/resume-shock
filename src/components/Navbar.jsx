import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
          RESUME<span className="text-accent">SHOCK</span>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  )
}
