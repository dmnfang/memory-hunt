import { useState } from 'react'
import SetupScreen from './screens/SetupScreen'
import MemorizeScreen from './screens/MemorizeScreen'
import GameScreen from './screens/GameScreen'
import { buildGrid } from './data.js'

function App() {
  const [screen, setScreen] = useState('setup')
  const [config, setConfig] = useState(null)
  const [cells, setCells] = useState([])

  const handleStart = (cfg) => {
    const grid = buildGrid(cfg.count, cfg.category, cfg.labelType, cfg.ordered, cfg.typeCount)
    setConfig(cfg)
    setCells(grid)
    setScreen('memorize')
  }

  const handleCover = () => setScreen('game')
  const handleBack = () => setScreen('setup')

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {screen === 'setup' && (
        <SetupScreen onStart={handleStart} />
      )}
      {screen === 'memorize' && (
        <MemorizeScreen
          cells={cells}
          config={config}
          onCover={handleCover}
          onBack={handleBack}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          cells={cells}
          onCellsChange={setCells}
          config={config}
          onBack={handleBack}
        />
      )}
    </div>
  )
}

export default App