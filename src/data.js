export const LABEL_TYPES = [
  { id: 'numbers',   label: 'Numbers' },
  { id: 'ordinals',  label: 'Ordinals' },
  { id: 'uppercase', label: 'Uppercase' },
  { id: 'lowercase', label: 'Lowercase' },
  { id: 'mixed',     label: 'Mixed Case' },
  { id: 'shapes',    label: 'Shapes' },
]

export const RANGES = {
  numbers:   [{ id: '10', label: '1 – 10', count: 10 }, { id: '20', label: '1 – 20', count: 20 }, { id: '30', label: '1 – 30', count: 30 }],
  ordinals:  [{ id: '10', label: '1st – 10th', count: 10 }, { id: '20', label: '1st – 20th', count: 20 }, { id: '31', label: '1st – 31st', count: 31 }],
  uppercase: [{ id: '7',  label: 'A – G', count: 7 }, { id: '14', label: 'A – N', count: 14 }, { id: '21', label: 'A – U', count: 21 }, { id: '26', label: 'A – Z', count: 26 }],
  lowercase: [{ id: '7',  label: 'a – g', count: 7 }, { id: '14', label: 'a – n', count: 14 }, { id: '21', label: 'a – u', count: 21 }, { id: '26', label: 'a – z', count: 26 }],
  mixed:     [{ id: '7',  label: 'A–G / a–g', count: 7 }, { id: '14', label: 'A–N / a–n', count: 14 }, { id: '21', label: 'A–U / a–u', count: 21 }, { id: '26', label: 'A–Z / a–z', count: 26 }],
  shapes:    [{ id: '8',  label: '8 Shapes',  count: 8  }, { id: '16', label: '16 Shapes', count: 16 }, { id: '24', label: '24 Shapes', count: 24 }],
}

export const CATEGORIES = [
  { id: 'fruits',     label: 'Fruits',      emoji: '🍎' },
  { id: 'vegetables', label: 'Vegetables',  emoji: '🥕' },
  { id: 'animals',    label: 'Animals',     emoji: '🐶' },
  { id: 'sports',     label: 'Sports',      emoji: '⚽' },
  { id: 'colors',     label: 'Colors',      emoji: '🎨' },
]

export const IMAGE_TYPE_OPTIONS = [2, 3, 4, 5]

export const IMAGES = {
  fruits:     [
    '/memory-hunt/images/fruits/apple.png',
    '/memory-hunt/images/fruits/orange.png',
    '/memory-hunt/images/fruits/peach.png',
    '/memory-hunt/images/fruits/strawberry.png',
    '/memory-hunt/images/fruits/grapes.png',
    '/memory-hunt/images/fruits/lemon.png',
    '/memory-hunt/images/fruits/banana.png',
    '/memory-hunt/images/fruits/watermelon.png',
  ],
  vegetables: [
    '/memory-hunt/images/vegetables/carrot.png',
    '/memory-hunt/images/vegetables/tomato.png',
    '/memory-hunt/images/vegetables/corn.png',
    '/memory-hunt/images/vegetables/potato.png',
    '/memory-hunt/images/vegetables/cucumber.png',
    '/memory-hunt/images/vegetables/onion.png',
    '/memory-hunt/images/vegetables/broccoli.png',
    '/memory-hunt/images/vegetables/green-pepper.png',
  ],
  animals: [
    '/memory-hunt/images/animals/cat.png',
    '/memory-hunt/images/animals/dog.png',
    '/memory-hunt/images/animals/rabbit.png',
    '/memory-hunt/images/animals/bear.png',
    '/memory-hunt/images/animals/elephant.png',
    '/memory-hunt/images/animals/lion.png',
    '/memory-hunt/images/animals/panda.png',
    '/memory-hunt/images/animals/fox.png',
    '/memory-hunt/images/animals/penguin.png',
  ],
  sports: [
    '/memory-hunt/images/sports/soccer.png',
    '/memory-hunt/images/sports/baseball.png',
    '/memory-hunt/images/sports/basketball.png',
    '/memory-hunt/images/sports/tennis.png',
    '/memory-hunt/images/sports/volleyball.png',
    '/memory-hunt/images/sports/badminton.png',
    '/memory-hunt/images/sports/table-tennis.png',
    '/memory-hunt/images/sports/swimming.png',
  ],
  colors: [
    '/memory-hunt/images/colors/red.png',
    '/memory-hunt/images/colors/yellow.png',
    '/memory-hunt/images/colors/pink.png',
    '/memory-hunt/images/colors/green.png',
    '/memory-hunt/images/colors/purple.png',
    '/memory-hunt/images/colors/orange.png',
    '/memory-hunt/images/colors/blue.png',
    '/memory-hunt/images/colors/black.png',
  ],
}

