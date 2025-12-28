import { useState } from 'react';
import './ExerciseDetails.css';

interface Exercise {
  id: number;
  nome: string;
  duracao: number;
  bpmRecorde: number;
  historico: { data: string; bpm: number }[];
}

interface ExerciseDetailsProps {
  exercise: Exercise | null;
  onAddRecord: (bpm: number) => void;
  onUpdateDuration: (duration: number) => void;
}

export default function ExerciseDetails({ exercise, onAddRecord, onUpdateDuration }: ExerciseDetailsProps) {
  const [newBpm, setNewBpm] = useState('');
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [editDuration, setEditDuration] = useState('');

  const handleAddRecord = () => {
    const bpm = parseInt(newBpm);
    if (bpm > 0) {
      onAddRecord(bpm);
      setNewBpm('');
    }
  };

  const handleEditDuration = () => {
    setIsEditingDuration(true);
    setEditDuration(formatTimeForInput(exercise?.duracao || 0));
  };

  const handleSaveDuration = () => {
    const duration = parseTimeToSeconds(editDuration);
    if (duration > 0) {
      onUpdateDuration(duration);
      setIsEditingDuration(false);
      setEditDuration('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingDuration(false);
    setEditDuration('');
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const parseTimeToSeconds = (timeString: string): number => {
    const parts = timeString.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      return minutes * 60 + seconds;
    }
    return parseInt(timeString) || 0;
  };

  const formatTimeForInput = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!exercise) {
    return (
      <div className="exercise-details-card">
        <h2>Detalhes do Exercício</h2>
        <p>Selecione um exercício para ver os detalhes.</p>
      </div>
    );
  }

  return (
    <div className="exercise-details-card">
      <h2>Detalhes do Exercício</h2>
      <div className="detail-item">
        <strong>Nome:</strong> {exercise.nome}
      </div>
      <div className="detail-item">
        <strong>Duração:</strong> 
        {isEditingDuration ? (
          <div className="duration-edit">
            <input
              type="text"
              value={editDuration}
              onChange={(e) => setEditDuration(e.target.value)}
              placeholder="mm:ss"
              pattern="[0-9]+:[0-9]{1,2}"
              autoFocus
            />
            <button onClick={handleSaveDuration}>Salvar</button>
            <button onClick={handleCancelEdit}>Cancelar</button>
          </div>
        ) : (
          <span>
            {formatTime(exercise.duracao)}
            <button onClick={handleEditDuration} className="edit-duration-btn">Editar</button>
          </span>
        )}
      </div>
      <div className="detail-item">
        <strong>Último BPM Record:</strong> {exercise.bpmRecorde}
      </div>
      <div className="add-record">
        <input
          type="number"
          placeholder="Novo BPM"
          value={newBpm}
          onChange={(e) => setNewBpm(e.target.value)}
        />
        <button onClick={handleAddRecord}>Adicionar Record</button>
      </div>
    </div>
  );
}