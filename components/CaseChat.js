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

const SESSION_KEY = 'case-session'
const SESSION_CAP = 15
const SESSION_WINDOW_MS = 30 * 60 * 1000

function getCount() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return 0
    const { count, expires } = JSON.parse(raw)
    if (Date.now() > expires) { localStorage.removeItem(SESSION_KEY); return 0 }
    return count ?? 0
  } catch { return 0 }
}

function bump() {
  const next = getCount() + 1
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    count: next,
    expires: Date.now() + SESSION_WINDOW_MS,
  }))
  return next
}

function isEasterEggTrigger(text) {
  const lower = text.toLowerCase()
  return EASTER_EGG_TRIGGERS.some((trigger) => lower.includes(trigger))
}

export default function CaseChat({ films, playUI, onLoadFilm, onEggOpen, onEggClose }) {
  const [isActive, setIsActive] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [activeFilm, setActiveFilm] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const apiMessages = useRef([])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isActive, streamText])

  useEffect(() => {
    if (isActive && !isStreaming && inputRef.current) inputRef.current.focus()
  }, [isActive, isStreaming, messages])

  const toggleCase = () => {
    playUI?.('tick')
    if (isActive) { setIsActive(false); return }
    setIsActive(true)
    setMessages((prev) =>
      prev.length ? prev : CASE_BOOT_LINES.map((text) => ({ role: 'system', text }))
    )
    setTimeout(() => inputRef.current?.focus(), 150)
  }

  const submitPrompt = async (rawText) => {
    const text = rawText.trim()
    if (!text || isStreaming) return

    if (getCount() >= SESSION_CAP) {
      setMessages((prev) => [
        ...prev,
        { role: 'case', text: '> C.A.S.E.:\n> SIGNAL LIMIT REACHED.\n> Session threshold at capacity. Reset window: 30 minutes.' },
      ])
      return
    }

    playUI?.('tick')
    setInput('')
    setIsStreaming(true)
    setStreamText('')

    const turnCount = messages.filter((m) => m.role === 'user').length
    setMessages((prev) => [...prev, { role: 'user', text: `> user.query: "${text}"` }])

    const matchedFilm = inferFilmFromMessage(text, films, activeFilm)
    if (matchedFilm) setActiveFilm(matchedFilm)

    apiMessages.current.push({ role: 'user', content: text })

    let finalText = ''

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages.current }),
      })
      if (!res.ok || !res.body) throw new Error('API failed')

      const reader = res.body.getReader()
      const dec = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        finalText += dec.decode(value, { stream: true })
        setStreamText(finalText)
      }

      apiMessages.current.push({ role: 'assistant', content: finalText })
      setMessages((prev) => [
        ...prev,
        {
          role: 'case',
          text: `> C.A.S.E.:\n${finalText.split('\n').map((l) => `> ${l}`).join('\n')}`,
        },
      ])
      bump()

      const nextActiveFilm = matchedFilm || activeFilm
      const local = buildCaseResponse(text, films, { activeFilm: nextActiveFilm, turnCount })
      if (local.filmToLoad && onLoadFilm) {
        setTimeout(() => onLoadFilm(local.filmToLoad, { forceReload: true }), 400)
      }
    } catch {
      const nextActiveFilm = matchedFilm || activeFilm
      const local = buildCaseResponse(text, films, { activeFilm: nextActiveFilm, turnCount })
      setMessages((prev) => [
        ...prev,
        {
          role: 'case',
          text: `> C.A.S.E.:\n${local.response.split('\n').map((l) => `> ${l}`).join('\n')}`,
        },
      ])
      if (local.filmToLoad && onLoadFilm) {
        setTimeout(() => onLoadFilm(local.filmToLoad, { forceReload: true }), 400)
      }
    } finally {
      setIsStreaming(false)
      setStreamText('')
    }

    if (isEasterEggTrigger(text)) {
      setTimeout(() => {
        setIsActive(false)
        mountInterstellarEgg('case-easter-egg', { onOpen: onEggOpen, onClose: onEggClose })
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
        onClick={(event) => { event.stopPropagation(); toggleCase() }}
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

            {isStreaming && (
              <div className="case-msg case">
                {(streamText
                  ? `> C.A.S.E.:\n${streamText.split('\n').map((l) => `> ${l}`).join('\n')}`
                  : '> C.A.S.E.: [processing...]'
                ).split('\n').map((line, i, arr) => (
                  <p key={i}>{line}{i === arr.length - 1 ? '▋' : ''}</p>
                ))}
              </div>
            )}

            <form className="case-input" onSubmit={handleSubmit}>
              <label>&gt; Ask C.A.S.E. ::</label>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="input.stream"
                aria-label="Ask C.A.S.E. something"
                disabled={isStreaming}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
