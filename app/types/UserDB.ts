export interface UserDB {
  id: string;
  email: string;
  username?: string;
  name?: string;
  profile_picture?: string;
  followers: number;
  following: number;
  created_at: string;
  role: string;
}

export interface PredictionData {
  clinical: number;
  lifestyle: number;
  combined: number;
  percent: number;
}

export interface FormData {
  id: number;
  uuid: string;
  user_id: number;
  inserted_at: string;
  username: string;
  age: string;
  gender: number;
  height: string;
  weight: string;
  waist: string;
  hip: string;
  systolic: string;
  diastolic: string;
  hba1c: string;
  fbs: string;
  cholesterol: string;
  hdl: string;

  fruits: number;
  vegetables: number;
  fried: number;
  sweets: number;
  fastfood: number;
  processed: number;
  softdrink: number;
  weight_concern: number;

  exercise_times: number;
  exercise_duration: number;
  exercise_types?: string[];
  sitting: number;
  main_activity: number;
  mode_of_transpo: number;
  doesExercise: number | null;

  sleep_hours: number;
  sleep_cigarette: number;
  sleep_alcohol: number;

  fh_father: number;
  fh_mother: number;
  fh_sister: number;
  fh_brother: number;
  fh_extended: number;
}

export default UserDB;
