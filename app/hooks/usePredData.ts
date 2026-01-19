import { useEffect, useState } from "react";
import { getCurrentUserPredData } from "../api/userPredData";
export interface UserPredData {
  id: number;
  user_id: number;
  created_at: string;
  clinical: number;
  lifestyle: number;
  combined: number;
  percent: number;
  uuid: string;
  // Add other columns from your 'users' table here
}
export function usePredData() {
  const [predData, setPredData] = useState<
    UserPredData | UserPredData[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPredData() {
      const data = await getCurrentUserPredData();
      setPredData(data);
      setLoading(false);
    }
    loadPredData();
  }, []);

  return { predData, loading };
}
