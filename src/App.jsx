import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'

// Import our game components
// We'll create these files next
import GameScene from './components/GameScene'
import UI from './components/UI'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
  }

  const endGame = () => {
    setGameOver(true)
  }

  const addScore = (points) => {
    setScore(prevScore => prevScore + points)
  }

  return (
    <div className="app-container">
      <UI 
        gameStarted={gameStarted} 
        gameOver={gameOver} 
        score={score}
        onStart={startGame}
      />
      <Canvas shadows>
        <Suspense fallback={null}>
          <GameScene 
            gameStarted={gameStarted} 
            gameOver={gameOver}
            onGameOver={endGame}
            onScorePoints={addScore}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
