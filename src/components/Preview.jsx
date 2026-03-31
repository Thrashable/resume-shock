import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--accent:#2563EB}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111;line-height:1.6;-webkit-font-smoothing:antialiased}
.dark body,.dark{background:#030712;color:#f3f4f6}
.container{max-width:48rem;margin:0 auto;padding:2.5rem 1rem;display:flex;flex-direction:column;gap:2.5rem}
.hero{display:flex;align-items:flex-start;gap:1.5rem}
.avatar{width:7rem;height:7rem;border-radius:50%;object-fit:cover;border:4px solid color-mix(in srgb,var(--accent) 30%,transparent)}
.initials{width:7rem;height:7rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.875rem;font-weight:700;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);border:4px solid color-mix(in srgb,var(--accent) 30%,transparent)}
h1{font-size:2rem;font-weight:900}
.title{font-size:1.125rem;color:var(--accent);font-weight:500;margin-top:.25rem}
.contact{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:.75rem;font-size:.875rem;color:#6b7280}
section h2{font-size:1.25rem;font-weight:700;border-bottom:2px solid color-mix(in srgb,var(--accent) 30%,transparent);padding-bottom:.5rem;margin-bottom:1rem}
.pill{display:inline-block;padding:.375rem .75rem;border-radius:9999px;background:color-mix(in srgb,var(--accent) 10%,transparent);color:var(--accent);font-size:.875rem;font-weight:500;margin:.25rem}
.timeline{position:relative;padding-left:1.5rem}
.timeline::before{content:'';position:absolute;left:.5rem;top:.5rem;bottom:.5rem;width:2px;background:color-mix(in srgb,var(--accent) 20%,transparent)}
.entry{position:relative;margin-bottom:2rem}
.dot{position:absolute;left:-1.125rem;top:.375rem;width:.75rem;height:.75rem;border-radius:50%;background:var(--accent);border:4px solid #fff}
.dark .dot{border-color:#030712}
.entry h3{font-weight:700}.entry .company{font-size:.875rem;color:var(--accent);font-weight:500}
.entry .date{font-size:.75rem;color:#9ca3af;margin-top:.125rem}
.entry ul{margin-top:.5rem;list-style:none}
.entry li{font-size:.875rem;color:#4b5563;display:flex;gap:.5rem;margin-bottom:.375rem}
.entry li::before{content:'\\2022';color:var(--accent);margin-top:.125rem;flex-shrink:0}
.card{padding:1rem;border-radius:.75rem;border:1px solid #e5e7eb}
.dark .card{border-color:#1f2937}
.dark h1,.dark h2,.dark h3{color:#fff}
.dark .entry li,.dark p,.dark .contact{color:#d1d5db}
.badge{display:inline-block;padding:.125rem .5rem;border-radius:.25rem;background:#f3f4f6;font-size:.75rem;color:#6b7280;margin:.125rem}
.dark .badge{background:#1f2937;color:#9ca3af}
.grid2{display:grid;grid-template-columns:repeat(auto-fill,minmax(16rem,1fr));gap:1rem}
.footer{text-align:center;padding:2rem;font-size:.75rem;color:#9ca3af}
.footer a{color:var(--accent);text-decoration:none}
@media(max-width:640px){.hero{flex-direction:column;align-items:center;text-align:center}.contact{justify-content:center}}
</style>
</head>
<body${isDark ? ' class="dark"' : ''}>
<div class="container">
<div class="hero">
${profileImage ? `<img class="avatar" src="${profileImage}" alt="${data.name}"/>` : `<div class="initials">${data.name.split(/\\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase()}</div>`}
<div>
<h1>${data.name}</h1>
${data.title ? `<div class="title">${data.title}</div>` : ''}
<div class="contact">
${data.contact.email ? `<span>${data.contact.email}</span>` : ''}
${data.contact.phone ? `<span>${data.contact.phone}</span>` : ''}
${data.contact.linkedin ? `<a href="${data.contact.linkedin.startsWith('http') ? data.contact.linkedin : 'https://'+data.contact.linkedin}" target="_blank">LinkedIn</a>` : ''}
${data.contact.github ? `<a href="${data.contact.github.startsWith('http') ? data.contact.github : 'https://'+data.contact.github}" target="_blank">GitHub</a>` : ''}
${data.contact.website ? `<a href="${data.contact.website}" target="_blank">Website</a>` : ''}
</div>
</div>
</div>
${data.summary ? `<section><h2>Summary</h2><p style="color:#4b5563">${data.summary}</p></section>` : ''}
${data.skills.length ? `<section><h2>Skills</h2><div>${data.skills.map(s=>`<span class="pill">${s}</span>`).join('')}</div></section>` : ''}
${data.experience.length ? `<section><h2>Experience</h2><div class="timeline">${data.experience.map(e=>`<div class="entry"><div class="dot"></div><h3>${e.role||e.company}</h3>${e.role&&e.company?`<div class="company">${e.company}</div>`:''}${e.dateRange?`<div class="date">${e.dateRange}</div>`:''}${e.bullets.length?`<ul>${e.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}</div>`).join('')}</div></section>` : ''}
${data.education.length ? `<section><h2>Education</h2>${data.education.map(e=>`<div class="card" style="margin-bottom:.75rem"><h3>${e.school}</h3>${e.degree?`<p style="font-size:.875rem;color:#4b5563">${e.degree}</p>`:''}${e.year?`<p style="font-size:.75rem;color:#9ca3af;margin-top:.25rem">${e.year}</p>`:''}</div>`).join('')}</section>` : ''}
${data.projects.length ? `<section><h2>Projects</h2><div class="grid2">${data.projects.map(p=>`<div class="card"><h3>${p.name}</h3>${p.description?`<p style="font-size:.875rem;color:#4b5563;margin-top:.25rem">${p.description}</p>`:''}${p.tech.length?`<div style="margin-top:.75rem">${p.tech.map(t=>`<span class="badge">${t}</span>`).join('')}</div>`:''}</div>`).join('')}</div></section>` : ''}
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
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Toolbar */}
      <div className="sticky top-14 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
            AI parsing isn't perfect — but it gets you 90% there
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Copy Share Link
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download HTML
            </button>
            <button
              onClick={handleStartOver}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>

      {sizeWarning && (
        <div className="max-w-6xl mx-auto px-4 mt-3">
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-700 dark:text-yellow-400">
            {sizeWarning}
          </div>
        </div>
      )}

      <VisualResume data={data} profileImage={profileImage} />
    </div>
  )
}
