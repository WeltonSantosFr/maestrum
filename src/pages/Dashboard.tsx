import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ExerciseList from '../components/ExerciseList/ExerciseList';
import ExerciseDetails from '../components/ExerciseDetails/ExerciseDetails';
import ExerciseHistory from '../components/ExerciseHistory/ExerciseHistory';
import exercisesData from '../exercises.json';
import { useState } from 'react';

interface Exercise {
  id: number;
  nome: string;
  duracao: number;
  bpmRecorde: number;
  historico: { data: string; bpm: number }[];
}

const Dashboard: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>(exercisesData as Exercise[]);

  const handleAddRecord = (bpm: number) => {
    if (selectedExercise !== null) {
      setExercises(prev => prev.map((exercise, index) => 
        index === selectedExercise 
          ? { 
              ...exercise, 
              bpmRecorde: Math.max(exercise.bpmRecorde, bpm),
              historico: [...exercise.historico, { data: new Date().toISOString(), bpm }]
            }
          : exercise
      ));
    }
  };

  const handleUpdateDuration = (newDuration: number) => {
    if (selectedExercise !== null) {
      setExercises(prev => prev.map((exercise, index) => 
        index === selectedExercise 
          ? { ...exercise, duracao: newDuration }
          : exercise
      ));
    }
  };

  const handleAddExercise = (name: string, duration: number, bpm: number) => {
    const newExercise: Exercise = {
      id: Math.max(...exercises.map(e => e.id)) + 1,
      nome: name,
      duracao: duration,
      bpmRecorde: bpm,
      historico: []
    };
    setExercises(prev => [...prev, newExercise]);
  };

  const handleDeleteExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
    // If the deleted exercise was selected, clear selection
    if (selectedExercise === index) {
      setSelectedExercise(null);
    } else if (selectedExercise !== null && selectedExercise > index) {
      // Adjust selected index if it was after the deleted item
      setSelectedExercise(selectedExercise - 1);
    }
  };

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