import { useRef, useState, useLayoutEffect } from 'react'
import './MemorizeScreen.css'

function MemorizeScreen({ cells, config, onCover, onBack }) {
  const cols = Math.ceil(Math.sqrt(cells.length * 2))
  const rows = Math.ceil(cells.length / cols)
  const wrapRef = useRef(null)
  const [rowHeight, setRowHeight] = useState(0)

  useLayoutEffect(() => {
    if (!wrapRef.current) return
    const { height, width } = wrapRef.current.getBoundingClientRect()
    const gap = 8
    const availH = height - gap * (rows - 1)
    const availW = width - gap * (cols - 1)
    const byHeight = Math.floor(availH / rows)
    const byWidth = Math.floor(availW / cols)
    setRowHeight(Math.min(byHeight, byWidth))
  }, [cells.length, cols, rows])

  return (
    <div className="memorize-screen">
      <div className="mem-topbar">
        <button className="nav-btn" onClick={onBack}>Setup</button>
        <div className="mem-title">Memorize!</div>
        <button className="cover-btn" onClick={onCover}>Cover</button>
      </div>

      <div className="mem-grid-wrap" ref={wrapRef}>
        {rowHeight > 0 && (
          <div
            className="mem-grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridAutoRows: `${rowHeight}px`,
            }}
          >
            {cells.map(cell => (
              <div key={cell.id} className="mem-cell">
                <div className="mem-cell-img">
                  <img src={cell.image} alt="" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MemorizeScreen