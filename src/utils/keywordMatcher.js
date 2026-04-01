const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall',
  'can','need','must','that','this','these','those','it','its','we','our',
  'you','your','they','their','them','he','she','his','her','not','no',
  'so','if','as','up','out','about','into','over','after','under','between',
  'through','during','before','above','below','all','each','every','both',
  'few','more','most','other','some','such','than','too','very','just',
  'also','well','back','now','then','here','there','when','where','how',
  'what','which','who','whom','why','able','across','etc','including',
  'within','without','using','per','via','strong','experience','years',
  'work','working','role','position','team','company','job','looking',
  'required','preferred','requirements','qualifications','responsibilities',
  'description','ideal','candidate','opportunity','join','apply',
])

function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-\+\#\.]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}

function extractPhrases(text) {
  const phrases = []
  const lines = text.split(/[.\n;]/)
  for (const line of lines) {
    const words = line.trim().toLowerCase().split(/\s+/).filter(Boolean)
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`
      if (!STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i + 1])) {
        phrases.push(bigram)
      }
    }
  }
  return phrases
}

export function analyzeMatch(jobDescription, resumeData) {
  const resumeText = [
    resumeData.summary || '',
    ...(resumeData.skills || []),
    ...(resumeData.experience || []).flatMap(e => [e.role, e.company, ...e.bullets]),
    ...(resumeData.education || []).flatMap(e => [e.school, e.degree]),
    ...(resumeData.projects || []).flatMap(p => [p.name, p.description, ...(p.tech || [])]),
    ...(resumeData.certifications || []),
  ].filter(Boolean).join(' ').toLowerCase()

  const jdKeywords = [...new Set(extractKeywords(jobDescription))]
  const jdPhrases = [...new Set(extractPhrases(jobDescription))]

  const found = []
  const missing = []

  for (const kw of jdKeywords) {
    if (resumeText.includes(kw)) {
      found.push(kw)
    } else {
      missing.push(kw)
    }
  }

  // Check phrases too - boost score if multi-word matches are found
  let phraseBonus = 0
  for (const phrase of jdPhrases) {
    if (resumeText.includes(phrase)) {
      phraseBonus += 0.5
      if (!found.includes(phrase)) found.push(phrase)
    }
  }

  const total = found.length + missing.length
  const rawScore = total > 0 ? (found.length / total) * 100 : 0
  const score = Math.min(100, Math.round(rawScore + phraseBonus))

  // Deduplicate and limit display
  const uniqueFound = [...new Set(found)].slice(0, 30)
  const uniqueMissing = [...new Set(missing)]
    .filter(m => m.length > 3)
    .slice(0, 20)

  return { score, found: uniqueFound, missing: uniqueMissing }
}
