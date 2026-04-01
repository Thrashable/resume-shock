import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import JobMatcher from './JobMatcher'

const card = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

function BentoCard({ children, className = '', index = 0, style }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={card}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`bento-card ${className}`}
      style={style}
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
    const interval = setInterval(() => {
      if (i <= name.length) {
        setDisplayed(name.slice(0, i))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setShowCursor(false), 1500)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [name])

  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-gray-900 dark:text-white">
      {displayed}
      {showCursor && <span className="cursor-blink text-accent">|</span>}
    </h1>
  )
}

function Initials({ name }) {
  const initials = name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-accent/10 flex items-center justify-center text-2xl sm:text-3xl font-display font-bold text-accent ring-[3px] ring-accent/30 float">
      {initials}
    </div>
  )
}

function ContactPill({ icon, text, href }) {
  const Tag = href ? 'a' : 'span'
  const props = href ? { href: href.startsWith('http') || href.startsWith('mailto:') ? href : `https://${href}`, target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <Tag {...props} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 text-xs text-gray-600 dark:text-gray-300 hover:border-accent/30 hover:text-accent transition-all duration-200">
      {icon}
      <span>{text}</span>
    </Tag>
  )
}

function SkillRing({ skill, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  // Generate a pseudo-random percentage for visual interest
  const pct = ((skill.length * 7 + index * 13) % 40) + 60
  const r = 18
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="flex flex-col items-center gap-1.5 group cursor-default"
    >
      <div className="relative w-11 h-11">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r={r} fill="none" className="stroke-white/5" strokeWidth="3" />
          <motion.circle
            cx="20" cy="20" r={r} fill="none"
            className="stroke-accent"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </div>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center leading-tight group-hover:text-accent transition-colors max-w-[60px] truncate">
        {skill}
      </span>
    </motion.div>
  )
}

