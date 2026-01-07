import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import ExerciseTimer from '../ExerciseTimer/ExerciseTimer';
import './ExerciseList.css';

interface Exercise {
  id: number;
  nome: string;
  duracao: number;
  bpmRecorde: number;
  historico: { data: string; bpm: number }[];
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function parseTimeToSeconds(timeString: string): number {
  const parts = timeString.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return minutes * 60 + seconds;
  }
  return parseInt(timeString) || 0;
}

interface ExerciseListProps {
  selectedExercise: number | null;
  onSelectExercise: (index: number | null) => void;
  exercises: Exercise[];
  onAddExercise: (name: string, duration: number, bpm: number) => void;
  onDeleteExercise: (index: number) => void;
}

export default function ExerciseList({ selectedExercise, onSelectExercise, exercises, onAddExercise, onDeleteExercise }: ExerciseListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDuration, setNewExerciseDuration] = useState('');
  const [newExerciseBpm, setNewExerciseBpm] = useState('');
  const handleExerciseClick = (index: number) => {
    onSelectExercise(index);
  };

  const handleStop = () => {
    onSelectExercise(null);
  };

  const handleSkip = () => {
    if (selectedExercise !== null) {
      const nextIndex = (selectedExercise + 1) % exercises.length;
      onSelectExercise(nextIndex);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent triggering the exercise selection
    onDeleteExercise(index);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleSaveNewExercise = () => {
    const name = newExerciseName.trim();
    const duration = parseTimeToSeconds(newExerciseDuration);
    const bpm = parseInt(newExerciseBpm);

    if (name && duration > 0 && bpm >= 0) {
      onAddExercise(name, duration, bpm);
      setShowAddModal(false);
      setNewExerciseName('');
      setNewExerciseDuration('');
      setNewExerciseBpm('');
    }
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewExerciseName('');
    setNewExerciseDuration('');
    setNewExerciseBpm('');
  };

  return (
    <div className="exercise-list-card">
      <div className="exercise-list-header">
        <h2>Lista de Exercícios</h2>
        <button onClick={handleAddClick} className="add-exercise-btn">Adicionar Exercício</button>
      </div>
      <div className="exercise-list">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className={`exercise-item ${selectedExercise === index ? 'selected' : ''}`}
            onClick={() => handleExerciseClick(index)}
          >
            <div className="exercise-info">
              <span className="exercise-name">{exercise.nome}</span>
              <span className="exercise-time">{formatTime(exercise.duracao)}</span>
            </div>
            <button 
              onClick={(e) => handleDeleteClick(e, index)} 
              className="delete-exercise-btn"
              title="Excluir exercício"
            >
              <MdClose />
            </button>
          </div>
        ))}
      </div>
      {selectedExercise !== null && (
        <ExerciseTimer
          key={selectedExercise}
          duration={exercises[selectedExercise].duracao}
          onStop={handleStop}
          onSkip={handleSkip}
        />
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Adicionar Novo Exercício</h3>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="exercise-name">Nome do Exercício:</label>
                <input
                  id="exercise-name"
                  type="text"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  placeholder="Ex: Palhetada Alternada 1 nota por corda"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="exercise-duration">Duração (mm:ss):</label>
                <input
                  id="exercise-duration"
                  type="text"
                  value={newExerciseDuration}
                  onChange={(e) => setNewExerciseDuration(e.target.value)}
                  placeholder="1:30"
                  pattern="[0-9]+:[0-9]{1,2}"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exercise-bpm">BPM Inicial:</label>
                <input
                  id="exercise-bpm"
                  type="number"
                  value={newExerciseBpm}
                  onChange={(e) => setNewExerciseBpm(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleCancelAdd} className="cancel-btn">Cancelar</button>
              <button onClick={handleSaveNewExercise} className="save-btn">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}