import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoMain}>glus</Text>
        <Text style={styles.logoAccent}>co</Text>
      </View>

      {/* Headline */}
      <Text style={styles.headline}>
        Predict your risk of diabetes early and take charge of your health.
      </Text>

      {/* Subtext */}
      <Text style={styles.subtext}>
        Let’s make prevention simple and personal.
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => router.push("/Onboarding/onboarding1")}
      >
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>

      {/* Log In Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/Auth/Signin")}
      >
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/Homepage/Dashboard")}
      >
        <Text style={styles.loginText}>Go to Dashboard</Text>
      </TouchableOpacity>
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
    marginBottom: 40,
  },
  logoMain: {
    color: "#0B1956",
    fontSize: 36,
    fontWeight: "700",
    fontFamily: "Montserrat",
  },
  logoAccent: {
    color: "#446CC3",
    fontSize: 36,
    fontWeight: "700",
    fontFamily: "Montserrat",
  },
  headline: {
    color: "#101623",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter",
    textAlign: "center",
    marginHorizontal: 30,
    lineHeight: 27,
  },
  subtext: {
    color: "#717784",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Inter",
    textAlign: "center",
    marginHorizontal: 30,
    marginTop: 15,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  getStartedButton: {
    width: 263,
    height: 56,
    backgroundColor: "#0B1956",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  getStartedText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
  },
  loginButton: {
    width: 263,
    height: 56,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#0B1956",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  loginText: {
    color: "#0B1956",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter",
  },
});
