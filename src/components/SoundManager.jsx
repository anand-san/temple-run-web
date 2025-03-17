import { useEffect, useRef, useState } from 'react';
import { loadAudio, soundPaths } from '../assets/sounds-import';

// Sound manager component that handles all game audio
const SoundManager = ({ 
  gameStarted, 
  gameOver, 
  isRunning, 
  isJumping, 
  coinCollected, 
  obstacleAppeared,
  obstacleType
}) => {
  // Audio refs
  const backgroundMusicRef = useRef(null);
  const runningStepsRef = useRef(null);
  const coinPickupRef = useRef(null);
  const goatSoundRef = useRef(null);
  const lionSoundRef = useRef(null);
  const dogSoundRef = useRef(null);

  // Initialize audio elements
  useEffect(() => {
    try {
      console.log("Initializing audio elements");
      
      // Create audio elements using the loadAudio helper
      backgroundMusicRef.current = loadAudio(soundPaths.backgroundMusic);
      runningStepsRef.current = loadAudio(soundPaths.runningSteps);
      coinPickupRef.current = loadAudio(soundPaths.coinPickup);
      goatSoundRef.current = loadAudio(soundPaths.goat);
      lionSoundRef.current = loadAudio(soundPaths.lion);
      dogSoundRef.current = loadAudio(soundPaths.dog);
      
      console.log("Audio elements created", {
        bgMusic: backgroundMusicRef.current,
        steps: runningStepsRef.current,
        coin: coinPickupRef.current,
        goat: goatSoundRef.current,
        lion: lionSoundRef.current,
        dog: dogSoundRef.current
      });

      // Configure audio settings
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.5;
      
      runningStepsRef.current.loop = true;
      runningStepsRef.current.volume = 0.6;
      
      // Preload audio - this can help with playback issues
      coinPickupRef.current.load();
      goatSoundRef.current.load();
      lionSoundRef.current.load();
      dogSoundRef.current.load();
    } catch (error) {
      console.error("Error initializing audio:", error);
    }

    // Cleanup function
    return () => {
      [
        backgroundMusicRef, 
        runningStepsRef, 
        coinPickupRef, 
        goatSoundRef, 
        lionSoundRef, 
        dogSoundRef
      ].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.src = '';
        }
      });
    };
  }, []);

  // Handle background music
  useEffect(() => {
    if (gameStarted && !gameOver) {
      backgroundMusicRef.current?.play().catch(error => {
        console.error("Error playing background music:", error);
      });
    } else {
      backgroundMusicRef.current?.pause();
    }

    return () => {
      backgroundMusicRef.current?.pause();
    };
  }, [gameStarted, gameOver]);

  // Handle running sound
  useEffect(() => {
    if (isRunning && !gameOver) {
      runningStepsRef.current?.play().catch(error => {
        console.error("Error playing running steps:", error);
      });
    } else {
      runningStepsRef.current?.pause();
    }

    return () => {
      runningStepsRef.current?.pause();
    };
  }, [isRunning, gameOver]);

  // Create a direct HTML audio element approach
  useEffect(() => {
    // Add an actual HTML audio element to the DOM
    const audioElement = document.createElement('audio');
    audioElement.id = 'coin-sound';
    audioElement.src = '/sounds/coin_pickup.mp3';
    audioElement.preload = 'auto';
    document.body.appendChild(audioElement);
    
    return () => {
      // Clean up on unmount
      document.body.removeChild(audioElement);
    };
  }, []);
  
  // Handle coin collection sound
  useEffect(() => {
    if (coinCollected) {
      console.log("Attempting to play coin sound via HTML element");
      
      // Get the audio element from the DOM
      const audioElement = document.getElementById('coin-sound');
      
      if (audioElement) {
        // Reset to start
        audioElement.currentTime = 0;
        audioElement.volume = 0.8;
        
        // Force play - this approach often works around browser restrictions
        const playAttempt = audioElement.play();
        
        if (playAttempt !== undefined) {
          playAttempt.catch(error => {
            console.error("Error playing coin sound via HTML element:", error);
            
            // Try a user interaction simulation approach 
            // Create a temporary button, click it, and remove it
            const tempButton = document.createElement('button');
            tempButton.style.display = 'none';
            document.body.appendChild(tempButton);
            
            tempButton.addEventListener('click', () => {
              console.log("Attempting to play through simulated user interaction");
              audioElement.play().catch(e => {
                console.error("Even with simulation, playback failed:", e);
              });
              document.body.removeChild(tempButton);
            });
            
            tempButton.click();
          });
        }
      } else {
        console.error("Coin sound HTML element not found");
      }
    }
  }, [coinCollected]);

  // Handle obstacle sounds
  useEffect(() => {
    if (obstacleAppeared) {
      console.log(`Attempting to play obstacle sound type: ${obstacleType}`);
      
      // Get the sound path based on obstacle type
      let soundPath;
      switch (obstacleType) {
        case 0: // Goat
          soundPath = soundPaths.goat;
          console.log("Selected goat sound");
          break;
        case 1: // Lion
          soundPath = soundPaths.lion;
          console.log("Selected lion sound");
          break;
        case 2: // Dog
          soundPath = soundPaths.dog;
          console.log("Selected dog sound");
          break;
        default:
          console.log(`Unknown obstacle type: ${obstacleType}`);
          return;
      }
      
      // Create a new audio instance each time for better browser compatibility
      try {
        const animalSound = new Audio(soundPath);
        animalSound.volume = 0.6;
        
        // Play the sound immediately
        const playPromise = animalSound.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error(`Error playing obstacle sound type ${obstacleType}:`, error);
          });
        }
      } catch (error) {
        console.error(`Error creating obstacle sound for type ${obstacleType}:`, error);
      }
    }
  }, [obstacleAppeared, obstacleType]);

  // This component doesn't render anything visible
  return null;
};

export default SoundManager;