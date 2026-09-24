import { useState } from 'react'
import { LABEL_TYPES, RANGES, CATEGORIES } from '../data.js'
import './SetupScreen.css'

const TIMER_OPTIONS = [
  { id: '120', label: '2 min', seconds: 120 },
  { id: '180', label: '3 min', seconds: 180 },
  { id: '300', label: '5 min', seconds: 300 },
]

const TIME_GAIN_OPTIONS = [3, 5, 10]
const TIME_LOSS_OPTIONS = [3, 5, 10]

function SetupScreen({ onStart }) {
  const [labelType, setLabelType] = useState('numbers')
  const [rangeId, setRangeId] = useState('20')
  const [category, setCategory] = useState('fruits')
  const [ordered, setOrdered] = useState(true)
  const [typeCount, setTypeCount] = useState(3)
  const [startTime, setStartTime] = useState(120)
  const [timeGain, setTimeGain] = useState(5)
  const [timeLoss, setTimeLoss] = useState(5)

  const ranges = RANGES[labelType]
  const selectedRange = ranges.find(r => r.id === rangeId) || ranges[0]

  const handleLabelType = (id) => {
    setLabelType(id)
    setRangeId(RANGES[id][0].id)
  }

  const handleStart = () => {
    onStart({
      labelType,
      count: selectedRange.count,
      category,
      ordered,
      typeCount,
      startTime,
      timeGain,
      timeLoss,
    })
  }

  return (
    <div className="setup-screen">
      <div className="setup-topbar">
        <div className="setup-breadcrumb">
          <a className="bc-home" href="https://dmnfang.github.io">Home</a>
          <span className="bc-sep">›</span>
          <span className="bc-current">Memory Hunt</span>
        </div>
        <button className="start-btn" onClick={handleStart}>
          Start
        </button>
      </div>

      <div className="setup-body">
        <div className="setup-section">
          <div className="section-label">Label Type</div>
          <div className="chip-row">
            {LABEL_TYPES.map(t => (
              <button
                key={t.id}
                className={`chip ${labelType === t.id ? 'active' : ''}`}
                onClick={() => handleLabelType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <div className="section-label">Range</div>
          <div className="chip-row">
            {ranges.map(r => (
              <button
                key={r.id}
                className={`chip ${rangeId === r.id ? 'active' : ''}`}
                onClick={() => setRangeId(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <div className="section-label">Tile Order</div>
          <div className="chip-row">
            <button
              className={`chip ${ordered ? 'active' : ''}`}
              onClick={() => setOrdered(true)}
            >
              In Order
            </button>
            <button
              className={`chip ${!ordered ? 'active' : ''}`}
              onClick={() => setOrdered(false)}
            >
              Shuffled
            </button>
          </div>
        </div>

        <div className="setup-section">
          <div className="section-label">Image Types</div>
          <div className="chip-row">
            {[2, 3, 4, 5].map(n => (
              <button
                key={n}
                className={`chip ${typeCount === n ? 'active' : ''}`}
                onClick={() => setTypeCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <div className="section-label">Image Category</div>
          <div className="category-grid">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <div className="section-label">Starting Time</div>
          <div className="chip-row">
            {TIMER_OPTIONS.map(t => (
              <button
                key={t.id}
                className={`chip ${startTime === t.seconds ? 'active' : ''}`}
                onClick={() => setStartTime(t.seconds)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <div className="section-label">Time Gained (correct)</div>
          <div className="chip-row">
            {TIME_GAIN_OPTIONS.map(n => (
              <button
                key={n}
                className={`chip ${timeGain === n ? 'active' : ''}`}
                onClick={() => setTimeGain(n)}
              >
                +{n}s
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <div className="section-label">Time Lost (wrong)</div>
          <div className="chip-row">
            {TIME_LOSS_OPTIONS.map(n => (
              <button
                key={n}
                className={`chip ${timeLoss === n ? 'active' : ''}`}
                onClick={() => setTimeLoss(n)}
              >
                -{n}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupScreen