import React, { useState, useEffect, useMemo } from 'react';
import './Dashboard.css';
import ExerciseCard from '../components/ExerciseCard/ExerciseCard';
import ExerciseDetails from '../components/ExerciseDetails/ExerciseDetails';
import BpmChart from '../components/BpmChart/BpmChart';
import ExerciseModal from '../components/ExerciseModal/ExerciseModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { getExercises, addExercise, updateExercise, deleteExercise } from '../services/api';
import type { Exercise } from '../types';

const Dashboard: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [exerciseToDeleteId, setExerciseToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if(!userId) throw new Error('User ID not found');
        const response = await getExercises(userId);
        setExercises(response.data);
      } catch {
        setError('Failed to fetch exercises');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const selectedEx = useMemo(() =>
    (selectedExercise !== null && exercises.length > 0) ? exercises[selectedExercise] : null,
    [selectedExercise, exercises]
  );
  
  const handleSaveExercise = async (data: Omit<Exercise, 'id' | 'history'> & { id?: string, desc?: string }) => {
    const { desc, ...exerciseData } = data; // Omit 'desc' from the data sent to API

    if (editingExercise) { // Update
      const originalExercises = exercises;
      setExercises(prev => prev.map(ex => ex.id === editingExercise.id ? { ...ex, ...data } : ex));
      try {
        await updateExercise(editingExercise.id, exerciseData);
      } catch (err) {
        console.error(err);
        setError('Failed to update exercise');
        setExercises(originalExercises);
      }
    } else { // Create
      try {
        // Pass exerciseData directly, which does not contain 'history'
        const response = await addExercise(exerciseData);
        setExercises(prev => [...prev, response.data]);
      } catch (err) {
        console.error(err);
        setError('Failed to add exercise');
      }
    }
    setIsModalOpen(false);
    setEditingExercise(null);
  };

  const handleDeleteExercise = (id: string) => {
    setExerciseToDeleteId(id);
    setIsDeleteModalOpen(true);
  };


  const confirmDelete = async () => {
    if (exerciseToDeleteId === null) return;

    const originalExercises = exercises;
    const deletedIndex = originalExercises.findIndex(ex => ex.id === exerciseToDeleteId);
    setExercises(prev => prev.filter(ex => ex.id !== exerciseToDeleteId));

    try {
      await deleteExercise(exerciseToDeleteId);
      if (selectedExercise === deletedIndex) {
        setSelectedExercise(exercises.length > 1 ? 0 : null);
      } else if (selectedExercise !== null && selectedExercise > deletedIndex) {
        setSelectedExercise(selectedExercise - 1);
      }
    } catch (error) {
      setError('Failed to delete exercise');
      setExercises(originalExercises);
    } finally {
        setIsDeleteModalOpen(false);
        setExerciseToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setExerciseToDeleteId(null);
  };

  const openEdit = (ex: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingExercise(ex);
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>MUSIC <span>STUDIO</span></h1>
          <p>Gerenciador de Prática</p>
        </div>
        <button 
          onClick={() => { setEditingExercise(null); setIsModalOpen(true); }}
          className="new-exercise-btn"
        >
          <span>+ NOVO EXERCÍCIO</span>
        </button>
      </header>

      <main className="dashboard-main">
        <section className="left-panel-dash">
          <div className="left-panel-inner custom-scrollbar">
            <div className="playlist-header">
                <h2 className="playlist-title">Sua Playlist</h2>
                <span className="playlist-count">{exercises.length} itens</span>
            </div>
            {exercises.map((ex, index) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                isActive={selectedExercise === index}
                onClick={() => setSelectedExercise(index)}
                onDelete={() => handleDeleteExercise(ex.id)}
                onEdit={(e) => openEdit(ex, e)}
              />
            ))}
          </div>
        </section>

        <section className="right-panel-dash">
          <ExerciseDetails exercise={selectedEx} />
          <BpmChart exercise={selectedEx} />
        </section>
      </main>

      {isModalOpen && (
        <ExerciseModal 
            exercise={editingExercise}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveExercise}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Dashboard;