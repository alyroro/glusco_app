import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const RiskResult = ({
  data,
  setFormData,
  onNext,
  onBack,
  fetchPred,
  loading,
  predictionData,
  insertFormData,
  insertPrediction,
  updateUsername,
}: any) => {
  const router = useRouter();

  useEffect(() => {
    // Fetch prediction when component mounts
    updateUsername();
    fetchPred();
    insertFormData();
  }, []);

  useEffect(() => {
    if (predictionData) {
      insertPrediction(predictionData);
    }
  }, [predictionData]);

  if (loading || !predictionData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={[styles.subtitle, { marginTop: 20 }]}>
          Analyzing your health data...
        </Text>
      </View>
    );
  }

  const percent = Math.floor(predictionData.percent);
  const color = () => {
    if (percent < 20) return "#16A34A"; // Green
    if (percent < 50) return "#EAB308";
    return "#DC2626"; // Red
  };

  const riskLevel = () => {
    if (percent < 20) return "low";
    if (percent < 50) return "moderate";
    return "high";
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Diabetes Risk Result</Text>
      <Text style={styles.subtitle}>
        Here’s what we found based on your data
      </Text>

      <View style={styles.card}>
        {/* Circular Progress */}
        <AnimatedCircularProgress
          size={160}
          width={10}
          fill={percent}
          tintColor={color()}
          backgroundColor="#E5E7EB"
          rotation={0}
          lineCap="round"
        >
          {(fill: number) => (
            <Text style={styles.percentText}>{`${Math.floor(fill)}%`}</Text>
          )}
        </AnimatedCircularProgress>

        {/* Risk Level */}
        <Text style={styles.levelText}>Risk Level: {riskLevel()}</Text>

        {/* Description */}
        <Text style={styles.description}>
          Start tracking your daily habits to improve your diet, activity, and
          sleep for better health.
        </Text>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/Homepage/Dashboard")}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RiskResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1956",
    alignItems: "center",
    paddingTop: 120,
  },
  centerContent: {
    justifyContent: "center",
    paddingTop: 0, // Reset padding when centering spinner
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    width: 308,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingVertical: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  percentText: {
    fontSize: 40,
    color: "#121212",
    fontWeight: "500",
  },
  levelText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    textTransform: "capitalize",
    marginTop: 20,
  },
  description: {
    width: 260,
    fontSize: 14,
    color: "#000",
    textAlign: "justify",
    marginTop: 10,
  },
  button: {
    marginTop: 40,
    width: 263,
    height: 56,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#0B1956",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#0B1956",
    fontSize: 16,
    fontWeight: "500",
  },
});
