import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

// Local Assets & Context
import lightExercises from "../../assets/exercises/light_exercises.json";
import moderateExercises from "../../assets/exercises/moderate_exercises.json";
import vigorousExercises from "../../assets/exercises/vigorous_exercises.json";
import { useUser } from "../context/UserContext";
import { Workout } from "../types/Workout";

const PRIMARY_COLOR = "#0B1956";
const ACCENT_COLOR = "#E4572E";
const screenWidth = Dimensions.get("window").width;

export default function InsightsScreen() {
  const { predData, predLoading, analysis, analysisLoading } = useUser();

  const [riskLevel, setRiskLevel] = useState<
    "Light" | "Moderate" | "Vigorous"
  >();
  const [exercises, setExercises] = useState<Workout[]>([]);
  const [streak, setStreak] = useState(0);
  const [riskChange, setRiskChange] = useState({
    message: "Analyzing your progress...",
    isImprovement: true,
    value: 0,
  });

  useEffect(() => {
    const predictions = Array.isArray(predData) ? predData : [];
    if (predictions.length > 0) {
      // 1. CALC STREAK
      const calculateStreak = () => {
        const dates = predictions
          .map((p) => new Date(p.created_at).toISOString().split("T")[0])
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        if (dates.length === 0) return 0;
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (dates[0] !== today && dates[0] !== yesterdayStr) return 0;

        let currentStreak = 1;
        for (let i = 0; i < dates.length - 1; i++) {
          const curr = new Date(dates[i]);
          const next = new Date(dates[i + 1]);
          const diffDays =
            (curr.getTime() - next.getTime()) / (1000 * 3600 * 24);
          if (diffDays <= 1.1) currentStreak++;
          else break;
        }
        return currentStreak;
      };

      setStreak(calculateStreak());

      // 2. RISK LOGIC
      const latestIdx = predictions.length - 1;
      const latestPercent = predictions[latestIdx].percent;
      const prevPercent =
        latestIdx > 0 ? predictions[latestIdx - 1].percent : latestPercent;
      const diff = latestPercent - prevPercent;
      const absDiff = Math.abs(diff).toFixed(2);

      if (latestIdx === 0) {
        setRiskChange({
          message: "First health check completed!",
          isImprovement: true,
          value: 0,
        });
      } else if (diff < 0) {
        setRiskChange({
          message: `Risk down by ${absDiff}%!`,
          isImprovement: true,
          value: parseFloat(absDiff),
        });
      } else if (diff > 0) {
        setRiskChange({
          message: `Risk up by ${absDiff}%. Keep pushing!`,
          isImprovement: false,
          value: parseFloat(absDiff),
        });
      } else {
        setRiskChange({
          message: "Risk level is stable. Good job!",
          isImprovement: true,
          value: 0,
        });
      }

      let level: "Light" | "Moderate" | "Vigorous";
      if (latestPercent < 31) level = "Light";
      else if (latestPercent < 61) level = "Moderate";
      else level = "Vigorous";

      setRiskLevel(level);
      if (level === "Light")
        setExercises(lightExercises.Light_Exercises as Workout[]);
      else if (level === "Moderate")
        setExercises(moderateExercises.Moderate_Exercises as Workout[]);
      else if (level === "Vigorous")
        setExercises(vigorousExercises.Vigorous_Exercises as Workout[]);
    }
  }, [predData]);

  // Chart Data Preparation
  const predictions = Array.isArray(predData) ? predData : [];
  const chartData = {
    labels: predictions
      .slice(-6)
      .map((_, i) => `T-${predictions.slice(-6).length - 1 - i}`),
    datasets: [
      {
        data: predictions.slice(-6).map((p) => p.percent),
        color: (opacity = 1) => `rgba(228, 87, 46, ${opacity})`, // Using ACCENT_COLOR
        strokeWidth: 3,
      },
    ],
  };

  if (predLoading || analysisLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: PRIMARY_COLOR },
        ]}
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={[styles.subtitle, { marginTop: 20 }]}>
          Syncing health records...
        </Text>
      </View>
    );
  }

  const currentRiskPercent =
    predictions.length > 0 ? predictions[predictions.length - 1].percent : 0;
  const dailyTasks = analysis?.daily_tasks || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health Insights</Text>
          <Text style={styles.headerSubtitle}>
            Real-time data based on your habits
          </Text>
        </View>

        {/* CHART SECTION */}
        <Text style={styles.sectionTitle}>Risk Trend</Text>
        <View style={styles.chartContainer}>
          {predictions.length > 1 ? (
            <LineChart
              data={chartData}
              width={screenWidth - 50}
              height={180}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(11, 25, 86, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: ACCENT_COLOR,
                },
                style: { borderRadius: 16 },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.infoText}>
                More data needed to show trends.
              </Text>
            </View>
          )}
        </View>

        {/* Section: Dynamic Daily Tasks */}
        <Text style={styles.sectionTitle}>What You Can Do</Text>
        <View style={styles.taskStack}>
          {dailyTasks.length > 0 ? (
            dailyTasks.slice(0, 5).map((task: any, index: number) => (
              <TouchableOpacity
                key={task.id || index}
                style={styles.taskRow}
                onPress={() => Alert.alert("Goal Logged", task.label)}
              >
                <View style={styles.taskIconWrapper}>
                  <MaterialCommunityIcons
                    name={(task.icon as any) || "flash-outline"}
                    size={22}
                    color={PRIMARY_COLOR}
                  />
                </View>
                <Text style={styles.taskLabelText} numberOfLines={1}>
                  {task.label}
                </Text>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={20}
                  color="#CBD5E1"
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyTasksContainer}>
              <Text style={styles.infoText}>No tasks for today.</Text>
            </View>
          )}
        </View>

        {/* Section: Progress & Streaks */}
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoIconRow}>
            <MaterialCommunityIcons
              name={riskChange.isImprovement ? "trending-down" : "trending-up"}
              size={24}
              color={riskChange.isImprovement ? "#10B981" : "#EF4444"}
            />
            <Text style={styles.infoText}>{riskChange.message}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconRow}>
            <MaterialCommunityIcons
              name="fire"
              size={24}
              color={streak > 0 ? ACCENT_COLOR : "#9CA3AF"}
            />
            <Text style={styles.infoText}>
              Current Streak:{" "}
              <Text style={styles.highlight}>{streak} Days</Text>
            </Text>
          </View>
        </View>

        {/* Exercise Library */}
        <Text style={styles.sectionTitle}>Exercise Library ({riskLevel})</Text>
        <View style={{ paddingHorizontal: 25 }}>
          {exercises.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.exerciseListCard}
              onPress={() =>
                router.push({
                  pathname: "/Homepage/exercise-detail" as any,
                  params: { workout: JSON.stringify(item) },
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
                  <Text style={styles.exerciseTitleText} numberOfLines={1}>
                    {item.title || item.name}
                  </Text>
                  <Text style={styles.exerciseSubText}>
                    {item.duration} • {item.intensity || riskLevel}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  centerContent: { justifyContent: "center", alignItems: "center" },
  subtitle: { fontSize: 15, color: "#fff", textAlign: "center" },
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

  // Chart Styles
  chartContainer: {
    marginHorizontal: 25,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  emptyChart: { height: 100, justifyContent: "center", alignItems: "center" },

  // Task Styles
  taskStack: { paddingHorizontal: 25, gap: 10 },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  taskIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  taskLabelText: { flex: 1, fontSize: 15, fontWeight: "600", color: "#374151" },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  infoIconRow: { flexDirection: "row", alignItems: "center" },
  infoText: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  highlight: { color: ACCENT_COLOR, fontWeight: "700" },
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
  exerciseInfo: { flexDirection: "row", alignItems: "center" },
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
  exerciseSubText: { fontSize: 12, color: "#6B7280" },
  emptyTasksContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
  },
});
