import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
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
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
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
  const getRiskColor = (value: number) => {
    if (value < 31) return "#16A34A"; // Green
    if (value < 61) return "#F97316"; // Orange
    return "#DC2626"; // Red
  };

  useEffect(() => {
    const loadPersistedData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const storedDate = await AsyncStorage.getItem("@last_task_date");

      if (storedDate !== today) {
        await AsyncStorage.setItem("@last_task_date", today);
        await AsyncStorage.removeItem("@completed_tasks");
        setCompletedTasks([]);
      } else {
        const savedTasks = await AsyncStorage.getItem("@completed_tasks");
        if (savedTasks) setCompletedTasks(JSON.parse(savedTasks));
      }
    };
    loadPersistedData();
  }, []);

  // 2. Toggle Task Logic
  const toggleTask = async (taskId: string) => {
    const newTasks = completedTasks.includes(taskId)
      ? completedTasks.filter((id) => id !== taskId)
      : [...completedTasks, taskId];

    setCompletedTasks(newTasks);
    await AsyncStorage.setItem("@completed_tasks", JSON.stringify(newTasks));
  };

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
      .slice(-6) // Take the last 6 entries
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
      .map((p) => {
        const date = new Date(p.created_at);
        // Returns "Mar 13"
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        });
      }),
    datasets: [
      {
        data: predictions.slice(-6).map((p) => p.percent),
        // Optional: Apply colors based on risk level
        colors: predictions.slice(-6).map(
          (p) =>
            (opacity = 1) =>
              getRiskColor(p.percent),
        ),
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
          {predictions.length > 0 ? (
            <BarChart
              data={chartData}
              width={screenWidth - 60} // Adjusted for padding
              height={220}
              yAxisLabel=""
              yAxisSuffix="%"
              fromZero={true}
              flatColor={true} // Prevents gradients on bars if you want solid colors
              withCustomBarColorFromData={true} // Required for individual bar colors
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => PRIMARY_COLOR, // Fallback color
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                barPercentage: 0.6,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  strokeDasharray: "3 3", // Matches your web "CartesianGrid"
                  stroke: "#F3F4F6",
                },
              }}
              verticalLabelRotation={0}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              showValuesOnTopOfBars={true} // Replicates your web "LabelList"
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
            dailyTasks.slice(0, 5).map((task: any, index: number) => {
              const taskId = task.id || `task-${index}`;
              const isDone = completedTasks.includes(taskId);

              return (
                <TouchableOpacity
                  key={taskId}
                  onPress={() => toggleTask(taskId)}
                  style={[
                    styles.taskRow,
                    isDone && styles.taskRowDone, // Green background/border
                  ]}
                >
                  <View
                    style={[
                      styles.taskIconWrapper,
                      isDone && styles.iconWrapperDone,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        isDone
                          ? "check-bold"
                          : (task.icon as any) || "flash-outline"
                      }
                      size={20}
                      color={isDone ? "#16A34A" : PRIMARY_COLOR}
                    />
                  </View>

                  <View style={styles.taskTextColumn}>
                    <Text
                      style={[styles.taskLabelText, isDone && styles.textDone]}
                    >
                      {task.label}
                    </Text>
                    {/* Hide reasoning when done to keep it clean, just like your web code */}
                    {!isDone && (
                      <Text
                        style={styles.taskLabelTextReasoning}
                        numberOfLines={2}
                      >
                        {task.reasoning}
                      </Text>
                    )}
                  </View>

                  <MaterialCommunityIcons
                    name={isDone ? "check-circle" : "circle-outline"}
                    size={24}
                    color={isDone ? "#16A34A" : "#CBD5E1"}
                  />
                </TouchableOpacity>
              );
            })
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
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 20,
    paddingRight: 20, // Give space for the Y-axis labels
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  emptyChart: { height: 100, justifyContent: "center", alignItems: "center" },

  // Task Styles
  taskStack: { paddingHorizontal: 25, gap: 10 },

  taskIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

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

  // Existing taskRow, but we'll add conditional styles
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "transparent", // Default border
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    marginBottom: 8,
  },
  taskRowDone: {
    backgroundColor: "#F0FDF4", // Light green background (bg-green-50)
    borderColor: "#BBF7D0", // Green border (border-green-200)
    elevation: 0, // Flatten it when done
    shadowOpacity: 0,
  },
  iconWrapperDone: {
    backgroundColor: "#DCFCE7", // bg-green-100
  },
  taskTextColumn: {
    flex: 1,
    justifyContent: "center",
    marginRight: 10,
  },
  taskLabelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  textDone: {
    color: "#15803D", // text-green-700
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  taskLabelTextReasoning: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    marginTop: 2,
  },
});
