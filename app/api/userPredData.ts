import { supabase } from "./client"; // Your supabase client init

export const getCurrentUserPredData = async () => {
  // 1. Get the ID of the authenticated user from the session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("Authenticated user:", user, "Auth error:", authError);
  if (authError || !user) return null;

  // 2. Fetch the specific row from your 'pred' table
  const { data, error } = await supabase
    .from("pred")
    .select("*")
    .eq("uuid", user.id);

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
};