function TimelineEntry({ exp, index, isLast }) {
  const [open, setOpen] = useState(index === 0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="relative pl-8 pb-6 group"
    >
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gradient-to-b from-accent/30 to-transparent" />
      )}
      {/* Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 300 }}
        className="absolute left-1 top-1.5 w-[14px] h-[14px] rounded-full border-[3px] border-accent bg-white dark:bg-[#0D0D14]"
      />

      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{exp.role || exp.company}</h4>
            {exp.role && exp.company && (
              <p className="text-xs text-accent font-medium mt-0.5">{exp.company}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {exp.dateRange && (
              <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                {exp.dateRange}
              </span>
            )}
            <motion.svg
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-3.5 h-3.5 text-gray-500"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </div>

        <AnimatePresence>
          {open && exp.bullets.length > 0 && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2.5 space-y-1.5 overflow-hidden"
            >
              {exp.bullets.map((b, j) => (
                <motion.li
                  key={j}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: j * 0.05 }}
                  className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 leading-relaxed"
                >
                  <span className="text-accent/60 mt-0.5 shrink-0">&#9656;</span>
                  <span>{b}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function StatCard({ label, value, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  const numVal = parseInt(value) || 0

  useEffect(() => {
    if (!inView || !numVal) return
    let start = 0
    const step = Math.max(1, Math.floor(numVal / 30))
    const interval = setInterval(() => {
      start += step
      if (start >= numVal) {
        setCount(numVal)
        clearInterval(interval)
      } else {
        setCount(start)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [inView, numVal])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="text-center"
    >
      <div className="text-2xl font-display font-bold text-accent">
        {numVal ? count : value}
        {numVal ? '+' : ''}
      </div>
      <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">{label}</div>
    </motion.div>
  )
}

export default function VisualResume({ data, profileImage, showMatcher = false }) {
  const { name, title, contact, summary, experience, education, skills, projects, certifications } = data

  const stats = [
    skills.length > 0 && { label: 'Skills', value: String(skills.length) },
    experience.length > 0 && { label: 'Roles', value: String(experience.length) },
    projects.length > 0 && { label: 'Projects', value: String(projects.length) },
    education.length > 0 && { label: 'Education', value: String(education.length) },
  ].filter(Boolean)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 relative z-10">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">

        {/* Hero Card — spans 2 cols */}
        <BentoCard className="md:col-span-2 noise" index={0}>
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {profileImage ? (
              <div className="shrink-0 float">
                <div className="relative">
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-[3px] ring-accent/30"
                  />
                  <div className="absolute inset-0 rounded-full ring-[3px] ring-accent/10 animate-ping opacity-20" />
                </div>
              </div>
            ) : (
              <div className="shrink-0">
                <Initials name={name} />
              </div>
            )}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <TypewriterName name={name} />
              {title && (
                <p className="text-base sm:text-lg text-accent font-medium mt-2 font-display">{title}</p>
              )}
              {summary && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed line-clamp-3">{summary}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {contact.email && (
                  <ContactPill
                    icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    text={contact.email}
                    href={`mailto:${contact.email}`}
                  />
                )}
                {contact.phone && (
                  <ContactPill
                    icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                    text={contact.phone}
                  />
                )}
                {contact.linkedin && (
                  <ContactPill
                    icon={<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                    text="LinkedIn"
                    href={contact.linkedin}
                  />
                )}
                {contact.github && (
                  <ContactPill
                    icon={<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>}
                    text="GitHub"
                    href={contact.github}
                  />
                )}
                {contact.website && (
                  <ContactPill
                    icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
                    text="Website"
                    href={contact.website}
                  />
                )}
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Stats Card */}
        {stats.length > 0 && (
          <BentoCard className="flex items-center justify-center" index={1}>
            <div className={`grid ${stats.length > 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-6 w-full`}>
              {stats.map((s, i) => (
                <StatCard key={s.label} {...s} index={i} />
              ))}
            </div>
          </BentoCard>
        )}

        {/* Skills Card */}
        {skills.length > 0 && (
          <BentoCard className="md:col-span-1" index={2}>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Skills</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-3">
              {skills.slice(0, 12).map((skill, i) => (
                <SkillRing key={skill} skill={skill} index={i} />
              ))}
            </div>
            {skills.length > 12 && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/5">
                {skills.slice(12).map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-gray-400 border border-white/5 hover:border-accent/20 hover:text-accent transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            )}
          </BentoCard>
        )}

        {/* Experience Card — spans 2 cols */}
        {experience.length > 0 && (
          <BentoCard className="md:col-span-2" index={3}>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-5">Experience</h3>
            <div>
              {experience.map((exp, i) => (
                <TimelineEntry key={i} exp={exp} index={i} isLast={i === experience.length - 1} />
              ))}
            </div>
          </BentoCard>
        )}

        {/* Education Card */}
        {education.length > 0 && (
          <BentoCard className="md:col-span-1" index={4}>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Education</h3>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{edu.school}</h4>
                      {edu.degree && <p className="text-xs text-gray-400 mt-0.5">{edu.degree}</p>}
                      {edu.year && <p className="text-[10px] font-mono text-gray-500 mt-1">{edu.year}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </BentoCard>
        )}

        {/* Projects Card — spans 2 cols */}
        {projects.length > 0 && (
          <BentoCard className="md:col-span-2" index={5}>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Projects</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {projects.map((proj, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl bg-white/[0.02] dark:bg-white/[0.02] border border-white/5 p-4 hover:border-accent/20 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-accent transition-colors">{proj.name}</h4>
                  {proj.description && (
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{proj.description}</p>
                  )}
                  {proj.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.tech.map((t, j) => (
                        <span key={j} className="px-2 py-0.5 rounded bg-accent/10 text-[10px] font-mono text-accent/80">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </BentoCard>
        )}

        {/* Certifications Card */}
        {certifications && certifications.length > 0 && (
          <BentoCard className="md:col-span-1" index={6}>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Certifications</h3>
            <div className="space-y-2.5">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 dark:text-gray-300">{cert}</span>
                </motion.div>
              ))}
            </div>
          </BentoCard>
        )}

        {/* Job Matcher — full width, only on preview */}
        {showMatcher && (
          <BentoCard className="md:col-span-3" index={7} style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.03) 0%, rgba(0,0,0,0) 60%)' }}>
            <JobMatcher resumeData={data} />
          </BentoCard>
        )}
      </div>
    </div>
  )
}
