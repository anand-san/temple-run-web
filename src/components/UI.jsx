import React from 'react';

function UI({ gameStarted, gameOver, score, onStart }) {
  return (
    <div className="ui-container">
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
            <p>Move left: <span className="key">←</span> or <span className="key">A</span></p>
            <p>Move right: <span className="key">→</span> or <span className="key">D</span></p>
            <p>Jump: <span className="key">↑</span> or <span className="key">W</span> or <span className="key">Space</span></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UI;