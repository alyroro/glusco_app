import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Onboarding2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/thesis-illus/onboarding2.png")}
        style={styles.image}
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Extract Data with Your Camera</Text>
        <Text style={styles.description}>
          Simply snap a photo of your medical records or lab results — our AI
          automatically reads and interprets key health information for you.
        </Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: "50%" }]} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push("/Onboarding/onboarding3")}
      >
        <Text style={styles.nextButtonText}>Next →</Text>
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
  nextButton: {
    position: "absolute",
    right: 25,
    bottom: 80,
    backgroundColor: "#0B1956",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: { color: "white", fontSize: 14, fontWeight: "600" },
});
