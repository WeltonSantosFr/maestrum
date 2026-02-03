import React, { useState, useEffect, useCallback } from "react";
import type { Exercise } from "../../types";
import "./ExerciseCard.css";
import "../ExerciseTimer/ExerciseTimer.css";
import { MdEdit, MdDelete, MdDragIndicator } from "react-icons/md";

interface ExerciseCardProps {
  exercise: Exercise & { icon?: string };
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onEdit: (e: React.MouseEvent) => void;
}

const formatTime = (s: number): string => {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

export default function ExerciseCard({
  exercise,
  isActive,
  onClick,
  onDelete,
  onEdit,
}: ExerciseCardProps) {
  const [timeLeft, setTimeLeft] = useState(exercise.durationMinutes);
  const [isRunning, setIsRunning] = useState(false);

  const playAlertSound = useCallback(() => {
    const audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    let count = 0;

    const interval = setInterval(() => {
      if (count >= 3) {
        clearInterval(interval);
        audioCtx.close();
        return;
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(2500, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      
      gainNode.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.01);
      
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.8,
      );

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1);

      count++;
    }, 500);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playAlertSound();
      setTimeout(playAlertSound, 2000)
    }
  }, [timeLeft, isRunning, playAlertSound]);

  useEffect(() => {
    
    setTimeLeft(exercise.durationMinutes);
    setIsRunning(false);
  }, [exercise.durationMinutes]);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && isActive && timeLeft > 0) {
      interval = setInterval(
        () => setTimeLeft((t) => (t > 0 ? t - 1 : 0)),
        1000,
      );
    } else if (!isRunning || !isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isActive]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeLeft(exercise.durationMinutes);
    setIsRunning(false);
  };

  
  const icon = exercise.icon || "🎸";

  return (
    <div
      onClick={onClick}
      className={`exercise-card ${isActive ? "active" : ""}`}
    >
      <div className="card-header">
        <div className="card-info">
          <div className="card-icon"><MdDragIndicator size={24} style={{ cursor: 'grab', color: '#666' }} /></div>
          <div>
            <h3 className="card-title">{exercise.name}</h3>
            {!isActive && (
              <p className="card-desc">
                {Math.floor(exercise.durationMinutes / 60)}m sessão
              </p>
            )}
          </div>
        </div>

        <div className="card-actions">
          <button onClick={onEdit} className="card-action-btn" title="Editar">
            <MdEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="card-action-btn delete"
            title="Excluir"
          >
            <MdDelete />
          </button>
        </div>
      </div>

      <div className="card-timer-container">
        <div
          className="device-body"
          style={{ width: "280px", padding: "15px", borderRadius: "20px" }}
        >
          <div className="lcd-screen" style={{ padding: "5px 15px" }}>
            <div className="pixel-grid-overlay"></div>
            <div className="timer-display-retro" style={{ fontSize: "3.5rem" }}>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="controls-row" style={{ gap: "20px" }}>
            <button onClick={handlePlayPause} className="btn-round">
              {isRunning ? (
                <div className="pause-icon"></div>
              ) : (
                <div className="play-icon"></div>
              )}
            </button>
            <button
              onClick={handleStop}
              className="btn-round"
              style={{ backgroundColor: "#ff8a80" }}
            >
              <div className="stop-square"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
