import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Onboarding4() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/thesis-illus/onboarding4.png")}
        style={styles.image}
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Your Health, Simplified</Text>
        <Text style={styles.description}>
          View your daily progress, streaks, and lifestyle tips — all tailored
          to help you reduce your risk and stay motivated.
        </Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: "100%" }]} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.push("../Auth/Signup")}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", alignItems: "center" },
  image: { width: 375, height: 375, marginTop: 80, resizeMode: "contain" },
  textContainer: { marginTop: 30, width: "100%", paddingHorizontal: 28 },
  title: { color: "#101623", fontSize: 22, fontWeight: "700", textAlign: "left" },
  description: {
    color: "#101623",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "left",
    marginTop: 10,
    lineHeight: 22,
    width: 330,
  },
  progressContainer: {
    width: 219,
    height: 8,
    borderRadius: 9999,
    backgroundColor: "rgba(217, 217, 217, 0.3)",
    marginTop: 30,
  },
  progressBar: { height: "100%", borderRadius: 9999, backgroundColor: "#0B1956" },
  signUpButton: {
    position: "absolute",
    right: 25,
    bottom: 80,
    backgroundColor: "#0B1956",
    width: 134,
    height: 56,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
