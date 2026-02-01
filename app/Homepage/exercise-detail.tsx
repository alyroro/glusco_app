import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Workout } from "../types/Workout";

const PRIMARY_COLOR = "#0B1956";
const ACCENT_COLOR = "#E4572E";

export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams();
  const workout: Workout = JSON.parse(params.workout as string);

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={PRIMARY_COLOR}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Plan</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Section */}
        <View style={styles.banner}>
          <Text style={styles.title}>{workout.title || workout.name}</Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{workout.duration}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: "#EEF2FF" }]}>
              <Text style={[styles.tagText, { color: PRIMARY_COLOR }]}>
                {workout.intensity || workout.for || "Standard"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Exercise Steps</Text>

        {/* Dynamic Exercise Steps */}
        {workout.exercises.map((step, index) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepName}>{step.name || step.activity}</Text>
              <View style={styles.timeRow}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color="#6B7280"
                />
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
            </View>
            {(step.name === "rest" || step.activity === "rest") && (
              <MaterialCommunityIcons
                name="timer-sand"
                size={20}
                color={ACCENT_COLOR}
              />
            )}
          </View>
        ))}

        {workout.note && (
          <View style={styles.noteBox}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={PRIMARY_COLOR}
            />
            <Text style={styles.noteText}>{workout.note}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingBottom: 70 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: PRIMARY_COLOR },
  scrollContent: { padding: 25 },
  banner: { marginBottom: 30 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: PRIMARY_COLOR,
    textTransform: "capitalize",
  },
  tagRow: { flexDirection: "row", marginTop: 12 },
  tag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  tagText: { fontSize: 12, fontWeight: "600", color: "#4B5563" },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 15,
  },
  stepCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  stepNumber: { color: PRIMARY_COLOR, fontWeight: "bold" },
  stepInfo: { flex: 1 },
  stepName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textTransform: "capitalize",
  },
  timeRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  stepTime: { fontSize: 13, color: "#6B7280", marginLeft: 4 },
  noteBox: {
    backgroundColor: "#E0E7FF",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  noteText: { flex: 1, marginLeft: 10, color: PRIMARY_COLOR, fontSize: 14 },
  startButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
  },
  startButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
