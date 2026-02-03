import React, { useState, useEffect, useMemo } from "react";
import "./Dashboard.css";
import ExerciseDetails from "../components/ExerciseDetails/ExerciseDetails";
import BpmChart from "../components/BpmChart/BpmChart";
import ExerciseModal from "../components/ExerciseModal/ExerciseModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  getExercises,
  addExercise,
  updateExercise,
  deleteExercise,
} from "../services/api";
import type { Exercise } from "../types";
import ExerciseList from "../components/ExerciseList/ExerciseList";

const Dashboard: React.FC = () => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null,
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [exerciseToDeleteId, setExerciseToDeleteId] = useState<string | null>(
    null,
  );

  const loadExercises = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found");
    const response = await getExercises(userId);
    setExercises(response.data);
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");
        const response = await getExercises(userId);
        setExercises(response.data);
      } catch {
        setError("Failed to fetch exercises");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const selectedEx = useMemo(() => {
    if (!selectedExerciseId || exercises.length === 0)
      return exercises[0] || null;
    return exercises.find((ex) => ex.id == selectedExerciseId) || exercises[0];
  }, [selectedExerciseId, exercises]);

  const handleSaveExercise = async (
    data: Omit<Exercise, "id" | "history"> & { id?: string; desc?: string },
  ) => {
    const { desc, ...exerciseData } = data;

    if (editingExercise) {
      const originalExercises = exercises;
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === editingExercise.id ? { ...ex, ...data } : ex,
        ),
      );
      try {
        const response = await updateExercise(editingExercise.id, exerciseData);
        setIsModalOpen(false);
        setEditingExercise(null);

        setTimeout(() => {
          loadExercises();
        }, 500);

        return response.data;
      } catch (err) {
        console.error(err);
        setError("Failed to update exercise");
        setExercises(originalExercises);
      }
    } else {
      try {
        const response = await addExercise(exerciseData);
        setExercises((prev) => [...prev, response.data]);

        setIsModalOpen(false);
        setEditingExercise(null);

        setTimeout(() => {
          loadExercises();
        }, 500);
        return response.data;
      } catch (err) {
        console.error(err);
        setError("Failed to add exercise");
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

    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseToDeleteId));

    try {
      await deleteExercise(exerciseToDeleteId);
      if (selectedExerciseId === exerciseToDeleteId) {
        setSelectedExerciseId(exercises.length > 1 ? exercises[0].id : null);
      } else if (
        selectedExerciseId !== null &&
        selectedExerciseId > exerciseToDeleteId
      ) {
        setSelectedExerciseId(selectedExerciseId);
      }
    } catch (error) {
      setError("Failed to delete exercise");
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
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>MAESTRUM</h1>
          <p>Gerenciador de Prática</p>
        </div>
        <button
          onClick={() => {
            setEditingExercise(null);
            setIsModalOpen(true);
          }}
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
            <ExerciseList
              exercises={exercises}
              selectedExerciseId={selectedExerciseId}
              onSelectExercise={setSelectedExerciseId}
              onDeleteExercise={handleDeleteExercise}
              onEditExercise={openEdit}
            />
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
