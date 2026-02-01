export interface ExerciseStep {
  name?: string; // Used in Light
  activity?: string; // Used in Moderate/Vigorous
  time: string;
}

export interface Workout {
  id: number;
  title?: string; // From Light
  name?: string; // From Moderate/Vigorous
  label?: string;
  for?: string; // From Light
  intensity?: string; // From Moderate/Vigorous
  duration: string;
  total_exercises?: number;
  exercises: ExerciseStep[];
  rest?: string; // Top-level rest for Mod/Vig
  note?: string;
}
