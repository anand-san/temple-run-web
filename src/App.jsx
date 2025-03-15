import { useState, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'

// Import our game components
import GameScene from './components/GameScene'
import UI from './components/UI'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  
  // Refs for handling mobile controls
  const mobileInputRef = useRef({
    leftPressed: false,
    rightPressed: false,
    jumpPressed: false
  });
  
  // Game event handlers
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
  
  // Handle mobile controls (called from UI component)
  const handleMobileControl = (action) => {
    if (!gameStarted || gameOver) return;
    
    switch(action) {
      case 'left':
        // Set mobile input state for left
        mobileInputRef.current.leftPressed = true;
        // Reset after a short delay (simulating a key press and release)
        setTimeout(() => { 
          mobileInputRef.current.leftPressed = false;
        }, 100);
        break;
        
      case 'right':
        // Set mobile input state for right
        mobileInputRef.current.rightPressed = true;
        // Reset after a short delay
        setTimeout(() => { 
          mobileInputRef.current.rightPressed = false;
        }, 100);
        break;
        
      case 'jump':
        // Set mobile input state for jump
        mobileInputRef.current.jumpPressed = true;
        // Reset after a slightly longer delay
        setTimeout(() => { 
          mobileInputRef.current.jumpPressed = false;
        }, 200);
        break;
        
      default:
        break;
    }
  }

  return (
    <div className="app-container">
      <UI 
        gameStarted={gameStarted} 
        gameOver={gameOver} 
        score={score}
        onStart={startGame}
        onMobileControl={handleMobileControl}
      />
      <Canvas shadows>
        <Suspense fallback={null}>
          <GameScene 
            gameStarted={gameStarted} 
            gameOver={gameOver}
            onGameOver={endGame}
            onScorePoints={addScore}
            mobileInputs={mobileInputRef.current}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
