import React from "react";
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
  timeLeft: number;
  isRunning: boolean;
  isBreak: boolean;
  onPlayPause: () => void;
  onStop: () => void;
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
  timeLeft,
  isRunning,
  isBreak,
  onPlayPause,
  onStop,
  onClick,
  onDelete,
  onEdit,
}: ExerciseCardProps) {
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayPause();
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStop();
  };

  return (
    <div
      onClick={onClick}
      className={`exercise-card ${isActive ? "active" : ""}`}
    >
      <div className="card-header">
        <div className="card-info">
          <div className="card-icon">
            <MdDragIndicator
              size={24}
              style={{ cursor: "grab", color: "#666" }}
            />
          </div>
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
          style={{ width: "240px", padding: "15px", borderRadius: "20px" }}
        >
          <div className="lcd-screen" style={{ padding: "5px 15px" }}>
            <div className="pixel-grid-overlay"></div>
            <div className="status-indicator">
              {isBreak ? "REST TIME" : isRunning ? "PLAYING" : "READY"}
            </div>
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
