import { useState, useEffect, useCallback, useRef } from 'react';

export const useKeyboardControls = () => {
  const [keys, setKeys] = useState({
    leftPressed: false,
    rightPressed: false,
    jumpPressed: false,
  });
  
  // Use refs to track which keys are actually pressed
  const keysRef = useRef({
    leftPressed: false,
    rightPressed: false,
    jumpPressed: false,
  });
  
  // No cooldown - immediate response
  const handleKeyDown = useCallback((e) => {
    // Prevent default behavior for game controls
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'a', 'd', 'w', ' '].includes(e.key)) {
      e.preventDefault();
    }
    
    // Immediately register keydowns without any cooldown checks
    if ((e.key === 'ArrowLeft' || e.key === 'a') && !keysRef.current.leftPressed) {
      keysRef.current.leftPressed = true;
      setKeys(keys => ({ ...keys, leftPressed: true }));
    } else if ((e.key === 'ArrowRight' || e.key === 'd') && !keysRef.current.rightPressed) {
      keysRef.current.rightPressed = true;
      setKeys(keys => ({ ...keys, rightPressed: true }));
    } else if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && !keysRef.current.jumpPressed) {
      keysRef.current.jumpPressed = true;
      setKeys(keys => ({ ...keys, jumpPressed: true }));
    }
  }, []);
  
  const handleKeyUp = useCallback((e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      keysRef.current.leftPressed = false;
      setKeys(keys => ({ ...keys, leftPressed: false }));
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      keysRef.current.rightPressed = false;
      setKeys(keys => ({ ...keys, rightPressed: false }));
    } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
      keysRef.current.jumpPressed = false;
      setKeys(keys => ({ ...keys, jumpPressed: false }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keys;
};