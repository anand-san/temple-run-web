// Import all sound files to be used in the SoundManager component

// Define the paths for the sound assets (using the public directory)
const backgroundMusicPath = '/sounds/background_music.mp3';
const runningStepsPath = '/sounds/running_steps.mp3';
const coinPickupPath = '/sounds/coin_pickup.mp3';
const goatSoundPath = '/sounds/trex.mp3'; // Using existing trex.mp3 file
const lionSoundPath = '/sounds/lion.mp3';
const dogSoundPath = '/sounds/chimp.mp3'; // Using existing chimp.mp3 file

// Create a function to load audio when needed
export const loadAudio = (path) => {
  try {
    // Add a cache buster to the URL to prevent caching issues
    const cacheBuster = `?t=${Date.now()}`;
    const audio = new Audio(`${path}${cacheBuster}`);
    
    // Set default properties
    audio.preload = 'auto';
    
    // Return the audio element
    return audio;
  } catch (error) {
    console.error(`Error loading audio from ${path}:`, error);
    return null;
  }
};

// Export sound paths for use in the SoundManager
export const soundPaths = {
  backgroundMusic: backgroundMusicPath,
  runningSteps: runningStepsPath,
  coinPickup: coinPickupPath,
  goat: goatSoundPath,
  lion: lionSoundPath,
  dog: dogSoundPath
};