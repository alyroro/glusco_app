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

export default UserDB;