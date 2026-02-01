import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SleepSubstance({
  data,
  setFormData,
  onNext,
  onBack,
}: any) {
  // Numerical Maps
  const sleepMap: Record<string, number> = {
    "Less than 5 hours": 4,
    "5–6 hours": 3,
    "7–8 hours": 2,
    "More than 8 hours": 1,
  };

  const smokingMap: Record<string, number> = {
    Never: 1,
    Occasionally: 2,
    Regularly: 4,
    "Former smoker": 3,
  };

  const alcoholMap: Record<string, number> = {
    Never: 1,
    Occasionally: 2,
    Weekly: 3,
    "Almost daily": 4,
  };

  // Helper to get the correct map based on question ID
  const getMap = (id: string) => {
    if (id === "sleep_hours") return sleepMap;
    if (id === "sleep_cigarette") return smokingMap;
    return alcoholMap;
  };

  const handleSelect = (questionId: string, option: string) => {
    const selectedMap = getMap(questionId);
    const value = selectedMap[option];

    setFormData((prev: any) => ({
      ...prev,
      sleepSubstance: {
        ...prev.sleepSubstance,
        [questionId]: value,
      },
    }));
  };

  const currentStep = 4;
  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#0B1956" />
          </TouchableOpacity>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
        </View>

        <Text style={styles.title}>How is your sleep and habits?</Text>
        <Text style={styles.subtitle}>
          Share how well you sleep and whether you smoke or drink.
        </Text>

        {/* Sleep Hours Section */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>
            How many hours of sleep did you usually get this week?
          </Text>
          {Object.keys(sleepMap).map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => handleSelect("sleep_hours", option)}
            >
              <View
                style={[
                  styles.radioCircle,
                  data.sleepSubstance?.sleep_hours === sleepMap[option] &&
                    styles.radioSelected,
                ]}
              />
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Smoking Section */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Did you smoke cigarettes or vape?</Text>
          {Object.keys(smokingMap).map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => handleSelect("sleep_cigarette", option)}
            >
              <View
                style={[
                  styles.radioCircle,
                  data.sleepSubstance?.sleep_cigarette === smokingMap[option] &&
                    styles.radioSelected,
                ]}
              />
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Alcohol Section */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Did you consume alcohol?</Text>
          {Object.keys(alcoholMap).map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => handleSelect("sleep_alcohol", option)}
            >
              <View
                style={[
                  styles.radioCircle,
                  data.sleepSubstance?.sleep_alcohol === alcoholMap[option] &&
                    styles.radioSelected,
                ]}
              />
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={onNext}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F8F3ED",
    paddingVertical: 40,
  },
  container: { paddingHorizontal: 30 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 20,
  },
  backButton: { marginRight: 10 },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#D9D9D9",
    borderRadius: 6,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#446CC3",
    borderRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#101623E6",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#101623E6",
    marginBottom: 30,
    lineHeight: 20,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#101623E6",
    marginBottom: 12,
  },
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#0B1956",
    backgroundColor: "#E5E7EB",
    marginRight: 10,
  },
  radioSelected: { backgroundColor: "#0B1956" },
  optionText: { fontSize: 15, color: "#000" },
  continueButton: {
    backgroundColor: "#0B1956",
    borderRadius: 32,
    paddingVertical: 15,
    marginTop: 10,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
