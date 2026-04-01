import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import VisualResume from './VisualResume'
import { generateShareURL, getCompressedSize } from '../utils/shareLink'

function generateStandaloneHTML(data, profileImage) {
  const isDark = document.documentElement.classList.contains('dark')
  return `<!DOCTYPE html>
<html lang="en"${isDark ? ' class="dark"' : ''}>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${data.name} - Resume</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300..800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--accent:#22D3EE;--bg:#0D1117;--card:rgba(22,27,34,0.6);--border:rgba(255,255,255,0.06)}
body{font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;background:var(--bg);color:#c9d1d9;line-height:1.6;font-size:15px;-webkit-font-smoothing:antialiased}
html:not(.dark) body{background:#F8F9FC;color:#18181b}
html:not(.dark){--card:rgba(0,0,0,0.02);--border:rgba(0,0,0,0.08)}
.container{max-width:64rem;margin:0 auto;padding:2rem 1rem}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
@media(max-width:768px){.grid{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:1.5rem;transition:transform 0.3s,box-shadow 0.3s}
html:not(.dark) .card{background:white;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
.card:hover{transform:translateY(-3px)}
.span2{grid-column:span 2}@media(max-width:768px){.span2{grid-column:span 1}}
.span3{grid-column:span 3}@media(max-width:768px){.span3{grid-column:span 1}}
h1{font-family:'Outfit',ui-sans-serif,sans-serif;font-size:2.5rem;font-weight:800;color:white}
html:not(.dark) h1{color:#18181b}
h3.section{font-family:'Outfit',ui-sans-serif,sans-serif;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;margin-bottom:1rem}
.title{font-family:'Outfit',ui-sans-serif,sans-serif;color:var(--accent);font-weight:500;margin-top:0.5rem}
.avatar{width:7rem;height:7rem;border-radius:50%;object-fit:cover;border:3px solid rgba(0,212,255,0.3)}
.initials{width:7rem;height:7rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.875rem;font-family:'Outfit',ui-sans-serif,sans-serif;font-weight:700;color:var(--accent);background:rgba(0,212,255,0.1);border:3px solid rgba(0,212,255,0.3)}
.hero-content{display:flex;gap:1.25rem;align-items:flex-start}
@media(max-width:640px){.hero-content{flex-direction:column;align-items:center;text-align:center}}
.contact{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:1rem}
.pill{display:inline-flex;align-items:center;gap:0.375rem;padding:0.375rem 0.75rem;border-radius:0.5rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);font-size:0.75rem;color:#d1d5db;text-decoration:none}
html:not(.dark) .pill{background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.08);color:#4b5563}
.pill:hover{border-color:rgba(0,212,255,0.3);color:var(--accent)}
.skill-tag{padding:0.25rem 0.625rem;border-radius:0.375rem;background:rgba(0,212,255,0.1);color:var(--accent);font-size:0.75rem;font-family:'JetBrains Mono',ui-monospace,monospace;display:inline-block;margin:0.125rem}
.timeline-entry{position:relative;padding-left:2rem;padding-bottom:1.5rem}
.timeline-entry::before{content:'';position:absolute;left:11px;top:1.5rem;bottom:0;width:1px;background:linear-gradient(to bottom,rgba(0,212,255,0.3),transparent)}
.timeline-entry:last-child::before{display:none}
.dot{position:absolute;left:1px;top:0.375rem;width:14px;height:14px;border-radius:50%;border:3px solid var(--accent);background:var(--bg)}
html:not(.dark) .dot{background:#F8F9FC}
.entry-role{font-weight:600;color:white;font-size:0.875rem}
html:not(.dark) .entry-role{color:#18181b}
.entry-company{font-size:0.75rem;color:var(--accent);font-weight:500}
.entry-date{font-size:0.625rem;font-family:'JetBrains Mono',ui-monospace,monospace;color:#6b7280;margin-top:0.125rem}
.entry-bullets{margin-top:0.625rem;list-style:none}
.entry-bullets li{font-size:0.75rem;color:#9ca3af;display:flex;gap:0.5rem;margin-bottom:0.375rem;line-height:1.5}
.entry-bullets li::before{content:'\\25B8';color:rgba(0,212,255,0.5);flex-shrink:0;margin-top:0.125rem}
.edu-item{display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:1rem}
.edu-icon{width:2rem;height:2rem;border-radius:0.5rem;background:rgba(0,212,255,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.edu-school{font-weight:600;color:white;font-size:0.875rem}
html:not(.dark) .edu-school{color:#18181b}
.edu-degree{font-size:0.75rem;color:#9ca3af}
.edu-year{font-size:0.625rem;font-family:'JetBrains Mono',ui-monospace,monospace;color:#6b7280;margin-top:0.25rem}
.proj-card{border-radius:0.75rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);padding:1rem}
html:not(.dark) .proj-card{background:rgba(0,0,0,0.01);border-color:rgba(0,0,0,0.06)}
.proj-name{font-weight:600;color:white;font-size:0.875rem}
html:not(.dark) .proj-name{color:#18181b}
.proj-desc{font-size:0.75rem;color:#9ca3af;margin-top:0.375rem;line-height:1.5}
.proj-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0.75rem}
@media(max-width:640px){.proj-grid{grid-template-columns:1fr}}
.stat{text-align:center}.stat-val{font-family:'Outfit',ui-sans-serif,sans-serif;font-size:1.5rem;font-weight:700;color:var(--accent)}
.stat-label{font-size:0.625rem;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;margin-top:0.25rem}
.cert{display:flex;align-items:flex-start;gap:0.625rem;margin-bottom:0.625rem}
.cert-icon{width:1.25rem;height:1.25rem;border-radius:50%;background:rgba(0,212,255,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:0.125rem}
.cert-text{font-size:0.75rem;color:#d1d5db}
html:not(.dark) .cert-text{color:#4b5563}
.summary{font-size:0.875rem;color:#9ca3af;line-height:1.6;margin-top:0.75rem}
.footer{text-align:center;padding:2rem;font-size:0.75rem;color:#6b7280}
.footer a{color:var(--accent);text-decoration:none}
</style>
</head>
<body>
<div class="container">
<div class="grid">
<div class="card span2">
<div class="hero-content">
${profileImage ? `<img class="avatar" src="${profileImage}" alt="${data.name}"/>` : `<div class="initials">${data.name.split(/\\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase()}</div>`}
<div>
<h1>${data.name}</h1>
${data.title ? `<div class="title">${data.title}</div>` : ''}
${data.summary ? `<p class="summary">${data.summary}</p>` : ''}
<div class="contact">
${data.contact.email ? `<a class="pill" href="mailto:${data.contact.email}">${data.contact.email}</a>` : ''}
${data.contact.phone ? `<span class="pill">${data.contact.phone}</span>` : ''}
${data.contact.linkedin ? `<a class="pill" href="${data.contact.linkedin.startsWith('http') ? data.contact.linkedin : 'https://'+data.contact.linkedin}" target="_blank">LinkedIn</a>` : ''}
${data.contact.github ? `<a class="pill" href="${data.contact.github.startsWith('http') ? data.contact.github : 'https://'+data.contact.github}" target="_blank">GitHub</a>` : ''}
${data.contact.website ? `<a class="pill" href="${data.contact.website}" target="_blank">Website</a>` : ''}
</div>
</div>
</div>
</div>
${[data.skills.length,data.experience.length,data.projects.length,data.education.length].some(Boolean) ? `<div class="card"><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;align-items:center;height:100%">${data.skills.length?`<div class="stat"><div class="stat-val">${data.skills.length}+</div><div class="stat-label">Skills</div></div>`:''}${data.experience.length?`<div class="stat"><div class="stat-val">${data.experience.length}+</div><div class="stat-label">Roles</div></div>`:''}${data.projects.length?`<div class="stat"><div class="stat-val">${data.projects.length}+</div><div class="stat-label">Projects</div></div>`:''}${data.education.length?`<div class="stat"><div class="stat-val">${data.education.length}+</div><div class="stat-label">Education</div></div>`:''}</div></div>` : ''}
${data.skills.length ? `<div class="card"><h3 class="section">Skills</h3><div>${data.skills.map(s=>`<span class="skill-tag">${s}</span>`).join(' ')}</div></div>` : ''}
${data.experience.length ? `<div class="card span2"><h3 class="section">Experience</h3>${data.experience.map(e=>`<div class="timeline-entry"><div class="dot"></div><div class="entry-role">${e.role||e.company}</div>${e.role&&e.company?`<div class="entry-company">${e.company}</div>`:''}${e.dateRange?`<div class="entry-date">${e.dateRange}</div>`:''}${e.bullets.length?`<ul class="entry-bullets">${e.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>` : ''}
${data.education.length ? `<div class="card"><h3 class="section">Education</h3>${data.education.map(e=>`<div class="edu-item"><div class="edu-icon"><svg width="16" height="16" fill="none" stroke="var(--accent)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"/></svg></div><div><div class="edu-school">${e.school}</div>${e.degree?`<div class="edu-degree">${e.degree}</div>`:''}${e.year?`<div class="edu-year">${e.year}</div>`:''}</div></div>`).join('')}</div>` : ''}
${data.projects.length ? `<div class="card span2"><h3 class="section">Projects</h3><div class="proj-grid">${data.projects.map(p=>`<div class="proj-card"><div class="proj-name">${p.name}</div>${p.description?`<div class="proj-desc">${p.description}</div>`:''}${p.tech.length?`<div style="margin-top:0.75rem">${p.tech.map(t=>`<span class="skill-tag">${t}</span>`).join(' ')}</div>`:''}</div>`).join('')}</div></div>` : ''}
${data.certifications&&data.certifications.length ? `<div class="card"><h3 class="section">Certifications</h3>${data.certifications.map(c=>`<div class="cert"><div class="cert-icon"><svg width="12" height="12" fill="var(--accent)" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg></div><span class="cert-text">${c}</span></div>`).join('')}</div>` : ''}
</div>
</div>
<div class="footer">Built with <a href="${window.location.origin}">RESUME SHOCK</a></div>
</body>
</html>`
}

export default function Preview({ data, profileImage, onReset }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [sizeWarning, setSizeWarning] = useState('')

  const handleCopyLink = useCallback(async () => {
    const shareData = { ...data }
    if (profileImage) shareData._profileImage = profileImage

    const size = getCompressedSize(shareData)
    if (size > 50000) {
      setSizeWarning('Your share link is very long. For best results, use a smaller profile picture.')
    }

    const url = generateShareURL(shareData)
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [data, profileImage])

  const handleDownload = useCallback(() => {
    const html = generateStandaloneHTML(data, profileImage)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.name.replace(/\s+/g, '_')}_Resume.html`
    a.click()
    URL.revokeObjectURL(url)
  }, [data, profileImage])

  const handleStartOver = useCallback(() => {
    onReset()
    navigate('/')
  }, [onReset, navigate])

  if (!data) {
    navigate('/')
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-[calc(100vh-3.5rem)] relative z-10"
    >
      {/* Toolbar */}
      <div className="sticky top-14 z-40 backdrop-blur-xl"
        style={{ background: 'rgba(13,17,23,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          <p className="text-xs hidden sm:block font-mono" style={{ color: '#6E7681' }}>
            AI parsing gets you ~90% there
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleCopyLink}
              className="ps-btn-primary text-xs"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Link
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="ps-btn-outline text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={handleStartOver}
              className="ps-btn-outline text-xs"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>

      {sizeWarning && (
        <div className="max-w-6xl mx-auto px-4 mt-3">
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400">
            {sizeWarning}
          </div>
        </div>
      )}

      <VisualResume data={data} profileImage={profileImage} showMatcher={true} />
    </motion.div>
  )
}
