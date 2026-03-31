import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function Initials({ name }) {
  const initials = name
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="w-28 h-28 rounded-full bg-accent/10 flex items-center justify-center text-3xl font-bold text-accent ring-4 ring-accent/30">
      {initials}
    </div>
  )
}

function ContactRow({ contact }) {
  const items = []
  if (contact.email) items.push({ icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: contact.email, href: `mailto:${contact.email}` })
  if (contact.phone) items.push({ icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: contact.phone })
  if (contact.linkedin) items.push({ icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z', text: 'LinkedIn', href: contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}` })
  if (contact.github) items.push({ text: 'GitHub', href: contact.github.startsWith('http') ? contact.github : `https://${contact.github}` })
  if (contact.website) items.push({ text: 'Website', href: contact.website })

  if (!items.length) return null

  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {items.map((item, i) => (
        <a
          key={i}
          href={item.href || '#'}
          target={item.href ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
        >
          {item.icon && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
          )}
          {item.text}
        </a>
      ))}
    </div>
  )
}

function Section({ title, children, delay = 0 }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-accent/30 pb-2">
        {title}
      </h2>
      {children}
    </motion.section>
  )
}

export default function VisualResume({ data, profileImage }) {
  const { name, title, contact, summary, experience, education, skills, projects, certifications } = data

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-10 px-4">
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt={name}
            className="w-28 h-28 rounded-full object-cover ring-4 ring-accent/30"
          />
        ) : (
          <Initials name={name} />
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{name}</h1>
          {title && <p className="text-lg text-accent font-medium mt-1">{title}</p>}
          <ContactRow contact={contact} />
        </div>
      </motion.div>

      {/* Summary */}
      {summary && (
        <Section title="Summary">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{summary}</p>
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills" delay={0.05}>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Experience" delay={0.1}>
          <div className="relative pl-6 space-y-8">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-accent/20" />
            {experience.map((exp, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[18px] top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-white dark:ring-gray-950" />
                <div className="space-y-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{exp.role || exp.company}</h3>
                    {exp.role && exp.company && (
                      <p className="text-sm text-accent font-medium">{exp.company}</p>
                    )}
                    {exp.dateRange && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{exp.dateRange}</p>
                    )}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="space-y-1.5">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                          <span className="text-accent mt-1 shrink-0">&#8226;</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education" delay={0.15}>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <h3 className="font-bold text-gray-900 dark:text-white">{edu.school}</h3>
                {edu.degree && <p className="text-sm text-gray-600 dark:text-gray-300">{edu.degree}</p>}
                {edu.year && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{edu.year}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects" delay={0.2}>
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((proj, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <h3 className="font-bold text-gray-900 dark:text-white">{proj.name}</h3>
                {proj.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{proj.description}</p>
                )}
                {proj.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.tech.map((t, j) => (
                      <span key={j} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <Section title="Certifications" delay={0.25}>
          <ul className="space-y-2">
            {certifications.map((cert, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <svg className="w-4 h-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {cert}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}
