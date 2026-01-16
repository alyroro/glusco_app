import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

export const SUPABASE_URL = "https://gvaujsnaspqbtqusdoio.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2YXVqc25hc3BxYnRxdXNkb2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTk3NDksImV4cCI6MjA3NjAzNTc0OX0.D9qphno11fnbjb1uoRU_ykuaQ-qVqKhO55S40yf1C4U";

export const SUPABASE_STORAGE =
  "https://gvaujsnaspqbtqusdoio.supabase.co/storage/v1/object/public/";

// 1. Define a helper to get storage safely
const getStorage = () => {
  // If we are on Web and there is no window (SSR phase), return undefined
  if (Platform.OS === "web" && typeof window === "undefined") {
    return undefined;
  }

  // Otherwise, use AsyncStorage
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@react-native-async-storage/async-storage").default;
};

// 2. Configure options
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: getStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export { supabase };
export default supabase;
