import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ExerciseList from '../components/ExerciseList/ExerciseList';
import ExerciseDetails from '../components/ExerciseDetails/ExerciseDetails';
import ExerciseHistory from '../components/ExerciseHistory/ExerciseHistory';
import { getExercises, addExercise, deleteExercise, updateExercise } from '../services/api';
import { useState, useEffect } from 'react';
import type { Exercise } from '../types';


const Dashboard: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
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

  const handleAddRecord = (bpm: number) => {
    if (selectedExercise !== null) {
      setExercises(prev => prev.map((exercise, index) =>
        index === selectedExercise
          ? {
              ...exercise,
              currentBpmRecord: Math.max(exercise.currentBpmRecord, bpm),
              history: [...exercise.history, { id: Date.now().toString(), bpm, date: new Date().toISOString(), exerciseId: exercise.id }]
            }
          : exercise
      ));
    }
  };

  const handleUpdateDuration = async (newDuration: number) => {
    if (selectedExercise !== null) {
      const exerciseToUpdate = exercises[selectedExercise];
      const originalExercises = exercises;

      // Optimistic update
      setExercises(prev => prev.map((exercise, index) =>
        index === selectedExercise
          ? { ...exercise, durationMinutes: newDuration }
          : exercise
      ));

      try {
        await updateExercise(exerciseToUpdate.id, { durationMinutes: newDuration });
      } catch (error) {
        console.error('Failed to update duration', error);
        // Rollback on error
        setExercises(originalExercises);
        setError('Failed to update duration');
      }
    }
  };

  const handleAddExercise = async (name: string, duration: number, bpm: number) => {
    try {
      const newExercise = {
        name: name,
        durationMinutes: duration,
        currentBpmRecord: bpm,
      };
      const response = await addExercise(newExercise);
      setExercises(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to add exercise', error);
      setError('Failed to add exercise');
    }
  };

  const handleDeleteExercise = async (index: number) => {
    try {
      const exerciseId = exercises[index].id;
      await deleteExercise(exerciseId);
      setExercises(prev => prev.filter((_, i) => i !== index));
      // If the deleted exercise was selected, clear selection
      if (selectedExercise === index) {
        setSelectedExercise(null);
      } else if (selectedExercise !== null && selectedExercise > index) {
        // Adjust selected index if it was after the deleted item
        setSelectedExercise(selectedExercise - 1);
      }
    } catch (error) {
      console.error('Failed to delete exercise', error);
      setError('Failed to delete exercise');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header/>
      <div className="main-content">
        <div className="left-panel">
          <ExerciseList
            selectedExercise={selectedExercise}
            onSelectExercise={setSelectedExercise}
            exercises={exercises}
            onAddExercise={handleAddExercise}
            onDeleteExercise={handleDeleteExercise}
          />
        </div>
        <div className="right-panel">
          <ExerciseDetails
            exercise={selectedExercise !== null ? exercises[selectedExercise] : null}
            onAddRecord={handleAddRecord}
            onUpdateDuration={handleUpdateDuration}
          />
          <ExerciseHistory
            exercise={selectedExercise !== null ? exercises[selectedExercise] : null}
          />
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Dashboard;