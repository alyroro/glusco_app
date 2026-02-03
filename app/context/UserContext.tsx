// context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useFormData } from "../hooks/useFormData";
import { useGetAllForms } from "../hooks/useForum";
import { useUserAnalysis } from "../hooks/useGemini";
import { usePredData, UserPredData } from "../hooks/usePredData";
import { useProfile } from "../hooks/useProfile";
import Forum from "../types/ForumDB";
import { AIReport } from "../types/GeminiTypes";
import { FormData, UserDB } from "../types/UserDB";

interface UserContextType {
  profile: UserDB | null;
  loading: boolean;
  predData: UserPredData | UserPredData[] | null;
  predLoading: boolean;
  formData: FormData | FormData[] | null;
  formLoading: boolean;
  forumData: Forum | Forum[] | null;
  forumLoading: boolean;
  analysis: AIReport | null;
  analysisLoading: boolean;
  refreshForumData: () => void;
  // ADD THIS: Function to manually update the profile state
  updateProfile: (updates: Partial<UserDB>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { profile: initialProfile, loading } = useProfile();
  const { predData, loading: predLoading } = usePredData();
  const { formData, loading: formLoading } = useFormData();
  const { forumData, forumLoading, refreshForumData } = useGetAllForms();
  const { analysis, analysisLoading } = useUserAnalysis();
  // 1. Create a local state that we can manipulate
  const [profile, setLocalProfile] = useState<UserDB | null>(null);

  // 2. Sync local state whenever the hook finishes loading the initial data
  useEffect(() => {
    if (initialProfile) {
      setLocalProfile(initialProfile);
    }
  }, [initialProfile]);

  // 3. Function to update state across all pages
  const updateProfile = (updates: Partial<UserDB>) => {
    setLocalProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <UserContext.Provider
      value={{
        profile, // We pass the state, not the hook result
        loading,
        predData,
        predLoading,
        formData,
        formLoading,
        forumData,
        forumLoading,
        analysis,
        analysisLoading,
        refreshForumData,
        updateProfile, // Now other screens can call this
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
