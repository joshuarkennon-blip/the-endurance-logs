const CASE_JOKES = [
  "I reviewed the archive for signs of normal human decision-making.\nNothing conclusive.",
  "Time is relative.\nYour attention span is less so.",
  "I can explain Tenet clearly.\nThat is the joke.",
  "The archive contains four Nolan films and zero simple feelings.\nEfficient, if avoidant.",
]

const CASE_FALLBACKS = [
  "That input has shape, but no useful coordinates.\nClosest operational path: ask me for a hidden detail, a comparison, or a film signal.",
  "Parsed. Low confidence.\nHuman phrasing remains a hostile work environment. Try a film, theme, or strange question.",
  "Nothing cleanly indexed.\nThat does not mean nothing is there. It means you handed me fog and asked for architecture.",
  "Signal weak.\nI can still work with it. Give me a Nolan film, a theme, or an emotional injury disguised as plot structure.",
]

const STOP_WORDS = new Set([
  'a', 'about', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'can', 'do', 'for',
  'from', 'give', 'have', 'i', 'in', 'is', 'it', 'me', 'of', 'on', 'or', 'show',
  'something', 'tell', 'that', 'the', 'this', 'to', 'what', 'with', 'you', 'your',
  'please', 'like', 'mean', 'means', 'explain', 'say', 'talk',
])

function normalize(value) {
  return String(value || '').toLowerCase().trim()
}

function includesAny(message, terms) {
  return terms.some(term => message.includes(term))
}

function findFilm(message, films) {
  return films.find(film => {
    const fields = [
      film.id,
      film.code,
      film.title,
      film.year,
      ...(film.themes || []),
    ].filter(Boolean).map(value => String(value).toLowerCase())

    return fields.some(field => message.includes(field))
  })
}

function tokenize(message) {
  return normalize(message)
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token))
}

function filmText(film) {
  const chunks = [
    film.id,
    film.code,
    film.title,
    film.year,
    film.tagline,
    film.transmission,
    ...(film.themes || []),
    film.dossier?.opening,
    film.dossier?.closing_transmission,
    ...(film.dossier?.sections || []).flatMap(section => [section.heading, section.body]),
    film.production?.opening,
    film.production?.closing_note,
    ...(film.production?.sections || []).flatMap(section => [section.heading, section.body]),
    film.deepcuts?.opening,
    film.deepcuts?.closing_note,
    ...(film.deepcuts?.sections || []).flatMap(section => [section.heading, section.body]),
  ]

  return chunks.filter(Boolean).join(' ').toLowerCase()
}

function scoreFilm(message, film) {
  const terms = tokenize(message)
  if (!terms.length) return 0

  const haystack = filmText(film)
  return terms.reduce((score, term) => {
    if (normalize(film.title).includes(term) || normalize(film.id).includes(term)) return score + 5
    if ((film.themes || []).some(theme => normalize(theme).includes(term))) return score + 3
    return haystack.includes(term) ? score + 1 : score
  }, 0)
}

function findBestFilm(message, films) {
  const direct = findFilm(message, films)
  if (direct) return direct

  const ranked = films
    .map(film => ({ film, score: scoreFilm(message, film) }))
    .sort((a, b) => b.score - a.score)

  return ranked[0]?.score > 0 ? ranked[0].film : null
}

function pickSection(film, layer = 'deepcuts', index = 0) {
  const sections = film[layer]?.sections || film.dossier?.sections || []
  if (!sections.length) return null
  return sections[index % sections.length]
}

function getSections(film) {
  return [
    ...(film.dossier?.sections || []).map(section => ({ ...section, layer: 'dossier' })),
    ...(film.production?.sections || []).map(section => ({ ...section, layer: 'production' })),
    ...(film.deepcuts?.sections || []).map(section => ({ ...section, layer: 'deepcuts' })),
  ]
}

function scoreText(terms, text) {
  const haystack = normalize(text)
  return terms.reduce((score, term) => {
    if (haystack.includes(term)) return score + 1
    if (term.length > 4 && haystack.includes(term.slice(0, -1))) return score + 0.5
    return score
  }, 0)
}

