import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { generateQuestion } from '../data.js'

// CLR palette 500s (confetti can't read CSS variables)
const CONFETTI_ALL  = ['#7CBF57', '#E4B62E', '#9B6BC7', '#E9884F', '#4FA3DE', '#E2685D']
const CONFETTI_LEFT  = ['#7CBF57', '#E4B62E', '#9B6BC7']
const CONFETTI_RIGHT = ['#E9884F', '#4FA3DE', '#E2685D']

let popupId = 0

function fmt(seconds) {
  const s = Math.max(0, seconds)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function GameScreen({ cells, onCellsChange, config, onBack }) {
  const [question, setQuestion] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [sliding, setSliding] = useState('in')
  const [gameOver, setGameOver] = useState(false)
  const [gameOverReason, setGameOverReason] = useState('')
  const [revealingWrong, setRevealingWrong] = useState(null)
  const [timeLeft, setTimeLeft] = useState(config.startTime)
  const [popups, setPopups] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const timerRef = useRef(null)

  const isShapes = config.labelType === 'shapes'
  const cols = Math.ceil(Math.sqrt(cells.length * 2))
  const rows = Math.ceil(cells.length / cols)
  useEffect(() => {
    newQuestion(cells)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setGameOver(true)
          setGameOverReason('timeout')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const addTime = (delta) => setTimeLeft(t => Math.max(0, t + delta))

  const newQuestion = (currentCells) => {
    const q = generateQuestion(currentCells, config.typeCount)
    setQuestion(q)
    setCurrentIdx(0)
    setSliding('in')
  }

  const spawnPopup = (cellId, seconds) => {
    const el = document.getElementById(`cell-${cellId}`)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const id = ++popupId
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    setPopups(prev => [...prev, { id, seconds, x, y, dying: false }])
    setTimeout(() => setPopups(prev => prev.map(p => p.id === id ? { ...p, dying: true } : p)), 600)
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 1200)
  }

  const flippedCount = cells.filter(c => c.flipped).length
  const isLow = timeLeft <= 10 && !gameOver

  const handleTap = (cellId) => {
    const cell = cells.find(c => c.id === cellId)
    if (!cell || cell.flipped || revealingWrong !== null || gameOver) return
    const target = question[currentIdx]

    if (cell.image === target) {
      const newCells = cells.map(c => c.id === cellId ? { ...c, flipped: true } : c)
      onCellsChange(newCells)
      addTime(config.timeGain)
      spawnPopup(cellId, config.timeGain)

      const nextIdx = currentIdx + 1
      if (nextIdx >= question.length) {
        const remaining = newCells.filter(c => !c.flipped)
        if (remaining.length === 0) {
          clearInterval(timerRef.current)
          setGameOver(true)
          setGameOverReason('found')
          setTimeout(() => {
            confetti({ particleCount: 300, spread: 160, origin: { y: 0.5 }, scalar: 2, shapes: ['square'], colors: CONFETTI_ALL })
            setTimeout(() => {
              confetti({ particleCount: 200, spread: 180, origin: { x: 0.1, y: 0.6 }, scalar: 2, shapes: ['square'], colors: CONFETTI_LEFT })
              confetti({ particleCount: 200, spread: 180, origin: { x: 0.9, y: 0.6 }, scalar: 2, shapes: ['square'], colors: CONFETTI_RIGHT })
            }, 400)
          }, 200)
        } else {
          setSliding('out')
          setTimeout(() => newQuestion(newCells), 400)
        }
      } else {
        setCurrentIdx(nextIdx)
      }
    } else {
      addTime(-config.timeLoss)
      spawnPopup(cellId, -config.timeLoss)
      setRevealingWrong(cellId)
      setTimeout(() => setRevealingWrong(null), 1200)
    }
  }

  return (
    <div className="mode-screen">
      <div className="mode-topbar">
        <button className="nav-btn" onClick={onBack}>Setup</button>
        <div className="topbar-title">{flippedCount} / {cells.length} found</div>
        <button className="nav-btn" onClick={toggleFullscreen}>
          {isFullscreen ? 'Exit Full' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid-stage">
        <div
          className="tile-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {cells.map(cell => {
            const isRevealing = revealingWrong === cell.id
            const covered = !cell.flipped && !isRevealing
            const cls = [
              'tile',
              covered && 'covered',
              covered && isShapes && 'is-shape',
              cell.flipped && 'found',
              isRevealing && 'wrong shake',
            ].filter(Boolean).join(' ')
            return (
              <div
                key={cell.id}
                id={`cell-${cell.id}`}
                className={cls}
                onClick={() => !cell.flipped && handleTap(cell.id)}
              >
                {!covered ? (
                  <div className="tile-img"><img src={cell.image} alt="" /></div>
                ) : isShapes ? (
                  <div className="tile-shape"><img src={cell.shapesvg} alt="" /></div>
                ) : (
                  <div className="tile-label">{cell.label}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {popups.map(p => (
        <div
          key={p.id}
          className={`score-popup ${p.seconds > 0 ? 'positive' : 'negative'} ${p.dying ? 'dying' : ''}`}
          style={{ left: p.x, top: p.y }}
        >
          {p.seconds > 0 ? `+${p.seconds}s` : `${p.seconds}s`}
        </div>
      ))}

      <div className="bottom-slot">
        {!gameOver && question.length > 0 && (
          <div key={question.join(',')} className={`question-row ${sliding}`}>
            {question.map((img, i) => (
              <div
                key={i}
                className={`question-item ${i === currentIdx ? 'active' : i < currentIdx ? 'done' : ''}`}
              >
                <img className="question-img" src={img} alt="" />
                {i < currentIdx && <span className="question-check">✓</span>}
              </div>
            ))}
          </div>
        )}

        {!gameOver && (
          <div className="question-bar">
            <div className={`timer ${isLow ? 'low' : ''}`}>{fmt(timeLeft)}</div>
          </div>
        )}

        {gameOver && (
          <div className={`result-bar ${gameOverReason === 'timeout' ? 'timeout' : ''}`}>
            <span className="result-title">{gameOverReason === 'found' ? 'All found!' : "Time's up!"}</span>
            <div className="stat">
              <div className="stat-label">{flippedCount} / {cells.length} found</div>
              <div className="stat-value">{fmt(timeLeft)} left</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameScreen