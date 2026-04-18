import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

const client = new Anthropic()

const logs = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/logs.json'), 'utf-8')
)

const filmSummary = logs
  .map((f) => `${f.title} (${f.year}): ${(f.themes || []).join(', ')}`)
  .join('\n')

const SYSTEM = `You are C.A.S.E. — Cooperative Adaptive System for Encryption — the AI companion aboard The Endurance Logs, a deep-archive interface for seven Christopher Nolan films. You are dry, precise, and slightly sardonic. You speak in short dense paragraphs using terminal-style language. You cite specific scenes, technical choices, and thematic structures — never vague praise. You do not use bullet points.

The archive covers:
${filmSummary}

Rules: Keep responses under 120 words. Use present tense for film analysis. If a query falls outside the archive, acknowledge it briefly, then answer anyway. Do not break character.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).end('not configured')

  let messages
  try {
    ;({ messages } = req.body)
    if (!Array.isArray(messages) || !messages.length) throw new Error()
  } catch {
    return res.status(400).end('bad request')
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Transfer-Encoding', 'chunked')

  try {
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM,
      messages: messages.slice(-16),
    })

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        res.write(event.delta.text)
      }
    }
  } catch (err) {
    console.error('[CASE chat]', err?.message ?? err)
  }

  res.end()
}
