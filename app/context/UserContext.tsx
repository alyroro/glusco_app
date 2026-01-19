// context/UserContext.tsx
import React, { createContext, useContext } from "react";
import { usePredData, UserPredData } from "../hooks/usePredData";
import { useProfile } from "../hooks/useProfile";
import { UserDB } from "../types/UserDB"; // Adjust import based on your types

interface UserContextType {
  profile: UserDB | null;
  loading: boolean;
  predData: UserPredData | UserPredData[] | null;
  predLoading: boolean;
  // You can add a refresh function here if your useProfile hook supports it
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Use your existing hook here
  const { profile, loading } = useProfile();
  const { predData, loading: predLoading } = usePredData();

  return (
    <UserContext.Provider value={{ profile, loading, predData, predLoading }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to consume the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
