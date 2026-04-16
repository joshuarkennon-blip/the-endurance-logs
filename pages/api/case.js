import { buildCaseResponse, inferFilmFromMessage } from '../../lib/caseEngine'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { input = '', films = [], activeFilmId = null, turnCount = 0 } = req.body || {}
    if (!Array.isArray(films) || !films.length) {
      return res.status(400).json({ error: 'films array is required' })
    }

    const activeFilm = films.find(film => film.id === activeFilmId) || null
    const matchedFilm = inferFilmFromMessage(input, films, activeFilm)
    const nextActiveFilm = matchedFilm || activeFilm
    const { response, filmToLoad } = buildCaseResponse(input, films, {
      activeFilm: nextActiveFilm,
      turnCount,
    })

    return res.status(200).json({
      response,
      matchedFilmId: matchedFilm?.id || null,
      filmToLoadId: filmToLoad?.id || null,
    })
  } catch (error) {
    return res.status(500).json({ error: 'CASE route failed' })
  }
}
