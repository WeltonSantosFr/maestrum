import axios from 'axios';
import type { Exercise } from '../types';

const api = axios.create({
  baseURL: 'https://guitaa-api.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getExercises = (userId: string) => api.get('/exercises', { params: { userId } });
export const addExercise = (exerciseData: Partial<Exercise>) => api.post('/exercises', exerciseData);
export const deleteExercise = (exerciseId: string) => api.delete(`/exercises/${exerciseId}`);
export const updateExercise = (exerciseId: string, exerciseData: Partial<Exercise>) => api.patch(`/exercises/${exerciseId}`, exerciseData);

export default api;