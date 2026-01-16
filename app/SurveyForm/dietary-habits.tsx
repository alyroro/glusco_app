import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DietaryHabits({
  data,
  setFormData,
  onNext,
  onBack,
}: any) {
  // Logic to determine which map to use for a specific question
  const getMapForQuestion = (questionId: string) => {
    if (questionId === "weight_concern") return weightMap;
    if (questionId === "fruits" || questionId === "vegetables")
      return reverseOptionMap;
    return optionMap;
  };

  const handleSelect = (questionId: string, option: string) => {
    // FIX: We now use the correct map based on the question ID
    const selectedMap = getMapForQuestion(questionId);

    setFormData((prev: any) => ({
      ...prev,
      dietaryHabits: {
        ...prev.dietaryHabits,
        [questionId]: selectedMap[option],
      },
    }));
  };

  const questions = [
    { id: "fruits", question: "How often do you consume fruits?" },
    { id: "vegetables", question: "How often do you consume vegetables?" },
    { id: "sweets", question: "How often do you eat sweets?" },
    { id: "fried", question: "How often do you eat fried foods?" },
    {
      id: "fastfood",
      question: "How often do you eat fast foods (e.g. Jollibee)?",
    },
    {
      id: "processed",
      question:
        "How often do you eat processed foods (e.g. hotdog, sausage, bacon, canned meat)?",
    },
    {
      id: "softdrink",
      question:
        "How often do you consume sugar-sweetened drinks (soft drinks, sweetened coffee/tea, juice)?",
    },
    {
      id: "weight_concern",
      question:
        "Have you tried to lose or maintain weight in the past 6 months?",
    },
  ];

  const optionMap: Record<string, number> = {
    Never: 1,
    "Rarely (less than 3 servings/week)": 2,
    "Occasionally (3–5 servings/week)": 3,
    "Frequently (1–2 servings/day)": 4,
    "Daily (3+ servings/day)": 5,
  };

  const reverseOptionMap: Record<string, number> = {
    Never: 5,
    "Rarely (less than 3 servings/week)": 4,
    "Occasionally (3–5 servings/week)": 3,
    "Frequently (1–2 servings/day)": 2,
    "Daily (3+ servings/day)": 1,
  };

  const weightMap: Record<string, number> = {
    "Yes, successfully": 1,
    "Yes, but no significant change": 2,
    "No attempt": 3,
  };

  const frequencyOptions = [
    "Never",
    "Rarely (less than 3 servings/week)",
    "Occasionally (3–5 servings/week)",
    "Frequently (1–2 servings/day)",
    "Daily (3+ servings/day)",
  ];

  const weightOptions = [
    "Yes, successfully",
    "Yes, but no significant change",
    "No attempt",
  ];

  const currentStep = 2;
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

        <Text style={styles.title}>Let’s Talk About Your Diet</Text>
        <Text style={styles.subtitle}>
          Share your eating habits so we can better understand your lifestyle.
        </Text>

        {/* Questions */}
        {questions.map((q) => {
          const optionsToRender =
            q.id === "weight_concern" ? weightOptions : frequencyOptions;
          const currentMap = getMapForQuestion(q.id);

          return (
            <View key={q.id} style={styles.inputCard}>
              <Text style={styles.label}>{q.question}</Text>

              {optionsToRender.map((option) => {
                // Determine the numerical value for this option based on the question type
                const optionValue = currentMap[option];
                const isSelected = data.dietaryHabits[q.id] === optionValue;

                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleSelect(q.id, option)}
                    style={styles.optionRow}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioSelected,
                      ]}
                    />
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}

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
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
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
  optionText: { fontSize: 14, color: "#000", flexShrink: 1 },
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
