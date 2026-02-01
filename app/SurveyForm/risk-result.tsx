import { MaterialCommunityIcons } from "@expo/vector-icons";
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
        <Text style={[styles.subtitle, { marginTop: 20, color: "#fff" }]}>
          Analyzing your health data...
        </Text>
      </View>
    );
  }

  const percent = Math.floor(predictionData.percent);

  const getStatusColor = () => {
    if (percent < 31) return "#10B981"; // Modern Green
    if (percent < 61) return "#F59E0B"; // Modern Amber
    return "#EF4444"; // Modern Red
  };

  const riskLevel = () => {
    if (percent < 31) return "Low";
    if (percent < 61) return "Moderate";
    return "High";
  };

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.headerTextContainer}>
        <Text style={styles.title}>Assessment Complete</Text>
        <Text style={styles.subtitle}>
          Here’s your personalized diabetes risk analysis
        </Text>
      </View>

      <View style={styles.mainCard}>
        {/* Circular Progress Area */}
        <View style={styles.chartContainer}>
          <AnimatedCircularProgress
            size={180}
            width={14}
            fill={percent}
            tintColor={getStatusColor()}
            backgroundColor="#F3F4F6"
            rotation={0}
            lineCap="round"
          >
            {(fill: number) => (
              <View style={styles.innerCircle}>
                <Text style={[styles.percentText, { color: getStatusColor() }]}>
                  {`${Math.floor(fill)}%`}
                </Text>
                <Text style={styles.overallLabel}>OVERALL RISK</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* Risk Badge */}
        <View
          style={[styles.badge, { backgroundColor: getStatusColor() + "15" }]}
        >
          <Text style={[styles.badgeText, { color: getStatusColor() }]}>
            {riskLevel()} Risk Level
          </Text>
        </View>

        {/* Insight Description */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={20}
            color="#6B7280"
          />
          <Text style={styles.description}>
            Based on your data, we recommend tracking your daily habits to
            optimize your health outcomes.
          </Text>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.buttonText}>View AI Explanation</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/Homepage/Dashboard")}
        >
          <Text style={styles.secondaryButtonText}>Go to Dashboard</Text>
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
    paddingTop: 80,
  },
  centerContent: {
    justifyContent: "center",
  },
  headerTextContainer: {
    marginBottom: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 8,
  },
  mainCard: {
    width: "90%",
    backgroundColor: "#F9FAFB",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  chartContainer: {
    marginVertical: 20,
  },
  innerCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  percentText: {
    fontSize: 44,
    fontWeight: "800",
  },
  overallLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "700",
    letterSpacing: 1,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 30,
    alignItems: "center",
  },
  description: {
    flex: 1,
    fontSize: 13,
    color: "#4B5563",
    marginLeft: 10,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: "#0B1956",
    width: "100%",
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0B1956",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  secondaryButton: {
    marginTop: 15,
    padding: 10,
  },
  secondaryButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
});
