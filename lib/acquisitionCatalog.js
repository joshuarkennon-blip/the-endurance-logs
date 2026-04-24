const TAG = 'theendurancel-20'
const amz = (asin) => `https://www.amazon.com/dp/${asin}?tag=${TAG}`

export const acquisitionFilms = [
  {
    id: 'interstellar',
    title: 'INTERSTELLAR',
    year: '2014',
    color: '#4a7c9e',
    glowColor: '#6ab4dc',
    thumbnail: '🌌',
    formats: [
      { label: '4K UHD — 10th Anniversary Collector\'s Edition', ref: amz('B0DJ1NQJ4Z'), note: 'Costume patches, 5 poster reproductions, storyboard archive from Nolan\'s archives' },
      { label: '4K UHD + Blu-ray — Standard', ref: amz('B0767FCYDW'), note: null },
      { label: 'Blu-ray', ref: amz('B079G9DKH5'), note: null },
    ],
  },
  {
    id: 'inception',
    title: 'INCEPTION',
    year: '2010',
    color: '#7a5c9e',
    glowColor: '#b08cdc',
    thumbnail: '🌀',
    formats: [
      { label: '4K UHD — Ultimate Collector\'s Steelbook', ref: amz('B0F4LYPGKD'), note: 'New key art, theatrical poster, collector\'s cards, 3-disc set' },
      { label: '4K UHD + Blu-ray — Standard', ref: amz('B078SGL6L7'), note: null },
      { label: 'Blu-ray', ref: amz('B077NZKJLN'), note: null },
    ],
  },
  {
    id: 'tenet',
    title: 'TENET',
    year: '2020',
    color: '#9e5c4a',
    glowColor: '#dc8c6a',
    thumbnail: '⏳',
    formats: [
      { label: '4K UHD + Blu-ray + Digital', ref: amz('B08KQ4D48D'), note: null },
      { label: 'Blu-ray', ref: amz('B08GGH9ZFS'), note: null },
    ],
  },
  {
    id: 'memento',
    title: 'MEMENTO',
    year: '2000',
    color: '#4a9e5c',
    glowColor: '#6adc8c',
    thumbnail: '📸',
    formats: [
      { label: 'Blu-ray', ref: amz('B000FJGWBM'), note: 'No standalone 4K release — best physical edition available' },
      { label: 'Blu-ray — 10th Anniversary', ref: amz('B004FHCH96'), note: 'Special edition with director commentary' },
    ],
  },
  {
    id: 'batman-begins',
    title: 'BATMAN BEGINS',
    year: '2005',
    color: '#6b6f78',
    glowColor: '#9ca3b0',
    thumbnail: '🦇',
    formats: [
      { label: '4K UHD + Blu-ray — Standard', ref: amz('B07G2CJNHD'), note: null },
      { label: 'Blu-ray', ref: amz('B001DD4B32'), note: 'Included in multiple trilogy box sets' },
    ],
  },
  {
    id: 'the-dark-knight',
    title: 'THE DARK KNIGHT',
    year: '2008',
    color: '#4a5a74',
    glowColor: '#88a9d6',
    thumbnail: '🃏',
    formats: [
      { label: '4K UHD + Blu-ray — Standard', ref: amz('B07G2CFY4P'), note: null },
      { label: 'Blu-ray', ref: amz('B0016F9KQQ'), note: 'Best known for IMAX-expanded sequences' },
    ],
  },
  {
    id: 'the-dark-knight-rises',
    title: 'THE DARK KNIGHT RISES',
    year: '2012',
    color: '#6e5b4a',
    glowColor: '#c9a27f',
    thumbnail: '🔥',
    formats: [
      { label: '4K UHD + Blu-ray — Standard', ref: amz('B07G2CS4GL'), note: null },
      { label: 'Blu-ray', ref: amz('B008R9J5OC'), note: null },
    ],
  },
  {
    id: 'collection',
    title: 'FULL NOLAN COLLECTION',
    year: 'All Films',
    color: '#7a7a9e',
    glowColor: '#aaaacf',
    thumbnail: '◈',
    formats: [
      { label: '8-Film 4K Collection', ref: amz('B0FGWN3ZF3'), note: 'Memento, Insomnia, Batman Begins, The Dark Knight, Inception, The Dark Knight Rises, Interstellar, Dunkirk — best value' },
      { label: '6-Film 4K Collection', ref: amz('B077MYFX8K'), note: 'Christopher Nolan 4K box set' },
    ],
  },
]
