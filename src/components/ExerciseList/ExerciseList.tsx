import "react-loading-skeleton/dist/skeleton.css";
import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ExerciseCard from '../ExerciseCard/ExerciseCard';
import type { Exercise } from '../../types';
import Skeleton from 'react-loading-skeleton';

interface ExerciseListProps {
  loading: boolean;
  exercises: Exercise[];
  selectedExerciseId: string | null;
  onSelectExercise: (id: string) => void;
  onDeleteExercise: (id: string) => void;
  onEditExercise: (ex: Exercise, e: React.MouseEvent) => void;
}

const SortableItem = ({ exercise, isActive, onClick, onDelete, onEdit }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = 
    useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'pointer',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ExerciseCard
        exercise={exercise}
        isActive={isActive}
        onClick={onClick}
        onDelete={onDelete}
        onEdit={onEdit}
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
  onEditExercise 
}: ExerciseListProps) {
  const [items, setItems] = useState<Exercise[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const savedOrder = localStorage.getItem('exercise_order');
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
      localStorage.setItem('exercise_order', JSON.stringify(newArray.map(i => i.id)));
    }
  };

  if(loading) {
    return (
      <div className="exercise-list-skeleton">
        {[1, 2, 3, 4, 5].map((item) => (
          <div 
            key={item} 
            style={{ 
              marginBottom: '8px', 
              padding: '1rem', 
              border: '1px solid transparent', 
              borderRadius: '20px',
              backgroundColor: '#ffffffb3'
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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((ex) => (
          <SortableItem
            key={ex.id}
            exercise={ex}
            isActive={selectedExerciseId === ex.id}
            onClick={() => onSelectExercise(ex.id)}
            onDelete={() => onDeleteExercise(ex.id)}
            onEdit={(e: React.MouseEvent) => onEditExercise(ex, e)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}