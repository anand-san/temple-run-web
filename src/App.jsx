import { useState, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'

// Import our game components
import GameScene from './components/GameScene'
import UI from './components/UI'
import SoundManager from './components/SoundManager'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const [coinCollected, setCoinCollected] = useState(false)
  const [obstacleAppeared, setObstacleAppeared] = useState(false)
  const [obstacleType, setObstacleType] = useState(0)
  
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
    setIsRunning(true)
  }

  const endGame = () => {
    setGameOver(true)
    setIsRunning(false)
  }

  const addScore = (points) => {
    setScore(prevScore => prevScore + points)
    
    // Play coin sound using the HTML audio element
    try {
      // Use the HTML audio element from the document
      const coinAudio = document.getElementById('coin-audio');
      if (coinAudio) {
        // Reset the sound
        coinAudio.currentTime = 0;
        coinAudio.volume = 0.7;
        
        // Play it
        coinAudio.play()
          .catch(error => {
            console.error("HTML audio element coin sound failed:", error);
            
            // Fallback to the traditional method
            try {
              const coinSound = new Audio('/sounds/coin_pickup.mp3');
              coinSound.volume = 0.6;
              coinSound.play();
            } catch (fallbackError) {
              console.error("Fallback coin sound failed:", fallbackError);
            }
          });
      } else {
        // Use a direct approach if the element doesn't exist
        const coinSound = new Audio('/sounds/coin_pickup.mp3');
        coinSound.volume = 0.6;
        coinSound.play();
      }
      
      // Also trigger the effect for the SoundManager (as a backup)
      setCoinCollected(prev => !prev);
    } catch (error) {
      console.error('Error playing coin sound in addScore:', error);
    }
  }
  
  const handleJump = () => {
    setIsJumping(true)
    setTimeout(() => setIsJumping(false), 500)
  }
  
  const handleObstacleAppeared = (type) => {
    setObstacleType(type)
    setObstacleAppeared(prev => !prev) // Toggle to trigger effect
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
        // Also trigger jump sound effect
        handleJump();
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
            onJump={handleJump}
            onObstacleAppeared={handleObstacleAppeared}
            mobileInputs={mobileInputRef.current}
          />
        </Suspense>
      </Canvas>
      
      {/* Sound Manager - handles all game audio */}
      <SoundManager
        gameStarted={gameStarted}
        gameOver={gameOver}
        isRunning={isRunning}
        isJumping={isJumping}
        coinCollected={coinCollected}
        obstacleAppeared={obstacleAppeared}
        obstacleType={obstacleType}
      />
    </div>
  )
}

export default App
