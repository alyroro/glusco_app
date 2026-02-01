import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

import * as SecureStore from "expo-secure-store";

// Custom storage adapter for Expo
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

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

const supabase_url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabase_anon_key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
// 2. Configure options
const supabase = createClient(supabase_url, supabase_anon_key, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export { supabase };
export default supabase;
