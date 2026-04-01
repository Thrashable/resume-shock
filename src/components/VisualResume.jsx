import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import JobMatcher from './JobMatcher'

function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function TypewriterName({ name }) {
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  useEffect(() => {
    let i = 0
    const iv = setInterval(() => {
      if (i <= name.length) { setDisplayed(name.slice(0, i)); i++ }
      else { clearInterval(iv); setTimeout(() => setShowCursor(false), 1200) }
    }, 50)
    return () => clearInterval(iv)
  }, [name])
  return (
    <h1 className="font-display font-bold tracking-tight" style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1.1, color: '#E6EDF3' }}>
      {displayed}
      {showCursor && <span className="cursor-blink" style={{ color: '#00D4FF' }}>|</span>}
    </h1>
  )
}

function Initials({ name }) {
  const initials = name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  return (
    <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-display font-semibold float"
      style={{ background: 'rgba(0,212,255,0.08)', color: '#00D4FF', border: '2px solid rgba(0,212,255,0.2)' }}>
      {initials}
    </div>
  )
}

function StatCounter({ label, value, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  const numVal = parseInt(value) || 0
  useEffect(() => {
    if (!inView || !numVal) return
    let s = 0
    const step = Math.max(1, Math.floor(numVal / 25))
    const iv = setInterval(() => {
      s += step
      if (s >= numVal) { setCount(numVal); clearInterval(iv) } else setCount(s)
    }, 30)
    return () => clearInterval(iv)
  }, [inView, numVal])
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }} className="text-center">
      <div className="font-display font-bold text-2xl" style={{ color: '#00D4FF' }}>{numVal ? count : value}</div>
      <div className="ps-label mt-1">{label}</div>
    </motion.div>
  )
}

