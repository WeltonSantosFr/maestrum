import React, { useState, useEffect, useMemo } from 'react';
import type { Exercise } from '../../types';
import './ExerciseModal.css';

interface ExerciseModalProps {
  exercise: (Exercise & { desc?: string }) | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

const parseTime = (timeString: string): number => {
    const parts = timeString.split(':');
    if (parts.length < 2 || !timeString.includes(':')) return 0;
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseInt(parts[1], 10) || 0;
    return (minutes * 60) + seconds;
}

export default function ExerciseModal({ exercise, onClose, onSave }: ExerciseModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    duration: '02:00',
    currentBpmRecord: 60 as number | string
  });
  
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name || '',
        desc: exercise.desc || '',
        duration: formatTime(exercise.durationMinutes),
        currentBpmRecord: exercise.currentBpmRecord || 60,
      });
    } else {
      setFormData({
        name: '',
        desc: '',
        duration: '01:00',
        currentBpmRecord: 60,
      });
    }
  }, [exercise]);

  useEffect(() => {
    const durationInSeconds = parseTime(formData.duration);
    const bpm = Number(formData.currentBpmRecord);
    const isValid = formData.name.trim() !== '' &&
                    durationInSeconds > 0 &&
                    !isNaN(bpm) && bpm >= 0;
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string for number inputs for better UX
    if (name === 'currentBpmRecord' && value === '') {
        setFormData(prev => ({...prev, currentBpmRecord: ''}));
        return;
    }
    const numValue = name === 'currentBpmRecord' ? parseInt(value, 10) : value;
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    let formatted = rawValue;
    if (rawValue.length > 2) {
        formatted = `${rawValue.slice(0, 2)}:${rawValue.slice(2, 4)}`;
    }
    setFormData(prev => ({ ...prev, duration: formatted }));
  };

  const handleSave = () => {
    if (!isFormValid) {
        alert('Por favor, preencha todos os campos obrigatórios (Título, Duração e BPM).');
        return;
    }
    
    const dataToSave = {
        name: formData.name,
        desc: formData.desc,
        durationMinutes: parseTime(formData.duration),
        currentBpmRecord: Number(formData.currentBpmRecord),
    };
    onSave(dataToSave);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{exercise ? 'Editar Exercício' : 'Novo Exercício'}</h2>
        
        <div className="modal-form">
          <div className="form-group">
            <label>Título</label>
            <input 
              type="text"
              name="name"
              value={formData.name} 
              onChange={handleChange}
              placeholder="Ex: Escala Menor"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Descrição Curta</label>
            <input 
              type="text"
              name="desc"
              value={formData.desc || ''} 
              onChange={handleChange}
              placeholder="Ex: Foco no metrônomo"
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
                <label>BPM Inicial</label>
                <input 
                    type="number"
                    name="currentBpmRecord"
                    value={formData.currentBpmRecord} 
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Duração (mm:ss)</label>
                <input 
                    type="text"
                    name="duration"
                    value={formData.duration} 
                    onChange={handleDurationChange}
                    placeholder="05:00"
                    maxLength={5}
                    required
                />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">Cancelar</button>
          <button onClick={handleSave} disabled={!isFormValid}>Salvar</button>
        </div>
      </div>
    </div>
  );
}