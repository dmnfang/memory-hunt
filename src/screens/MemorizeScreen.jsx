function MemorizeScreen({ cells, onCover, onBack }) {
  const cols = Math.ceil(Math.sqrt(cells.length * 2))
  const rows = Math.ceil(cells.length / cols)

  return (
    <div className="mode-screen">
      <div className="mode-topbar">
        <button className="nav-btn" onClick={onBack}>Setup</button>
        <div className="topbar-title">Memorize!</div>
        <button className="topbar-action topbar-action-accent" onClick={onCover}>Cover</button>
      </div>

      <div className="grid-stage">
        <div
          className="tile-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {cells.map(cell => (
            <div key={cell.id} className="tile">
              <div className="tile-img">
                <img src={cell.image} alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MemorizeScreen