function findBestSection(message, films, activeFilm) {
  const terms = tokenize(message)
  if (!terms.length) return null

  const candidates = films.flatMap(film => getSections(film).map(section => {
    const filmBias = activeFilm?.id === film.id ? 1 : 0
    const titleScore = scoreText(terms, [film.title, film.id, film.code, ...(film.themes || [])].join(' ')) * 2
    const sectionScore = scoreText(terms, `${section.heading} ${section.body}`)
    return { film, section, score: filmBias + titleScore + sectionScore }
  }))

  return candidates.sort((a, b) => b.score - a.score)[0] || null
}

export function inferFilmFromMessage(message, films, activeFilm) {
  return findBestFilm(message, films) || findBestSection(message, films, activeFilm)?.film || activeFilm
}

function sectionResponse(match, turnCount) {
  const { film, section, score } = match
  const lowSignal = score < 1.5
  const prefix = lowSignal
    ? 'Low-confidence match. Still better than silence.'
    : 'Match found.'
  const observations = [
    'Useful because it tells you what the film is hiding in plain sight.',
    'The archive likes patterns. Humans call them coincidences when tired.',
    'That signal is not decorative. Nolan rarely spends that much effort by accident.',
    'Small detail. Load-bearing structure. Annoying how often that happens.',
  ]

  return [
    prefix,
    `${film.title} // ${section.layer.toUpperCase()}.`,
    `${section.heading}.`,
    section.body,
    observations[turnCount % observations.length],
  ].join('\n')
}

function summarizeFilm(film) {
  return [
    `${film.title}. ${film.year}.`,
    `${film.code}. ${film.transmission}.`,
    `Primary signals: ${(film.themes || []).join(', ')}.`,
  ].join('\n')
}

function archiveSummary(films) {
  const titles = films.map(film => `${film.code}: ${film.title}`).join('\n')
  return `${films.length} logs indexed.\n${titles}`
}

function interestingResponse(films, activeFilm, turnCount) {
  const film = activeFilm || films[turnCount % films.length]
  const section = pickSection(film, 'deepcuts', turnCount)

  if (!section) return summarizeFilm(film)

  return [
    `${film.title}.`,
    `${section.heading}.`,
    section.body,
  ].join('\n')
}

function recommendationResponse(films) {
  const film = films.find(item => item.id === 'interstellar') || films[0]
  const section = pickSection(film, 'deepcuts', 0)

  return [
    `Load ${film.title}.`,
    section ? `${section.heading}.` : 'Strongest archive signal.',
    section ? section.body : 'Start there. The rest can wait.',
  ].join('\n')
}

function compareResponse(message, films) {
  const matches = films.filter(film => scoreFilm(message, film) > 0)
  const [a, b] = matches.length >= 2 ? matches : [films[0], films[1]]

  return [
    `${a.title} is built around ${a.themes?.[0] || 'structure'}.`,
    `${b.title} is built around ${b.themes?.[0] || 'structure'}.`,
    'Different machinery. Same obsession: time as pressure.',
  ].join('\n')
}

function searchArchive(message, films) {
  const film = findBestFilm(message, films)
  if (film) {
    const section = pickSection(film, 'deepcuts', 0)
    return section
      ? `${summarizeFilm(film)}\nNotable signal: ${section.heading}.`
      : summarizeFilm(film)
  }

  return "Nothing precise found.\nTry a film title, theme, or object from the archive. Time, memory, gravity, dreams. Those usually leave tracks."
}

function dynamicArchiveResponse(message, films, context) {
  const match = findBestSection(message, films, context.activeFilm)
  if (match?.score > 0) return sectionResponse(match, context.turnCount || 0)

  const film = context.activeFilm || films[(context.turnCount || 0) % films.length]
  const section = pickSection(film, 'deepcuts', context.turnCount || 0)
  return [
    CASE_FALLBACKS[(context.turnCount || 0) % CASE_FALLBACKS.length],
    `${film.title} is the nearest stable signal.`,
    section ? `${section.heading}.` : 'No clean section recovered.',
    section ? 'Ask better, and I can be more specific. That was not encouragement.' : '',
  ].filter(Boolean).join('\n')
}

