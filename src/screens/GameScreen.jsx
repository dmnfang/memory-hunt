import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import confetti from 'canvas-confetti'
import { generateQuestion } from '../data.js'
import './GameScreen.css'

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
  const [gameOverReason, setGameOverReason] = useState('') // 'found' | 'timeout'
  const [revealingWrong, setRevealingWrong] = useState(null)
  const [rowHeight, setRowHeight] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.startTime)
  const [popups, setPopups] = useState([])
  const timerRef = useRef(null)
  const wrapRef = useRef(null)

  const cols = Math.ceil(Math.sqrt(cells.length * 2))
  const rows = Math.ceil(cells.length / cols)
  const BOTTOM_CHROME = 168

  useLayoutEffect(() => {
    if (!wrapRef.current) return
    const { width } = wrapRef.current.getBoundingClientRect()
    const totalH = window.innerHeight - BOTTOM_CHROME - 32
    const gap = 8
    const availH = totalH - gap * (rows - 1)
    const availW = width - gap * (cols - 1)
    const byHeight = Math.floor(availH / rows)
    const byWidth = Math.floor(availW / cols)
    setRowHeight(Math.min(byHeight, byWidth))
  }, [cells.length, cols, rows])

  // Start timer
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

  const addTime = (delta) => {
    setTimeLeft(t => Math.max(0, t + delta))
  }

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
    setTimeout(() => {
      setPopups(prev => prev.map(p => p.id === id ? { ...p, dying: true } : p))
    }, 600)
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id))
    }, 1200)
  }

  const flippedCount = cells.filter(c => c.flipped).length
  const isLow = timeLeft <= 10 && !gameOver

  const handleTap = (cellId) => {
    const cell = cells.find(c => c.id === cellId)
    if (!cell || cell.flipped || revealingWrong !== null || gameOver) return

    const target = question[currentIdx]

    if (cell.image === target) {
      const newCells = cells.map(c =>
        c.id === cellId ? { ...c, flipped: true } : c
      )
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
            confetti({ particleCount: 300, spread: 160, origin: { y: 0.5 }, scalar: 2, shapes: ['square'], colors: ['#4AA875','#F5C842','#9B7FD4','#F4896B','#4A8BAD','#E8443A'] })
            setTimeout(() => {
              confetti({ particleCount: 200, spread: 180, origin: { x: 0.1, y: 0.6 }, scalar: 2, shapes: ['square'], colors: ['#4AA875','#F5C842','#9B7FD4'] })
              confetti({ particleCount: 200, spread: 180, origin: { x: 0.9, y: 0.6 }, scalar: 2, shapes: ['square'], colors: ['#F4896B','#4A8BAD','#E8443A'] })
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
    <div className="game-screen">
      <div className="game-grid-wrap" ref={wrapRef}>
        {rowHeight > 0 && (
          <div
            className="game-grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridAutoRows: `${rowHeight}px`,
            }}
          >
            {cells.map(cell => {
              const isRevealing = revealingWrong === cell.id
              return (
                <div
                  key={cell.id}
                  id={`cell-${cell.id}`}
                  className={`game-cell ${cell.flipped ? 'flipped' : ''} ${isRevealing ? 'revealing-wrong' : ''}`}
                  onClick={() => !cell.flipped && handleTap(cell.id)}
                >
                  {cell.flipped || isRevealing ? (
                    <div className="cell-image">
                      <img src={cell.image} alt="" />
                    </div>
                  ) : (
                    <div className="cell-label">{cell.label}</div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating time popups */}
      {popups.map(p => (
        <div
          key={p.id}
          className={`score-popup ${p.seconds > 0 ? 'positive' : 'negative'} ${p.dying ? 'dying' : ''}`}
          style={{ left: p.x, top: p.y }}
        >
          {p.seconds > 0 ? `+${p.seconds}s` : `${p.seconds}s`}
        </div>
      ))}

      {!gameOver && question.length > 0 && (
        <div key={question.join(',')} className={`question-bar ${sliding}`}>
          <div className="question-items">
            {question.map((img, i) => (
              <div
                key={i}
                className={`question-item ${i === currentIdx ? 'active' : i < currentIdx ? 'done' : ''}`}
              >
                <img className="question-img" src={img} alt="" />
                {i < currentIdx && <span className="check">✓</span>}
              </div>
            ))}
          </div>
          <div className={`timer-display ${isLow ? 'low' : ''}`}>
            <div className="score-label">Time</div>
            <div className="score-value">{fmt(timeLeft)}</div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className={`game-over-bar ${gameOverReason === 'timeout' ? 'timeout' : ''}`}>
          <span>{gameOverReason === 'found' ? 'All found!' : "Time's up!"}</span>
          <div className="final-score">
            <div className="score-label">{flippedCount} / {cells.length} found</div>
            <div className="score-value">{fmt(timeLeft)} left</div>
          </div>
        </div>
      )}

      <div className="game-controls">
        <button className="ctrl-btn" onClick={onBack}>Setup</button>
        <div className="found-counter">
          {flippedCount} / {cells.length} found
        </div>
      </div>
    </div>
  )
}

export default GameScreen