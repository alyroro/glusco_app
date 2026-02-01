import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Using MaterialIcons as a safer alternative for AI stars
import { MaterialIcons } from "@expo/vector-icons";
import supabase from "../api/client";
import { GeminiResultRetake } from "../types/GeminiTypes";

export default function AIExplanation() {
  const { user } = useLocalSearchParams();
  const [aiText, setAiText] = useState<GeminiResultRetake | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchLatestExplanation();
  }, []);

  const fetchLatestExplanation = async () => {
    if (!user) {
      console.error("No user ID provided");
      return;
    }

    try {
      setAiLoading(true);

      const { data: analysis, error } = await supabase
        .from("ai_analysis")
        .select("*")
        .eq("user_id", user) // Use string 'user' directly if it's a UUID
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (analysis) {
        console.log("Success! Data:", analysis);
        setAiText(analysis);
      } else {
        console.warn(
          "Record exists in DB, but query returned nothing. Check RLS!",
        );
        // Set an empty state so it stops loading
        setAiText({
          summary: "No analysis available yet.",
          disclaimer: "Please complete a checkup first.",
        } as any);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setAiLoading(false);
    }
  };
  if (aiLoading || !aiText) {
    return (
      <LinearGradient
        colors={["#0B1956", "#2E4B8F"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Getting your latest summary...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0B1956", "#162B7B", "#446CC3"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <Text style={styles.logoMain}>glus</Text>
              <Text style={styles.logoAccent}>co</Text>
            </View>

            {/* AI Title with THE Gemini Sparkle */}
            <View style={styles.titleWrapper}>
              <View style={styles.iconCircle}>
                {/* auto-fix-high is the standard AI magic wand/sparkle star */}
                <MaterialIcons
                  name={"auto-fix-high" as any}
                  size={24}
                  color="#8EABFF"
                />
              </View>
              <Text style={styles.title}>AI Health Analysis</Text>
            </View>

            {/* Summary Card */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.text}>{aiText.summary}</Text>
            </View>

            {/* Key Factors */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Key Factors</Text>
              {aiText.top_drivers.map((driver, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.boldText}>• {driver.feature}</Text>
                  <Text style={styles.text}>{driver.impact}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Specficic Changes</Text>
              {aiText.specific_changes.map((driver, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.boldText}>• {driver}</Text>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {aiText.advice.map((item, index) => (
                <Text key={index} style={styles.text}>
                  ✔️ {item}
                </Text>
              ))}
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerCard}>
              <Text style={styles.disclaimerTitle}>Disclaimer</Text>
              <Text style={styles.disclaimerText}>{aiText.disclaimer}</Text>
            </View>

            {/* Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/Homepage/Dashboard")}
            >
              <Text style={styles.buttonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 70,
  },
  loadingText: {
    marginTop: 20,
    color: "#fff",
    fontSize: 15,
  },
  content: {
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: "row",
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMain: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1,
  },
  logoAccent: {
    color: "#8EABFF",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  iconCircle: {
    backgroundColor: "rgba(142, 171, 255, 0.15)",
    padding: 8,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: "#0B1956",
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
    marginBottom: 6,
  },
  boldText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  listItem: {
    marginBottom: 10,
  },
  disclaimerCard: {
    backgroundColor: "rgba(255, 244, 229, 0.9)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B45309",
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#92400E",
  },
  button: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 30,
  },
  buttonText: {
    color: "#0B1956",
    fontSize: 17,
    fontWeight: "700",
  },
});
