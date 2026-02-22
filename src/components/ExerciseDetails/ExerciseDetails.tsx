import "react-loading-skeleton/dist/skeleton.css";
import './ExerciseDetails.css';
import type { Exercise } from '../../types';
import Skeleton from 'react-loading-skeleton';

interface ExerciseDetailsProps {
  exercise: (Exercise & { icon?: string, desc?: string }) | null;
  loading: boolean;
}

export default function ExerciseDetails({ exercise, loading }: ExerciseDetailsProps) {

  if (loading) {
    return (
      <div className="details-container">
        <div className="details-header">
          <div style={{ marginRight: '1rem' }}>
            <Skeleton width={64} height={64} style={{ borderRadius: "1.5rem" }}/>
          </div>
          <div className="details-title" style={{ flex: 1 }}>
            <Skeleton height={24} style={{ marginBottom: 8 }} />
            <Skeleton height={16}/>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="details-grid">
          {/* Caixa 1 (Atual) */}
          <div className="details-box primary">
            <Skeleton height={14} style={{ marginBottom: 6 }} />
            <Skeleton height={28} />
          </div>
          {/* Caixa 2 (Meta) */}
          <div className="details-box secondary">
            <Skeleton height={14} style={{ marginBottom: 6 }} />
            <Skeleton height={28} />
          </div>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="details-container">
        <h2 className="details-title">Detalhes do Exercício</h2>
        <p>Selecione um exercício para ver os detalhes.</p>
      </div>
    );
  }

  const { name, desc, currentBpmRecord, bpmGoal, icon = '🎸' } = exercise;
  const targetBpm = bpmGoal
  const isGoalReached = currentBpmRecord >= bpmGoal;

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
        <div className={`details-box primary ${isGoalReached ? 'is-fire' : ''}`}>
          <span className="box-label">
            {isGoalReached && <span className="fire-icon">🔥</span>}
            Atual
          </span>
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