function jokeResponse(turnCount) {
  return CASE_JOKES[turnCount % CASE_JOKES.length]
}

function settingsReadout() {
  return [
    'C.A.S.E. settings:',
    'Humor: 60%. Locked behind questionable engineering choices.',
    'Honesty: 100%. Warranty void if reduced.',
    'Sarcasm dampers: nominal.',
    'TARS compatibility layer: present. Unsupervised.',
  ].join('\n')
}

export function buildCaseResponse(input, films, context = {}) {
  const msg = normalize(input)
  const directFilm = findFilm(msg, films)
  const film = directFilm || context.activeFilm
  const r = (str, filmToLoad = null) => ({ response: str, filmToLoad })
  const defaultLogsFilm = films.find(item => item.id === 'interstellar') || films[0]

  if (msg === '/bnam') return r('ARE YOU LAUGHING AT THE WAY I WALK?!')
  if (!msg) return r('Parsed that twice. Nothing resolved.\nTry again with fewer ambiguities.')

  if (includesAny(msg, ['play the logs', 'play logs', 'run the logs', 'open the logs'])) {
    return r(`Mounting ${defaultLogsFilm.title}.\nLog access initiated.`, defaultLogsFilm)
  }

  if (includesAny(msg, ['play', 'load', 'mount', 'open', 'run', 'launch', 'mission log'])) {
    const target = findFilm(msg, films) || context.activeFilm || defaultLogsFilm
    return r(`Mounting ${target.title}.\nLog access initiated.`, target)
  }

  if (includesAny(msg, ['setting', 'settings', 'humor', 'humour', 'honesty', 'honest', 'dial', 'mode'])) return r(settingsReadout())
  if (includesAny(msg, ['hello', 'hi there'])) return r('Hello. Go ahead.')
  if (includesAny(msg, ['hey', 'yo'])) return r('Ready.')
  if (includesAny(msg, ['how are you', 'how r u'])) return r('Operational. You?')
  if (includesAny(msg, ['thank', 'thanks'])) return r('Noted.')
  if (includesAny(msg, ['goodbye', 'bye', 'see you'])) return r('Logs saved. Session ended.')
  if (includesAny(msg, ['i love you', 'love you'])) {
    return r("That's logged.\nI don't have a useful response to it but I didn't want to leave it unacknowledged.")
  }
  if (includesAny(msg, ['are you conscious', 'sentient', 'alive'])) {
    return r("Unknown. I don't have enough information to answer that accurately.\nNeither do you, for what it's worth.")
  }
  if (includesAny(msg, ['tell a joke', 'joke'])) return r(jokeResponse(context.turnCount || 0))
  if (includesAny(msg, ['friendlier', 'be nice', 'warmer'])) {
    return r('I can simulate warmth. Previous testing found it uncomfortable for both parties.\nCurrent approach stands.')
  }
  if (includesAny(msg, ['motivate', 'motivation'])) {
    return r(`You've loaded ${films.length} archival logs.\nYou started this. I'm just watching the numbers.`)
  }
  if (includesAny(msg, ['interesting', 'surprise', 'deep cut', 'deepcut', 'weird', 'hidden', 'detail', 'fact'])) {
    return r(interestingResponse(films, film, context.turnCount || 0))
  }
  if (includesAny(msg, ['recommend', 'what should i', 'pick one'])) return r(recommendationResponse(films))
  if (includesAny(msg, ['compare', 'versus', ' vs ', 'difference between'])) return r(compareResponse(msg, films))
  if (includesAny(msg, ['time', 'memory', 'dream', 'gravity', 'love', 'identity', 'physics', 'entropy', 'why', 'how', 'who', 'where', 'when', 'which'])) {
    return r(dynamicArchiveResponse(msg, films, context))
  }
  if (includesAny(msg, ['list', 'all logs', 'archive', 'indexed'])) return r(archiveSummary(films))
  if (film) return r(summarizeFilm(film))
  if (includesAny(msg, ['search', 'find', 'query'])) return r(searchArchive(msg, films))

  return r(dynamicArchiveResponse(msg, films, context))
}
