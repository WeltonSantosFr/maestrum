import { useState, useEffect } from 'react';
import './ExerciseTimer.css';

interface ExerciseTimerProps {
  duration: number; // in seconds
  onStop: () => void;
  onSkip: () => void;
}

const TOTAL_DOTS = 20;

export default function ExerciseTimer({ duration, onStop, onSkip }: ExerciseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playBeep();
            setShowWarning(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  const playBeep = () => {
    const playSingleBeep = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Frequency in Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    // Play three beeps with 0.7 second intervals
    playSingleBeep();
    setTimeout(playSingleBeep, 700);
    setTimeout(playSingleBeep, 1400);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration);
    setShowWarning(false);
    onStop();
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(false);
    setIsPaused(false);
    setShowWarning(false);
    onSkip();
  };


  return (
  <div className="device-container">
    <div className="device-body">
      {/* Tela LCD */}
      <div className="lcd-screen">
        <div className="pixel-grid-overlay"></div>
        <div className="timer-display-retro">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Controles Estilizados */}
      <div className="controls-row">
        <button className="btn-round" onClick={handlePlayPause}>
          <span className={isRunning && !isPaused ? "pause-icon" : "play-icon"}></span>
        </button>
        <button className="btn-round" onClick={handleStop}>
          <div className="stop-square"></div>
        </button>
        <button className="btn-pill" onClick={handleSkip}>
          SKIP
        </button>
      </div>
    </div>

    {showWarning && (
      <div className="warning-popup">
        <p>Time's up!</p>
        <button onClick={() => setShowWarning(false)}>Close</button>
      </div>
    )}
  </div>
);
}