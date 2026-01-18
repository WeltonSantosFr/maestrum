export interface Exercise {
  id: string;
  name: string;
  durationMinutes: number;
  currentBpmRecord: number;
  bpmGoal: number;
  history: { id: string; bpm: number; date: string; exerciseId: string }[];
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface CreateUser {
  username: string;
  email: string;
  password: string;
}
