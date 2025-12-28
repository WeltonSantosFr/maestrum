import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ExerciseHistory.css';

interface HistoricoEntry {
  data: string;
  bpm: number;
}

interface Exercise {
  id: number;
  nome: string;
  duracao: number;
  bpmRecorde: number;
  historico: HistoricoEntry[];
}

interface ExerciseHistoryProps {
  exercise: Exercise | null;
}

export default function ExerciseHistory({ exercise }: ExerciseHistoryProps) {
  const [showModal, setShowModal] = useState(false);

  if (!exercise) {
    return (
      <div className="exercise-history-card">
        <h3>Histórico de BPM</h3>
        <p>Selecione um exercício para ver o histórico.</p>
      </div>
    );
  }

  // Filter to last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentHistory = exercise.historico
    .filter(entry => new Date(entry.data) >= thirtyDaysAgo)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .map(entry => ({
      ...entry,
      date: new Date(entry.data).toLocaleDateString()
    }));

  const handleExportData = () => {
    if (exercise.historico.length === 0) return;

    const csvContent = [
      'Data,BPM',
      ...exercise.historico.map(entry => `${entry.data},${entry.bpm}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historico_${exercise.nome.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="exercise-history-card">
      <h3>Histórico de BPM - {exercise.nome}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={recentHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bpm" stroke="#007bff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="history-buttons">
        <button onClick={() => setShowModal(true)}>Ver Todo o Histórico</button>
        <button onClick={handleExportData}>Exportar Dados</button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h4>Todo o Histórico - {exercise.nome}</h4>
            <div className="history-list">
              {exercise.historico.length === 0 ? (
                <p>Nenhum registro encontrado.</p>
              ) : (
                exercise.historico
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                  .map((entry, index) => (
                    <div key={index} className="history-item">
                      <span>{new Date(entry.data).toLocaleDateString()}</span>
                      <span>{entry.bpm} BPM</span>
                    </div>
                  ))
              )}
            </div>
            <button onClick={() => setShowModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}