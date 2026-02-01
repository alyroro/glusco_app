import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { supabase } from "./api/client"; // Adjust this path to your supabase client file

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      // 1. Get the current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // Small delay for the logo
      setTimeout(async () => {
        if (session) {
          // 2. Check if the user has a record in the 'pred' table
          const { data: predData, error: predError } = await supabase
            .from("pred")
            .select("*") // We only need to check if a row exists
            .eq("uuid", session.user.id); // Assuming your FK is named 'user_id'

          if (predData && predData.length > 0 && !predError) {
            // Record exists -> Go to Dashboard
            router.replace("/Homepage/Dashboard");
          } else {
            // No record found -> Force Logout & Redirect
            console.log("No data in 'pred' table. Logging out.");
            await supabase.auth.signOut();
            router.replace("/get-started");
          }
        } else {
          // No session -> Go to Get Started
          console.log("No active session. Redirecting to Get Started.");
          router.replace("/get-started");
        }
      }, 1500);
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoMain}>glus</Text>
        <Text style={styles.logoAccent}>co</Text>
      </View>
      <Text style={styles.subtitle}>Track. Predict. Prevent.</Text>
      <View style={styles.bar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  logoMain: {
    color: "#0B1956",
    fontSize: 50,
    fontWeight: "700",
  },
  logoAccent: {
    color: "#446CC3",
    fontSize: 50,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 10,
    color: "#717784",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  bar: {
    position: "absolute",
    bottom: 15,
    width: 134,
    height: 5,
    backgroundColor: "#000", // Changed to black so it's visible on white bg
    borderRadius: 100,
  },
});