// --- Shapes ---

const SHAPE_NAMES = ['circle', 'diamond', 'square', 'rectangle', 'cross', 'heart', 'star', 'triangle']

const SHAPE_COLORS = {
  red:    '#E8443A',
  yellow: '#F5C842',
  pink:   '#F4896B',
  green:  '#4AA875',
  purple: '#9B7FD4',
  orange: '#F5923A',
  blue:   '#4A8BAD',
}

function makeShapeSVG(shape, color) {
  const c = SHAPE_COLORS[color] || color
  let inner = ''
  switch (shape) {
    case 'circle':
      inner = `<circle cx="40" cy="40" r="34" fill="${c}"/>`
      break
    case 'square':
      inner = `<rect x="8" y="8" width="64" height="64" rx="5" fill="${c}"/>`
      break
    case 'rectangle':
      inner = `<rect x="4" y="18" width="72" height="44" rx="5" fill="${c}"/>`
      break
    case 'diamond':
      inner = `<polygon points="40,4 76,40 40,76 4,40" fill="${c}"/>`
      break
    case 'triangle':
      inner = `<polygon points="40,6 74,72 6,72" fill="${c}"/>`
      break
    case 'cross':
      inner = `<rect x="28" y="6" width="24" height="68" rx="5" fill="${c}"/>
               <rect x="6" y="28" width="68" height="24" rx="5" fill="${c}"/>`
      break
    case 'star':
      inner = `<polygon points="40,4 50,30 78,30 56,48 64,74 40,57 16,74 24,48 2,30 30,30" fill="${c}"/>`
      break
    case 'heart':
      inner = `<path d="M40,70 C40,70 6,50 6,26 C6,15 15,8 25,8 C32,8 38,12 40,17 C42,12 48,8 55,8 C65,8 74,15 74,26 C74,50 40,70 40,70Z" fill="${c}"/>`
      break
    default:
      inner = `<circle cx="40" cy="40" r="34" fill="${c}"/>`
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">${inner}</svg>`
  )}`
}

function buildShapeCombos(count) {
  const all = []
  for (const shape of SHAPE_NAMES) {
    for (const color of Object.keys(SHAPE_COLORS)) {
      all.push({ shape, color })
    }
  }
  return shuffle(all).slice(0, count)
}

export function getLabel(index, type) {
  if (type === 'numbers')   return String(index + 1)
  if (type === 'ordinals')  return ordinal(index + 1)
  if (type === 'uppercase') return String.fromCharCode(65 + index)
  if (type === 'lowercase') return String.fromCharCode(97 + index)
  if (type === 'mixed')     return index % 2 === 0 ? String.fromCharCode(65 + index) : String.fromCharCode(97 + index)
  if (type === 'shapes')    return ''
  return String(index + 1)
}

function ordinal(n) {
  const s = ['th','st','nd','rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildGrid(count, category, labelType, ordered, typeCount) {
  const labels = Array.from({ length: count }, (_, i) => getLabel(i, labelType))
  const assignedLabels = ordered ? [...labels] : shuffle(labels)

  if (labelType === 'shapes') {
    // Each tile gets a unique shape+color combo as its cover
    const combos = buildShapeCombos(count)
    const shuffledCombos = shuffle(combos)
    // Images still come from the selected category
    const imgs = shuffle([...IMAGES[category]]).slice(0, typeCount)
    const repeated = []
    for (let i = 0; i < count; i++) repeated.push(imgs[i % imgs.length])
    const shuffledImgs = shuffle(repeated)

    return shuffledCombos.map((combo, i) => ({
      id: i,
      image: shuffledImgs[i],
      shapesvg: makeShapeSVG(combo.shape, combo.color),
      label: '',
      flipped: false,
    }))
  }

  // Normal mode
  const imgs = shuffle([...IMAGES[category]]).slice(0, typeCount)
  const repeated = []
  for (let i = 0; i < count; i++) repeated.push(imgs[i % imgs.length])
  const shuffledImgs = shuffle(repeated)

  return shuffledImgs.map((img, i) => ({
    id: i,
    image: img,
    label: assignedLabels[i],
    flipped: false,
  }))
}

export function generateQuestion(cells, typeCount) {
  const remaining = cells.filter(c => !c.flipped)
  if (remaining.length === 0) return []
  const size = Math.min(Math.floor(Math.random() * Math.min(typeCount, 4)) + 1, remaining.length)
  return shuffle(remaining).slice(0, size).map(c => c.image)
}