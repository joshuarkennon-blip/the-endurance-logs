'use client'
import { useRef, useState, useEffect } from 'react'
import { buildCaseResponse, inferFilmFromMessage } from '../lib/caseEngine'
import { mountInterstellarEgg } from '../lib/interstellarEgg'

const CASE_BOOT_LINES = [
  '> initializing C.A.S.E. interface...',
  '> connection established.',
]

const EASTER_EGG_TRIGGERS = [
  'show me the mission',
  'play the mission log',
  'tell me what happened',
  'retell interstellar',
  'show interstellar',
  'mission log',
  'play the logs',
  'log playback',
]

function isEasterEggTrigger(text) {
  const lower = text.toLowerCase()
  return EASTER_EGG_TRIGGERS.some(trigger => lower.includes(trigger))
}

export default function CaseChat({ films, playUI, onLoadFilm, onEggOpen, onEggClose }) {
  const [isActive, setIsActive] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [activeFilm, setActiveFilm] = useState(null)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isActive])

  useEffect(() => {
    if (isActive && inputRef.current) inputRef.current.focus()
  }, [isActive, messages])

  const toggleCase = () => {
    playUI?.('tick')
    if (isActive) {
      setIsActive(false)
      return
    }

    setIsActive(true)
    setMessages(prev => prev.length ? prev : CASE_BOOT_LINES.map(text => ({ role: 'system', text })))
    setTimeout(() => inputRef.current?.focus(), 150)
  }

  const submitPrompt = async (rawText) => {
    const text = rawText.trim()
    if (!text) return

    playUI?.('tick')
    setInput('')
    const turnCount = messages.filter(message => message.role === 'user').length
    let matchedFilm = null
    let filmToLoad = null
    let response = ''

    try {
      const apiResponse = await fetch('/api/case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: text,
          films,
          activeFilmId: activeFilm?.id || null,
          turnCount,
        }),
      })

      if (!apiResponse.ok) throw new Error('CASE API failed')
      const payload = await apiResponse.json()
      response = payload.response || 'No response generated.'
      matchedFilm = films.find(film => film.id === payload.matchedFilmId) || null
      filmToLoad = films.find(film => film.id === payload.filmToLoadId) || null
    } catch {
      matchedFilm = inferFilmFromMessage(text, films, activeFilm)
      const nextActiveFilm = matchedFilm || activeFilm
      const local = buildCaseResponse(text, films, { activeFilm: nextActiveFilm, turnCount })
      response = local.response
      filmToLoad = local.filmToLoad
    }

    if (matchedFilm) setActiveFilm(matchedFilm)

    if (filmToLoad && onLoadFilm) {
      setTimeout(() => onLoadFilm(filmToLoad, { forceReload: true }), 400)
    }

    setMessages(prev => [
      ...prev,
      { role: 'user', text: `> user.query: "${text}"` },
      { role: 'case', text: `> C.A.S.E.:\n${response.split('\n').map(line => `> ${line}`).join('\n')}` },
    ])
    setIsActive(true)

    if (isEasterEggTrigger(text)) {
      setTimeout(() => {
        setIsActive(false)
        mountInterstellarEgg('case-easter-egg', {
          onOpen: onEggOpen,
          onClose: onEggClose,
        })
      }, 900)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submitPrompt(input)
  }

  return (
    <div className={`case-widget ${isActive ? 'case-widget-active' : ''}`} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className="case-toggle"
        onClick={(event) => {
          event.stopPropagation()
          toggleCase()
        }}
        aria-expanded={isActive}
        aria-label="Ask C.A.S.E."
      >
        <span className="case-orb" aria-hidden="true" />
        <span>ASK C.A.S.E.</span>
      </button>

      {isActive && (
        <div className="case-terminal">
          <div ref={scrollRef} className="case-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`case-msg ${message.role}`}>
                {message.text.split('\n').map((line, lineIndex) => (
                  <p key={lineIndex}>{line}</p>
                ))}
              </div>
            ))}
            <form className="case-input" onSubmit={handleSubmit}>
              <label>&gt; Ask C.A.S.E. ::</label>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="input.stream"
                aria-label="Ask C.A.S.E. something"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
