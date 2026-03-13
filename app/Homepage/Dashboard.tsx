import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useUser } from "../context/UserContext";

export default function DashboardScreen() {
  const { profile, loading, predData, predLoading, formData, formLoading } =
    useUser();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // --- 1. HEALTH COLOR LOGIC ---
  const getRiskColor = (pct: number) => {
    if (pct < 31) return "#10B981"; // Green
    if (pct < 61) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  // --- 2. CALENDAR MARKING LOGIC ---
  const markedDates: any = {};

  if (Array.isArray(predData)) {
    predData.forEach((item: any) => {
      // Formats the timestamp to YYYY-MM-DD
      const dateKey = item.created_at.split("T")[0];
      const riskPct = Math.floor(item.percent);

      markedDates[dateKey] = {
        customStyles: {
          container: {
            backgroundColor: getRiskColor(riskPct),
            elevation: 2,
            borderRadius: 20,
          },
          text: {
            color: "white",
            fontWeight: "bold",
          },
        },
      };
    });
  }

  // Highlight the selected day with a border if it's already marked, or a navy circle if not
  if (selectedDay) {
    markedDates[selectedDay] = {
      ...markedDates[selectedDay],
      selected: true,
      selectedColor: "#0B1956",
    };
  }

  const handleDayPress = (day: any) => {
    setSelectedDay(day.dateString);
  };

  if (loading || predLoading || formLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: "#0B1956" },
        ]}
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={[styles.subtitle, { marginTop: 20 }]}>
          Getting your health data...
        </Text>
      </View>
    );
  }

  if (!profile || !predData || !formData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Please log in to view your dashboard.</Text>
      </View>
    );
  }

  const latestPred = Array.isArray(predData)
    ? predData[predData.length - 1].percent
    : predData.percent;
  const latestForm = Array.isArray(formData) ? formData[0] : formData;
  const percent = Math.floor(latestPred);

  const riskLevel = () => {
    if (percent < 31) return "Low";
    if (percent < 61) return "Moderate";
    return "High";
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#F9FAFB" }}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>{profile.name} 👋</Text>
        </View>
        <TouchableOpacity
          style={styles.profilePicContainer}
          onPress={() => router.push("/Homepage/Profile")}
        >
          <Image
            source={{ uri: profile.profile_picture }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      {/* Risk Level Card */}
      <View style={styles.mainRiskCard}>
        <Text style={styles.riskCardTitle}>Diabetes Risk Score</Text>
        <View style={styles.riskContainer}>
          <AnimatedCircularProgress
            size={160}
            width={12}
            fill={percent}
            tintColor={getRiskColor(percent)}
            backgroundColor="#F3F4F6"
            rotation={0}
            lineCap="round"
          >
            {(fill: number) => (
              <View style={styles.innerCircleContent}>
                <Text
                  style={[styles.riskPercent, { color: getRiskColor(percent) }]}
                >{`${Math.round(fill)}%`}</Text>
                <Text style={styles.riskLevelText}>{riskLevel()} Risk</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.riskLevelContainer}>
          <Text style={styles.riskMessage}>
            Your lifestyle habits are stable. Keep tracking daily to stay
            informed!
          </Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/Homepage/ai-explanation" as any,
                params: { user: profile.id },
              })
            }
            style={styles.summaryBtn}
          >
            <Text style={styles.summaryText}>View AI Summary</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Metrics Section */}
      <Text style={styles.sectionTitle}>Key Vitals</Text>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: "#FEF2F2" }]}>
            <MaterialCommunityIcons
              name="heart-pulse"
              size={22}
              color="#EF4444"
            />
          </View>
          <Text style={styles.cardLabel}>Blood Pressure</Text>
          <Text style={styles.cardValue}>
            {latestForm.systolic}/{latestForm.diastolic}
          </Text>
          <Text style={styles.cardUnit}>mmHg</Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
            <MaterialCommunityIcons name="water" size={22} color="#3B82F6" />
          </View>
          <Text style={styles.cardLabel}>
            {latestForm.hba1c === "0" ? "Waist Circumference" : "HbA1c"}
          </Text>
          <Text style={styles.cardValue}>
            {latestForm.hba1c === "0" ? latestForm.waist : latestForm.hba1c}
          </Text>
          <Text style={styles.cardUnit}>
            {latestForm.hba1c === "0" ? "cm" : "mg/dL"}
          </Text>
        </View>
      </View>

      {/* Tracker Section */}
      <Text style={styles.sectionTitle}>Activity Tracker</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markingType={"custom"} // Allows the circular background colors
          markedDates={markedDates}
          theme={{
            calendarBackground: "#ffffff",
            todayTextColor: "#0B1956",
            arrowColor: "#0B1956",
            monthTextColor: "#0B1956",
            textDayFontWeight: "600",
            textMonthFontWeight: "700",
          }}
          style={styles.calendar}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { justifyContent: "center", alignItems: "center" },
  subtitle: { fontSize: 15, color: "#fff", textAlign: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: { fontSize: 14, color: "#6B7280" },
  username: { fontSize: 22, fontWeight: "bold", color: "#1F2937" },
  profilePicContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 3,
  },
  profilePic: { width: "100%", height: "100%", borderRadius: 24 },
  mainRiskCard: {
    backgroundColor: "#fff",
    marginHorizontal: 25,
    borderRadius: 24,
    padding: 20,
    elevation: 4,
  },
  riskCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 15,
  },
  riskContainer: { alignItems: "center", marginVertical: 10 },
  innerCircleContent: { alignItems: "center" },
  riskPercent: { fontSize: 38, fontWeight: "800" },
  riskLevelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: -5,
  },
  riskLevelContainer: { alignItems: "center", marginTop: 20 },
  riskMessage: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  summaryBtn: {
    backgroundColor: "#0B1956",
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  summaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 25,
    marginTop: 30,
    marginBottom: 15,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLabel: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
  cardValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 4,
  },
  cardUnit: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  calendarContainer: {
    marginHorizontal: 25,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  calendar: { borderRadius: 20 },
});
