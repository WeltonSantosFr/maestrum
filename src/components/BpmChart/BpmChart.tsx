import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './BpmChart.css';
import type { Exercise } from '../../types';

interface BpmChartProps {
  exercise: Exercise | null;
}

export default function BpmChart({ exercise }: BpmChartProps) {

  const chartData = useMemo(() => {
    if (!exercise || !exercise.history || exercise.history.length === 0) {
      return [];
    }
    return exercise.history.map(h => ({ bpm: h.bpm, date: new Date(h.date).toLocaleDateString() }));
  }, [exercise]);

  if (!exercise) {
    // Return a placeholder or null if no exercise is selected
    return (
        <div className="chart-card">
            <h3 className="chart-title">Evolução de Velocidade</h3>
            <p style={{color: '#64748b', textAlign: 'center', fontSize: '0.8rem'}}>Selecione um exercício.</p>
        </div>
    );
  }
  
  return (
    <div className="chart-card">
      <h3 className="chart-title">Evolução de Velocidade</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <XAxis dataKey="date" hide={true} />
            <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide={true} />
            <Tooltip
                contentStyle={{
                    backgroundColor: '#334155',
                    border: 'none',
                    borderRadius: '10px',
                }}
                itemStyle={{color: '#06B6D4'}}
                labelStyle={{ color: '#cbd5e1' }}
            />
            <Line 
              type="monotone" 
              dataKey="bpm" 
              stroke="#06B6D4" 
              strokeWidth={3} 
              dot={{ r: 4, fill: 'white' }}
              activeDot={{ r: 6, fill: 'white' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p style={{color: '#64748b', textAlign: 'center', fontSize: '0.8rem'}}>Sem histórico de BPM para exibir.</p>
      )}
    </div>
  );
}