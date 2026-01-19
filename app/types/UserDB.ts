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

export default UserDB;
