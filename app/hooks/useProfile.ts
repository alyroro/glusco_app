import { useEffect, useState } from "react";
import { getCurrentUserProfile } from "../api/userService";
export interface UserProfile {
  id: string;
  username: string;
  name: string;
  profile_picture: string;
  followers: number;
  following: number;
  created_at: string;
  role: string;
  email: string;
  // Add other columns from your 'users' table here
}
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const data = await getCurrentUserProfile();
      setProfile(data as UserProfile);
      setLoading(false);
    }
    loadProfile();
  }, []);

  return { profile, loading };
}
