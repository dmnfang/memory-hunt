import { useState } from 'react'
import { LABEL_TYPES, RANGES, CATEGORIES } from '../data.js'

const TIMER_OPTIONS = [
  { seconds: 120, label: '2 min' },
  { seconds: 180, label: '3 min' },
  { seconds: 300, label: '5 min' },
]

const IMAGE_TYPE_OPTIONS = [2, 3, 4, 5]
const TIME_GAIN_OPTIONS = [3, 5, 10]
const TIME_LOSS_OPTIONS = [3, 5, 10]

function Block({ label, children }) {
  return (
    <div className="settings-block">
      <div className="settings-label">{label}</div>
      <div className="toggle-group">{children}</div>
    </div>
  )
}

function Pill({ active, onClick, children }) {
  return (
    <button className={`toggle-pill ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

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
      <div className="app-header">
        <h1 className="brand-name">Memory Hunt</h1>
        <a className="nav-btn" href="https://dmnfang.github.io">Home</a>
      </div>

      <div className="setup-body">
        <div className="setup-panel setup-panel-content">
          <div className="panel-title">Content Settings</div>
          <div className="settings-scroll">
            <Block label="Label Type">
              {LABEL_TYPES.map(t => (
                <Pill key={t.id} active={labelType === t.id} onClick={() => handleLabelType(t.id)}>
                  {t.label}
                </Pill>
              ))}
            </Block>

            <Block label="Range">
              {ranges.map(r => (
                <Pill key={r.id} active={rangeId === r.id} onClick={() => setRangeId(r.id)}>
                  {r.label}
                </Pill>
              ))}
            </Block>

            <Block label="Tile Order">
              <Pill active={ordered} onClick={() => setOrdered(true)}>In Order</Pill>
              <Pill active={!ordered} onClick={() => setOrdered(false)}>Shuffled</Pill>
            </Block>

            <Block label="Image Types">
              {IMAGE_TYPE_OPTIONS.map(n => (
                <Pill key={n} active={typeCount === n} onClick={() => setTypeCount(n)}>{n}</Pill>
              ))}
            </Block>

            <Block label="Image Category">
              {CATEGORIES.map(cat => (
                <Pill key={cat.id} active={category === cat.id} onClick={() => setCategory(cat.id)}>
                  {cat.label}
                </Pill>
              ))}
            </Block>
          </div>
        </div>

        <div className="setup-panel setup-panel-time">
          <div className="panel-title">Time Settings</div>
          <div className="settings-scroll">
            <Block label="Starting Time">
              {TIMER_OPTIONS.map(t => (
                <Pill key={t.seconds} active={startTime === t.seconds} onClick={() => setStartTime(t.seconds)}>
                  {t.label}
                </Pill>
              ))}
            </Block>

            <Block label="Time Gained (correct)">
              {TIME_GAIN_OPTIONS.map(n => (
                <Pill key={n} active={timeGain === n} onClick={() => setTimeGain(n)}>+{n}s</Pill>
              ))}
            </Block>

            <Block label="Time Lost (wrong)">
              {TIME_LOSS_OPTIONS.map(n => (
                <Pill key={n} active={timeLoss === n} onClick={() => setTimeLoss(n)}>-{n}s</Pill>
              ))}
            </Block>
          </div>

          <button className="launch-btn" onClick={handleStart}>Start</button>
        </div>
      </div>
    </div>
  )
}

export default SetupScreen