import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const lines = []
    let currentLine = ''
    let lastY = null

    for (const item of content.items) {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 3) {
        if (currentLine.trim()) lines.push(currentLine.trim())
        currentLine = ''
      }
      currentLine += item.str
      lastY = item.transform[5]
    }
    if (currentLine.trim()) lines.push(currentLine.trim())
    pages.push(lines)
  }

  return pages.flat()
}

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/
const PHONE_RE = /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+\/?/i
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+\/?/i
const WEBSITE_RE = /https?:\/\/(?!.*(?:linkedin|github))[\w.-]+\.\w+[^\s,]*/i

const SECTION_KEYWORDS = {
  summary: /^(?:summary|profile|about\s*me|objective|professional\s*summary)/i,
  experience: /^(?:experience|work\s*experience|employment|professional\s*experience|work\s*history)/i,
  education: /^(?:education|academic|qualifications)/i,
  skills: /^(?:skills|technical\s*skills|core\s*competencies|technologies|tools|proficiencies)/i,
  projects: /^(?:projects|personal\s*projects|portfolio|selected\s*projects)/i,
  certifications: /^(?:certifications?|licenses?|credentials)/i,
}

function detectSectionHeader(line) {
  const cleaned = line.replace(/[:\-–—|]/g, '').trim()
  for (const [section, re] of Object.entries(SECTION_KEYWORDS)) {
    if (re.test(cleaned)) return section
  }
  if (cleaned === cleaned.toUpperCase() && cleaned.length > 2 && cleaned.length < 40 && /[A-Z]/.test(cleaned)) {
    for (const [section, re] of Object.entries(SECTION_KEYWORDS)) {
      if (re.test(cleaned)) return section
    }
  }
  return null
}

function parseContactInfo(lines) {
  const top = lines.slice(0, 10).join(' ')
  return {
    email: top.match(EMAIL_RE)?.[0] || '',
    phone: top.match(PHONE_RE)?.[0] || '',
    linkedin: top.match(LINKEDIN_RE)?.[0] || '',
    github: top.match(GITHUB_RE)?.[0] || '',
    website: top.match(WEBSITE_RE)?.[0] || '',
  }
}

function parseName(lines) {
  for (const line of lines.slice(0, 5)) {
    const cleaned = line.trim()
    if (
      cleaned.length > 1 &&
      cleaned.length < 60 &&
      !EMAIL_RE.test(cleaned) &&
      !PHONE_RE.test(cleaned) &&
      !LINKEDIN_RE.test(cleaned) &&
      !/^[\d(+]/.test(cleaned)
    ) {
      return cleaned
    }
  }
  return 'Unknown'
}

function parseTitle(lines, name) {
  const nameIdx = lines.findIndex(l => l.trim() === name)
  if (nameIdx >= 0) {
    for (let i = nameIdx + 1; i < Math.min(nameIdx + 4, lines.length); i++) {
      const line = lines[i].trim()
      if (
        line.length > 2 &&
        line.length < 80 &&
        !EMAIL_RE.test(line) &&
        !PHONE_RE.test(line) &&
        !LINKEDIN_RE.test(line) &&
        !WEBSITE_RE.test(line) &&
        !GITHUB_RE.test(line) &&
        !detectSectionHeader(line)
      ) {
        return line
      }
    }
  }
  return ''
}

const DATE_RE = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*\.?\s*\d{2,4}|(?:19|20)\d{2}|present|current/gi

function parseExperience(lines) {
  const entries = []
  let current = null

  for (const line of lines) {
    const dates = line.match(DATE_RE)
    const hasDates = dates && dates.length >= 1
    const isBullet = /^[\u2022\u2023\u25E6\u2043\u2219•\-*]\s/.test(line.trim())

    if (hasDates && !isBullet && line.trim().length > 5) {
      if (current) entries.push(current)
      const dateRange = dates.join(' - ')
      const rest = line.replace(DATE_RE, '').replace(/[|–—\-,]+$/g, '').replace(/^[|–—\-,]+/g, '').trim()
      const parts = rest.split(/\s*[|–—@]\s*|\s+at\s+/i)
      current = {
        company: parts[1]?.trim() || parts[0]?.trim() || '',
        role: parts.length > 1 ? parts[0]?.trim() : '',
        dateRange,
        bullets: [],
      }
    } else if (current && (isBullet || (line.trim().length > 10 && !detectSectionHeader(line)))) {
      const bullet = line.trim().replace(/^[\u2022\u2023\u25E6\u2043\u2219•\-*]\s*/, '')
      if (bullet.length > 3) current.bullets.push(bullet)
    }
  }
  if (current) entries.push(current)
  return entries
}

function parseEducation(lines) {
  const entries = []
  let current = null

  for (const line of lines) {
    const dates = line.match(DATE_RE)
    const cleaned = line.trim()

    if (
      (dates || /(?:university|college|school|institute|bachelor|master|ph\.?d|mba|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?)/i.test(cleaned)) &&
      cleaned.length > 5 &&
      !detectSectionHeader(cleaned)
    ) {
      if (current) entries.push(current)
      const dateRange = dates ? dates.join(' - ') : ''
      current = {
        school: cleaned.replace(DATE_RE, '').replace(/[|–—\-,]+$/g, '').trim(),
        degree: '',
        year: dateRange,
      }
    } else if (current && cleaned.length > 3 && !detectSectionHeader(cleaned)) {
      if (!current.degree) {
        current.degree = cleaned
      }
    }
  }
  if (current) entries.push(current)
  return entries
}

function parseSkills(lines) {
  const skills = []
  for (const line of lines) {
    if (detectSectionHeader(line)) continue
    const cleaned = line.trim().replace(/^[\u2022\u2023\u25E6\u2043\u2219•\-*]\s*/, '')
    const items = cleaned.split(/[,;|•]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 50)
    skills.push(...items)
  }
  return [...new Set(skills)]
}

function parseProjects(lines) {
  const projects = []
  let current = null

  for (const line of lines) {
    const cleaned = line.trim()
    const isBullet = /^[\u2022\u2023\u25E6\u2043\u2219•\-*]\s/.test(cleaned)

    if (!isBullet && cleaned.length > 3 && cleaned.length < 100 && !detectSectionHeader(cleaned)) {
      if (current) projects.push(current)
      current = { name: cleaned, description: '', tech: [] }
    } else if (current && cleaned.length > 3) {
      const bullet = cleaned.replace(/^[\u2022\u2023\u25E6\u2043\u2219•\-*]\s*/, '')
      if (/(?:technologies?|tech|tools?|built\s*with|stack)/i.test(bullet)) {
        current.tech = bullet.replace(/(?:technologies?|tech|tools?|built\s*with|stack)\s*:?\s*/i, '')
          .split(/[,;|]/).map(s => s.trim()).filter(Boolean)
      } else {
        current.description += (current.description ? ' ' : '') + bullet
      }
    }
  }
  if (current) projects.push(current)
  return projects
}

export function parseResume(lines) {
  const sections = {}
  let currentSection = null
  let sectionLines = {}

  for (const line of lines) {
    const section = detectSectionHeader(line)
    if (section) {
      currentSection = section
      if (!sectionLines[section]) sectionLines[section] = []
    } else if (currentSection) {
      sectionLines[currentSection].push(line)
    }
  }

  const name = parseName(lines)
  const title = parseTitle(lines, name)
  const contact = parseContactInfo(lines)

  return {
    name,
    title,
    contact,
    summary: (sectionLines.summary || []).join(' ').trim(),
    experience: parseExperience(sectionLines.experience || []),
    education: parseEducation(sectionLines.education || []),
    skills: parseSkills(sectionLines.skills || []),
    projects: parseProjects(sectionLines.projects || []),
    certifications: (sectionLines.certifications || []).filter(l => l.trim().length > 3).map(l => l.trim()),
  }
}
