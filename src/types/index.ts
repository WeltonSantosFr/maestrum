export interface Exercise {
  id: string;
  name: string;
  durationMinutes: number;
  currentBpmRecord: number;
  history: { id: string; bpm: number; date: string; exerciseId: string }[];
}
