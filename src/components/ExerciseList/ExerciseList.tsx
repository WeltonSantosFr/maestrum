import "react-loading-skeleton/dist/skeleton.css";
import React, { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ExerciseCard from "../ExerciseCard/ExerciseCard";
import type { Exercise } from "../../types";
import Skeleton from "react-loading-skeleton";

interface ExerciseListProps {
  loading: boolean;
  exercises: Exercise[];
  selectedExerciseId: string | null;
  onSelectExercise: (id: string) => void;
  onDeleteExercise: (id: string) => void;
  onEditExercise: (ex: Exercise, e: React.MouseEvent) => void;
  playMode: "simple" | "list";
}

const SortableItem = ({
  exercise,
  isActive,
  onClick,
  onDelete,
  onEdit,
  isBreak,
  isRunning,
  timeLeft,
  onPlayPause,
  onStop,
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "pointer",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ExerciseCard
        exercise={exercise}
        isActive={isActive}
        onClick={onClick}
        onDelete={onDelete}
        onEdit={onEdit}
        isBreak={isBreak}
        isRunning={isRunning}
        timeLeft={timeLeft}
        onPlayPause={onPlayPause}
        onStop={onStop}
      />
    </div>
  );
};

export default function ExerciseList({
  loading,
  exercises,
  selectedExerciseId,
  onSelectExercise,
  onDeleteExercise,
  onEditExercise,
  playMode,
}: ExerciseListProps) {
  const [items, setItems] = useState<Exercise[]>([]);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(
    null,
  );
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const startExercise = useCallback((index: number) => {
    setActiveExerciseIndex(index);
    setTimeLeft(items[index].durationMinutes);
    setIsBreak(false);
    setIsPaused(false);
    onSelectExercise(items[index].id);
  }, [items, onSelectExercise]);

  const playAlertSound = useCallback(() => {
    const audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    let count = 0;

    const interval = setInterval(() => {
      if (count >= 3) {
        clearInterval(interval);
        audioCtx.close();
        return;
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(2500, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      
      gainNode.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.01);
      
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.8,
      );

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1);

      count++;
    }, 500);
  }, []);

  

  useEffect(() => {
    const handleExerciseEnd = () => {
    if (playMode === "list") {
      // Se acabou um exercício e não estamos em descanso, e existe um próximo...
      if (!isBreak && activeExerciseIndex! < items.length - 1) {
        setIsBreak(true);
        setTimeLeft(60); // 1 minuto de descanso
      } 
      // Se acabou o tempo de descanso...
      else if (isBreak) {
        setIsBreak(false); // Importante resetar aqui
        startExercise(activeExerciseIndex! + 1);
      } 
      // Se era o último exercício ou fim da playlist...
      else {
        setActiveExerciseIndex(null);
        setIsBreak(false);
      }
    } else {
      // Modo Simple: Apenas reseta tudo
      setActiveExerciseIndex(null);
      setIsBreak(false);
    }
  };


    let timer: number;
    if (activeExerciseIndex !== null && !isPaused && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && activeExerciseIndex !== null) {
      playAlertSound();
      handleExerciseEnd();
    }
    return () => clearInterval(timer);
  }, [activeExerciseIndex, isPaused, timeLeft, playAlertSound, isBreak, playMode, items.length, startExercise]);

  useEffect(() => {
    const savedOrder = localStorage.getItem("exercise_order");
    if (savedOrder && exercises.length > 0) {
      const idOrder = JSON.parse(savedOrder) as string[];
      const sorted = [...exercises].sort((a, b) => {
        const indexA = idOrder.indexOf(a.id);
        const indexB = idOrder.indexOf(b.id);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
      setItems(sorted);
    } else {
      setItems(exercises);
    }
  }, [exercises]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      const newArray = arrayMove(items, oldIndex, newIndex);
      setItems(newArray);
      localStorage.setItem(
        "exercise_order",
        JSON.stringify(newArray.map((i) => i.id)),
      );
    }
  };

  if (loading) {
    return (
      <div className="exercise-list-skeleton">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            style={{
              marginBottom: "8px",
              padding: "1rem",
              border: "1px solid transparent",
              borderRadius: "20px",
              backgroundColor: "#ffffffb3",
            }}
          >
            {/* Simula o Título do Exercício */}
            <Skeleton height={20} width="70%" />

            {/* Simula detalhes (BPM, etc) */}
            <Skeleton height={14} width="40%" style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((ex, index) => (
          <SortableItem
            key={ex.id}
            exercise={ex}
            isActive={selectedExerciseId === ex.id}
            // Novas props para o controle centralizado:
            timeLeft={
              activeExerciseIndex === index ? timeLeft : ex.durationMinutes
            }
            isRunning={activeExerciseIndex === index && !isPaused}
            isBreak={activeExerciseIndex === index && isBreak}
            onPlayPause={() => {
              if (activeExerciseIndex === index) {
                setIsPaused(!isPaused);
              } else {
                startExercise(index);
              }
            }}
            onStop={() => setActiveExerciseIndex(null)}
            // ... manter as outras props
            onClick={() => onSelectExercise(ex.id)}
            onDelete={() => onDeleteExercise(ex.id)}
            onEdit={(e: React.MouseEvent) => onEditExercise(ex, e)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
