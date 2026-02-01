import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Imports
import { router } from "expo-router";
import lightExercises from "../../assets/exercises/light_exercises.json";
import moderateExercises from "../../assets/exercises/moderate_exercises.json";
import vigorousExercises from "../../assets/exercises/vigorous_exercises.json";
import { Workout } from "../types/Workout";

const PRIMARY_COLOR = "#0B1956";
const ACCENT_COLOR = "#E4572E";

export default function InsightsScreen() {
  // riskLevel can be "Light", "Moderate", or "Vigorous"
  const [riskLevel, setRiskLevel] = useState("Light");
  const [exercises, setExercises] = useState<Workout[]>([]);

  useEffect(() => {
    // Standardizing the selection and casting to your Workout interface
    if (riskLevel === "Light") {
      setExercises(lightExercises.Light_Exercises as Workout[]);
    } else if (riskLevel === "Moderate") {
      setExercises(moderateExercises.Moderate_Exercises as Workout[]);
    } else if (riskLevel === "Vigorous") {
      setExercises(vigorousExercises.Vigorous_Exercises as Workout[]);
    }
  }, [riskLevel]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health Insights</Text>
          <Text style={styles.headerSubtitle}>
            Real-time data based on your habits
          </Text>
        </View>

        {/* Section: Daily Tasks */}
        <Text style={styles.sectionTitle}>What You Can Do</Text>
        <View style={styles.cardRow}>
          <View style={styles.actionCard}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="food-apple"
                size={24}
                color={PRIMARY_COLOR}
              />
            </View>
            <Text style={styles.cardText}>Track your meals daily</Text>
            <TouchableOpacity style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionCard}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="water"
                size={24}
                color={PRIMARY_COLOR}
              />
            </View>
            <Text style={styles.cardText}>Drink 8 glasses of water</Text>
            <TouchableOpacity style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- UPDATED DYNAMIC EXERCISE LIBRARY --- */}
        <Text style={styles.sectionTitle}>Exercise Library ({riskLevel})</Text>
        <View style={{ paddingHorizontal: 25 }}>
          {exercises.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.exerciseListCard}
              onPress={() =>
                router.push({
                  pathname: "/Homepage/exercise-detail" as any,
                  params: { workout: JSON.stringify(item) }, // Passing the object as a string
                })
              }
            >
              <View style={styles.exerciseInfo}>
                <View style={styles.smallIconCircle}>
                  <MaterialCommunityIcons
                    name="run"
                    size={20}
                    color={PRIMARY_COLOR}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  {/* Standardized Title/Name handling */}
                  <Text style={styles.exerciseTitleText} numberOfLines={1}>
                    {item.title || item.name}
                  </Text>

                  {/* Standardized Metadata handling */}
                  <Text style={styles.exerciseSubText}>
                    {item.duration} •{" "}
                    {item.label || item.intensity || riskLevel}
                    {item.rest ? ` • Rest: ${item.rest}` : ""}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="#9CA3AF"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section: Progress & Streaks */}
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoIconRow}>
            <MaterialCommunityIcons
              name="trending-down"
              size={24}
              color="#10B981"
            />
            <Text style={styles.infoText}>
              Reduced risk by <Text style={styles.highlight}>3%</Text> this
              month!
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconRow}>
            <MaterialCommunityIcons
              name="fire"
              size={24}
              color={ACCENT_COLOR}
            />
            <Text style={styles.infoText}>
              Current Streak: <Text style={styles.highlight}>5 Days</Text>
            </Text>
          </View>
        </View>

        {/* Quick Health Tips */}
        <Text style={styles.sectionTitle}>Quick Health Tips</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <View style={styles.tipCard}>
            <MaterialCommunityIcons
              name="cup-water"
              size={28}
              color={PRIMARY_COLOR}
            />
            <Text style={styles.tipText}>Swap soda for water 3x this week</Text>
          </View>
          <View style={styles.tipCard}>
            <MaterialCommunityIcons
              name="walk"
              size={28}
              color={PRIMARY_COLOR}
            />
            <Text style={styles.tipText}>Aim for 20 mins of walking today</Text>
          </View>
          <View style={styles.tipCard}>
            <MaterialCommunityIcons
              name="sleep"
              size={28}
              color={PRIMARY_COLOR}
            />
            <Text style={styles.tipText}>Get at least 7 hours of rest</Text>
          </View>
        </ScrollView>

        {/* Risk Factors */}
        <Text style={styles.sectionTitle}>Risk Influence</Text>
        <View
          style={[
            styles.infoCard,
            { borderLeftWidth: 5, borderLeftColor: PRIMARY_COLOR },
          ]}
        >
          {/* FIXED: Changed <div> to <View> */}
          <View style={styles.riskRow}>
            <Text style={styles.riskLabel}>Glucose Levels</Text>
            <Text style={styles.riskValue}>45% Influence</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "45%" }]} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { paddingHorizontal: 25, paddingTop: 20, marginBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: PRIMARY_COLOR },
  headerSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    marginTop: 25,
    paddingHorizontal: 25,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "47%",
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
    height: 40,
  },
  doneButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 10,
    width: "100%",
  },
  doneText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  exerciseListCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  exerciseInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseTitleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    textTransform: "capitalize",
  },
  exerciseSubText: {
    fontSize: 12,
    color: "#6B7280",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 25,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIconRow: { flexDirection: "row", alignItems: "center" },
  infoText: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  highlight: { color: ACCENT_COLOR, fontWeight: "700" },
  horizontalScroll: { paddingLeft: 25, paddingRight: 10 },
  tipCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginRight: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 2,
  },
  tipText: {
    fontSize: 12,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  riskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  riskLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  riskValue: { fontSize: 14, fontWeight: "700", color: PRIMARY_COLOR },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", backgroundColor: PRIMARY_COLOR },
});
