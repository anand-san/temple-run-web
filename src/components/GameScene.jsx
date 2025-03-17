import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import Environment from './Environment';
import Player from './Player';
import Road from './Road';
import Obstacle from './Obstacle';
import Coin from './Coin';

const GameScene = ({ gameStarted, gameOver, onGameOver, onScorePoints, onJump, onObstacleAppeared, mobileInputs }) => {
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);
  const [speed, setSpeed] = useState(15);
  const [playerLane, setPlayerLane] = useState(1); // 0: far-left, 1: left, 2: right, 3: far-right
  const [playerJumping, setPlayerJumping] = useState(false);
  const [score, setScore] = useState(0); // Track score internally for speed calculation
  const roadRef = useRef();
  const playerRef = useRef();
  // Use a reference to access the camera
  const cameraRef = useRef();
  
  // Setup keyboard controls
  const { leftPressed, rightPressed, jumpPressed } = useKeyboardControls();
  
  // Combined input detection (keyboard or mobile)
  const inputLeftPressed = leftPressed || (mobileInputs && mobileInputs.leftPressed);
  const inputRightPressed = rightPressed || (mobileInputs && mobileInputs.rightPressed);
  const inputJumpPressed = jumpPressed || (mobileInputs && mobileInputs.jumpPressed);
  
  // Track the key release state to handle one lane change per click
  const keyReleased = useRef({ left: true, right: true });

  // Handle player movement based on combined input (keyboard or mobile)
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    // Only change lane once per input (wait for release between changes)
    if (inputLeftPressed && playerLane > 0 && keyReleased.current.left) {
      setPlayerLane(prev => prev - 1);
      keyReleased.current.left = false; // Mark input as processed
    } else if (inputRightPressed && playerLane < 3 && keyReleased.current.right) {
      setPlayerLane(prev => prev + 1);
      keyReleased.current.right = false; // Mark input as processed
    }
    
    // Reset key released state when input is released
    if (!inputLeftPressed) {
      keyReleased.current.left = true;
    }
    if (!inputRightPressed) {
      keyReleased.current.right = true;
    }
    
    // Handle jumping separately
    if (inputJumpPressed && !playerJumping) {
      setPlayerJumping(true);
      onJump(); // Trigger jump sound
      setTimeout(() => setPlayerJumping(false), 500); // Jump duration
    }
    
  }, [inputLeftPressed, inputRightPressed, inputJumpPressed, gameStarted, gameOver, playerJumping, playerLane]);

  // Generate obstacles randomly
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const obstacleInterval = setInterval(() => {
      const lane = Math.floor(Math.random() * 4); // Now randomly selecting from 4 lanes
      const obstacleType = Math.floor(Math.random() * 3);
      const newObstacle = {
        id: Date.now() + 'obstacle',
        lane,
        position: 100, // Start further ahead (positive value = in front)
        type: obstacleType
      };
      
      setObstacles(prev => [...prev, newObstacle]);
      
      // Trigger animal sound for the appearing obstacle
      onObstacleAppeared(obstacleType);
    }, 2000);
    
    return () => clearInterval(obstacleInterval);
  }, [gameStarted, gameOver]);
  
  // Generate coins randomly
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const coinInterval = setInterval(() => {
      const lane = Math.floor(Math.random() * 4); // Now randomly selecting from 4 lanes
      const newCoin = {
        id: Date.now() + 'coin',
        lane,
        position: 100 // Start further ahead (positive value = in front)
      };
      
      setCoins(prev => [...prev, newCoin]);
    }, 1500);
    
    return () => clearInterval(coinInterval);
  }, [gameStarted, gameOver]);
  
  // Increase speed over time
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const speedInterval = setInterval(() => {
      setSpeed(prev => Math.min(prev + 1, 30)); // Cap speed at 30
    }, 5000);
    
    return () => clearInterval(speedInterval);
  }, [gameStarted, gameOver]);

  // Main game loop
  useFrame((state, delta) => {
    if (!gameStarted || gameOver) return;
    
    // Move road
    if (roadRef.current) {
      // Move road backward to create illusion of forward movement
      roadRef.current.position.z -= speed * delta;
      
      // Reset road position when it gets too far
      // Using a much larger value for seamless looping with the larger road
      if (roadRef.current.position.z < -1990) {
        roadRef.current.position.z = 0;
      }
    }
    
    // Move player to correct lane
    if (playerRef.current) {
      const lanePositions = [3, 1, -1, -3]; // Four lanes: 0=far-left, 1=left, 2=right, 3=far-right
      const targetX = lanePositions[playerLane];
      playerRef.current.position.x += (targetX - playerRef.current.position.x) * 0.3;
    }
    
    // Update obstacles
    setObstacles(prev => {
      return prev
        .map(obstacle => ({
          ...obstacle,
          position: obstacle.position - speed * delta // Move towards player (decreasing position)
        }))
        .filter(obstacle => {
          // Check for collision with player
          if (obstacle.position > -2 && obstacle.position < 2 && obstacle.lane === playerLane && !playerJumping) {
            onGameOver();
            return false;
          }
          
          // Remove obstacles that are behind the player
          return obstacle.position > -20;
        });
    });
    
    // Update coins
    setCoins(prev => {
      return prev
        .map(coin => ({
          ...coin,
          position: coin.position - speed * delta // Move towards player (decreasing position)
        }))
        .filter(coin => {
          // Check for collection
          if (coin.position > -2 && coin.position < 2 && coin.lane === playerLane) {
            // Increase score by 10
            const newScore = score + 10;
            setScore(newScore);
            onScorePoints(10);
            
            // Increase speed based on score with a clear maximum
            const baseSpeed = 15;
            const maxSpeed = 40; // Maximum speed cap
            
            // Calculate speed: start at baseSpeed, increase by 1 for every 30 points
            // but never exceed maxSpeed
            const speedIncrease = Math.min(25, Math.floor(newScore / 30));
            const newSpeed = Math.min(maxSpeed, baseSpeed + speedIncrease);
            
            setSpeed(newSpeed);
            
            return false;
          }
          
          // Remove coins that are behind the player
          return coin.position > -20;
        });
    });
    
    // Update camera to follow player
    if (cameraRef.current) {
      cameraRef.current.position.x = playerRef.current?.position.x * 0.5 || 0;
      // Look at a point in front of the player
      cameraRef.current.lookAt(
        playerRef.current?.position.x || 0, 
        (playerRef.current?.position.y || 0) + 2, 
        (playerRef.current?.position.z || 0) + 10
      );
    }
  });

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault
        position={[0, 5, -10]} 
        fov={75}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 10, 7.5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      
      {/* Scene components */}
      <Environment />
      <Road ref={roadRef} />
      
      {/* Player */}
      <Player 
        ref={playerRef} 
        isJumping={playerJumping} 
        lane={playerLane}
      />
      
      {/* Obstacles */}
      {obstacles.map(obstacle => (
        <Obstacle 
          key={obstacle.id}
          position={[
            [3, 1, -1, -3][obstacle.lane], // Four lane positions
            0.5, 
            obstacle.position // No need to negate, positive is already in front
          ]}
          type={obstacle.type}
        />
      ))}
      
      {/* Coins */}
      {coins.map(coin => (
        <Coin 
          key={coin.id}
          position={[
            [3, 1, -1, -3][coin.lane], // Four lane positions
            1, 
            coin.position // No need to negate, positive is already in front
          ]}
        />
      ))}
    </>
  );
};

export default GameScene;