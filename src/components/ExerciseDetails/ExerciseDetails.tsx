import './ExerciseDetails.css';
import type { Exercise } from '../../types';

interface ExerciseDetailsProps {
  // The props from the old component are no longer needed
  exercise: (Exercise & { icon?: string, desc?: string }) | null;
}

export default function ExerciseDetails({ exercise }: ExerciseDetailsProps) {

  if (!exercise) {
    return (
      <div className="details-container">
        <h2 className="details-title">Detalhes do Exercício</h2>
        <p>Selecione um exercício para ver os detalhes.</p>
      </div>
    );
  }

  const { name, desc, currentBpmRecord, icon = '🎸' } = exercise;
  const targetBpm = Math.round(currentBpmRecord * 1.1);

  return (
    <div className="details-container">
      <div className="details-header">
        <div className="details-icon-container">
          {icon}
        </div>
        <div className="details-title">
          <h3>{name}</h3>
          <p>{desc || 'Foco em clareza e digitação.'}</p>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-box primary">
          <span className="box-label">Atual</span>
          <span className="box-value">{currentBpmRecord} <small>BPM</small></span>
        </div>
        <div className="details-box secondary">
          <span className="box-label">Meta</span>
          <span className="box-value">{targetBpm}</span>
        </div>
      </div>
    </div>
  );
}