function TimelineEntry({ exp, index, isLast }) {
  const [open, setOpen] = useState(index === 0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.4 }} className="ps-card mb-3" style={{ cursor: 'pointer' }}
      onClick={() => setOpen(!open)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'rgba(0,212,255,0.08)' }}>
            <svg className="w-4 h-4" fill="none" stroke="#00D4FF" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[15px]" style={{ color: '#E6EDF3' }}>{exp.company || exp.role}</h3>
            {exp.role && exp.company && (
              <p className="text-sm mt-0.5" style={{ color: '#00D4FF' }}>{exp.role}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {exp.dateRange && (
            <span className="font-mono text-[11px] px-2 py-0.5 rounded"
              style={{ color: '#8B949E', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {exp.dateRange}
            </span>
          )}
          <motion.svg animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
            className="w-4 h-4" style={{ color: '#8B949E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </div>
      <AnimatePresence>
        {open && exp.bullets.length > 0 && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="mt-3 ml-11 space-y-2 overflow-hidden">
            {exp.bullets.map((b, j) => (
              <motion.li key={j} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: j * 0.04 }} className="text-sm flex gap-2" style={{ color: '#8B949E', lineHeight: 1.6 }}>
                <span style={{ color: 'rgba(0,212,255,0.4)' }} className="shrink-0 mt-0.5">&#9656;</span>
                <span>{b}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function VisualResume({ data, profileImage, showMatcher = false }) {
  const { name, title, contact, summary, experience, education, skills, projects, certifications } = data

  const stats = [
    skills.length > 0 && { label: 'Skills', value: String(skills.length) },
    experience.length > 0 && { label: 'Roles', value: String(experience.length) },
    projects.length > 0 && { label: 'Projects', value: String(projects.length) },
  ].filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-20 relative z-10">

      {/* ===== HERO ===== */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          {profileImage ? (
            <div className="shrink-0 float">
              <img src={profileImage} alt={name}
                className="w-24 h-24 rounded-full object-cover"
                style={{ border: '2px solid rgba(0,212,255,0.2)' }} />
            </div>
          ) : (
            <div className="shrink-0"><Initials name={name} /></div>
          )}
          <div className="text-center sm:text-left">
            <TypewriterName name={name} />
            {title && (
              <p className="text-lg mt-2 font-medium" style={{ color: '#00D4FF' }}>{title}</p>
            )}
          </div>
        </div>

        {/* Contact pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="ps-pill">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {contact.email}
            </a>
          )}
          {contact.phone && (
            <span className="ps-pill">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {contact.phone}
            </span>
          )}
          {contact.linkedin && (
            <a href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`}
              target="_blank" rel="noopener noreferrer" className="ps-pill">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          )}
          {contact.github && (
            <a href={contact.github.startsWith('http') ? contact.github : `https://${contact.github}`}
              target="_blank" rel="noopener noreferrer" className="ps-pill">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          )}
          {contact.website && (
            <a href={contact.website} target="_blank" rel="noopener noreferrer" className="ps-pill">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              Website
            </a>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <p className="text-[15px] mb-8 max-w-2xl" style={{ color: '#8B949E', lineHeight: 1.7 }}>{summary}</p>
        )}

        {/* Stats */}
        {stats.length > 0 && (
          <div className="flex gap-10 mb-8">
            {stats.map((s, i) => <StatCounter key={s.label} {...s} index={i} />)}
          </div>
        )}
      </FadeIn>

      {/* ===== SKILLS ===== */}
      {skills.length > 0 && (
        <FadeIn className="mb-12" delay={0.05}>
          <h2 className="ps-heading mb-6">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <motion.span key={skill} initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.02 }} className="ps-tag">
                {skill}
              </motion.span>
            ))}
          </div>
        </FadeIn>
      )}

      {/* ===== EXPERIENCE ===== */}
      {experience.length > 0 && (
        <FadeIn className="mb-12" delay={0.1}>
          <h2 className="ps-heading mb-6">Professional Experience</h2>
          {experience.map((exp, i) => (
            <TimelineEntry key={i} exp={exp} index={i} isLast={i === experience.length - 1} />
          ))}
        </FadeIn>
      )}

      {/* ===== EDUCATION ===== */}
      {education.length > 0 && (
        <FadeIn className="mb-12" delay={0.15}>
          <h2 className="ps-heading mb-6">
            Education{certifications && certifications.length > 0 ? ' & Certifications' : ''}
          </h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="ps-card">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(0,212,255,0.08)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="#00D4FF" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]" style={{ color: '#E6EDF3' }}>{edu.school}</h3>
                    {edu.degree && <p className="text-sm mt-0.5" style={{ color: '#8B949E' }}>{edu.degree}</p>}
                    {edu.year && <p className="font-mono text-[11px] mt-1" style={{ color: '#6E7681' }}>{edu.year}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
            {certifications && certifications.length > 0 && certifications.map((cert, i) => (
              <motion.div key={`cert-${i}`} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: (education.length + i) * 0.06 }} className="ps-card">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(0,212,255,0.08)' }}>
                    <svg className="w-4 h-4" fill="#00D4FF" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]" style={{ color: '#E6EDF3' }}>{cert}</h3>
                    <p className="text-sm mt-0.5" style={{ color: '#8B949E' }}>Certification</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* ===== PROJECTS ===== */}
      {projects.length > 0 && (
        <FadeIn className="mb-12" delay={0.2}>
          <h2 className="ps-heading mb-6">Projects</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {projects.map((proj, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="ps-card">
                <h3 className="font-semibold text-[15px]" style={{ color: '#E6EDF3' }}>{proj.name}</h3>
                {proj.description && (
                  <p className="text-sm mt-2" style={{ color: '#8B949E', lineHeight: 1.6 }}>{proj.description}</p>
                )}
                {proj.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.tech.map((t, j) => (
                      <span key={j} className="ps-tag" style={{ fontSize: '11px', padding: '2px 8px' }}>{t}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* ===== JOB MATCHER (preview only) ===== */}
      {showMatcher && (
        <FadeIn className="mb-12" delay={0.25}>
          <div className="ps-card">
            <JobMatcher resumeData={data} />
          </div>
        </FadeIn>
      )}
    </div>
  )
}
