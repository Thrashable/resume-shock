// Hand-drawn SVG doodles. Inline so we can color them with currentColor.

export function ArrowDoodle({ className = '', color = 'currentColor', dir = 'right' }) {
  const rotate = { right: 0, left: 180, up: -90, down: 90 }[dir] ?? 0
  return (
    <svg viewBox="0 0 80 30" className={className} style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
      <path
        d="M3 18 Q 18 8, 38 16 T 72 14"
        fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"
      />
      <path
        d="M62 6 L 74 14 L 60 22"
        fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export function StarDoodle({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path
        d="M20 4 L24 16 L37 17 L27 25 L31 38 L20 30 L9 38 L13 25 L3 17 L16 16 Z"
        fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"
        transform="rotate(-6 20 20)"
      />
    </svg>
  )
}

export function HappyFace({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="14" cy="17" r="1.4" fill={color} />
      <circle cx="26" cy="17" r="1.4" fill={color} />
      <path d="M12 24 Q 20 32, 28 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SadFace({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="2" />
      <path d="M11 16 L 17 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M17 16 L 11 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M23 16 L 29 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M29 16 L 23 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 30 Q 20 22, 28 30" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SkullDoodle({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 40 44" className={className} aria-hidden>
      <path d="M20 3 C 8 3, 4 14, 5 22 C 6 28, 10 30, 11 33 L 11 38 L 16 38 L 16 35 L 19 35 L 19 38 L 21 38 L 21 35 L 24 35 L 24 38 L 29 38 L 29 33 C 30 30, 34 28, 35 22 C 36 14, 32 3, 20 3 Z"
        fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="14" cy="20" r="3.5" fill={color} />
      <circle cx="26" cy="20" r="3.5" fill={color} />
      <path d="M18 26 L 22 26 M 20 26 L 20 30" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function FireDoodle({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 40 50" className={className} aria-hidden>
      <path d="M20 4 C 24 14, 32 18, 30 28 C 35 26, 36 32, 34 38 C 32 46, 24 48, 20 47 C 14 46, 8 42, 8 34 C 8 28, 12 26, 14 24 C 14 18, 18 14, 20 4 Z"
        fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 28 C 22 32, 24 34, 23 38 C 22 42, 18 42, 17 38 C 16 34, 18 32, 20 28 Z"
        fill={color} opacity="0.6" />
    </svg>
  )
}

export function WobblyCircle({ className = '', color = 'currentColor', strokeWidth = 2.2 }) {
  return (
    <svg viewBox="0 0 100 50" className={className} preserveAspectRatio="none" aria-hidden>
      <path
        d="M8 25 C 8 8, 30 4, 50 5 C 72 6, 94 10, 92 25 C 92 40, 72 46, 50 45 C 28 44, 6 40, 8 25 Z"
        fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
    </svg>
  )
}

export function Squiggle({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 200 14" className={className} preserveAspectRatio="none" aria-hidden>
      <path
        d="M2 7 Q 12 1, 22 7 T 42 7 T 62 7 T 82 7 T 102 7 T 122 7 T 142 7 T 162 7 T 182 7 T 198 7"
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
      />
    </svg>
  )
}

export function Underline({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 200 14" className={className} preserveAspectRatio="none" aria-hidden>
      <path
        d="M4 7 Q 50 2, 100 6 T 196 8"
        fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round"
      />
    </svg>
  )
}

export function Paperclip({ className = '', color = '#7a7a7a' }) {
  return (
    <svg viewBox="0 0 40 70" className={className} aria-hidden>
      <path
        d="M20 6 C 28 6, 34 12, 34 22 L 34 50 C 34 58, 28 64, 20 64 C 12 64, 6 58, 6 50 L 6 24 C 6 18, 10 14, 16 14 C 22 14, 26 18, 26 24 L 26 48 C 26 52, 24 54, 20 54 C 16 54, 14 52, 14 48 L 14 28"
        fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round"
      />
    </svg>
  )
}

export function CoffeeStain({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="cs1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(120, 80, 30, 0.0)" />
          <stop offset="78%" stopColor="rgba(120, 80, 30, 0.0)" />
          <stop offset="88%" stopColor="rgba(120, 70, 25, 0.32)" />
          <stop offset="95%" stopColor="rgba(150, 95, 35, 0.18)" />
          <stop offset="100%" stopColor="rgba(120, 80, 30, 0.0)" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="100" rx="86" ry="78" fill="url(#cs1)" />
      <path d="M 26 92 C 24 78, 36 56, 60 48 C 80 42, 110 44, 140 56 C 168 68, 178 86, 176 102 C 174 116, 158 134, 132 144 C 110 152, 78 152, 56 142 C 36 132, 28 110, 26 92 Z"
        fill="none" stroke="rgba(120, 70, 25, 0.22)" strokeWidth="2.2" />
    </svg>
  )
}

export function PencilCursor({ className = '' }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <g transform="rotate(-30 30 30)">
        <rect x="22" y="6" width="16" height="32" fill="#FFD86B" stroke="#2B2B2B" strokeWidth="1.4" />
        <polygon points="22,38 30,52 38,38" fill="#F0E0C0" stroke="#2B2B2B" strokeWidth="1.4" />
        <polygon points="26,46 30,52 34,46" fill="#2B2B2B" />
        <rect x="22" y="6" width="16" height="6" fill="#C23B22" stroke="#2B2B2B" strokeWidth="1.4" />
      </g>
    </svg>
  )
}
