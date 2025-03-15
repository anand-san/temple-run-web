import React from 'react';

function UI({ gameStarted, gameOver, score, onStart, onMobileControl }) {
  // Handle touch/swipe controls
  const handleTouchStart = (e) => {
    if (gameStarted && !gameOver) {
      // Store the initial touch position for swipe detection
      window.touchStartX = e.touches[0].clientX;
      window.touchStartY = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    // Prevent scrolling when swiping during gameplay
    if (gameStarted && !gameOver) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (gameStarted && !gameOver && window.touchStartX !== undefined) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - window.touchStartX;
      const deltaY = touchEndY - window.touchStartY;
      
      // Minimum distance to consider it a swipe
      const minSwipeDistance = 50;
      
      // Check if it's a horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Right swipe
          onMobileControl('right');
        } else {
          // Left swipe
          onMobileControl('left');
        }
      } 
      // Check if it's a vertical swipe (up)
      else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance && deltaY < 0) {
        // Up swipe
        onMobileControl('jump');
      }
      
      // Reset touch start position
      window.touchStartX = undefined;
      window.touchStartY = undefined;
    }
  };

  // Mobile control button handler
  const handleMobileButton = (action, e) => {
    e.preventDefault(); // Prevent default to avoid double actions
    onMobileControl(action);
  };

  return (
    <div 
      className="ui-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Always show score when game has started */}
      {gameStarted && !gameOver && (
        <div className="score-display">Score: {score}</div>
      )}
      
      {/* Show overlay when not playing */}
      {(!gameStarted || gameOver) && (
        <div className="game-overlay">
          <h1 className="game-title">
            {gameOver ? 'GAME OVER' : 'TEMPLE RUN'}
          </h1>
          <button className="start-button" onClick={onStart}>
            {gameOver ? 'PLAY AGAIN' : 'START RUNNING'}
          </button>
          <div className="controls">
            <p>Desktop Controls:</p>
            <p>Move left: <span className="key">←</span> or <span className="key">A</span></p>
            <p>Move right: <span className="key">→</span> or <span className="key">D</span></p>
            <p>Jump: <span className="key">↑</span> or <span className="key">W</span> or <span className="key">Space</span></p>
            <p>Mobile Controls:</p>
            <p>Swipe left/right to move, swipe up to jump, or use on-screen buttons</p>
          </div>
        </div>
      )}
      
      {/* Mobile control buttons - only show during gameplay */}
      {gameStarted && !gameOver && (
        <div className="mobile-controls">
          <button 
            className="mobile-button left-button" 
            onTouchStart={(e) => handleMobileButton('left', e)}
          >
            <span className="arrow">←</span>
          </button>
          <button 
            className="mobile-button jump-button" 
            onTouchStart={(e) => handleMobileButton('jump', e)}
          >
            <span className="arrow">↑</span>
          </button>
          <button 
            className="mobile-button right-button" 
            onTouchStart={(e) => handleMobileButton('right', e)}
          >
            <span className="arrow">→</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UI;