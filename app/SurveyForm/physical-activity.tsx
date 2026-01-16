import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PhysicalActivity({
  data,
  setFormData,
  onNext,
  onBack,
}: any) {
  const handleSelect = (questionId: string, value: any) => {
    setFormData((prev: any) => {
      const updatedActivity = {
        ...prev.physicalActivity,
        [questionId]: value,
      };

      // RESET LOGIC: If user changes "Yes" to "No", clear the exercise-specific data
      if (questionId === "doesExercise" && value === 0) {
        delete updatedActivity.exerciseTypes;
        delete updatedActivity.exercise_times;
        delete updatedActivity.exercise_duration;
      }

      return {
        ...prev,
        physicalActivity: updatedActivity,
      };
    });
  };

  const toggleExercise = (item: string) => {
    const currentExercises = data.physicalActivity?.exerciseTypes || [];
    const newExercises = currentExercises.includes(item)
      ? currentExercises.filter((i: string) => i !== item)
      : [...currentExercises, item];

    handleSelect("exerciseTypes", newExercises);
  };

  const exerciseOptions = [
    "Brisk Walking",
    "Swimming",
    "Cycling",
    "Jogging",
    "Running",
    "Sports",
    "Dancing (e.g., Zumba, aerobic dance)",
    "Hiking",
    "Jump rope",
    "Lifting weights",
    "Bodyweight exercises",
    "Flexibility (Yoga, Pilates)",
    "Other:",
  ];

  const exerciseQuestions = [
    {
      id: "exercise_times",
      question: "How often do you exercise?",
      options: {
        "1–2 times a week": 3,
        "3–4 times a week": 2,
        "5+ times a week": 1,
      },
    },
    {
      id: "exercise_duration",
      question: "On average, how long is each session?",
      options: {
        "Less than 15 min": 4,
        "15–30 min": 3,
        "30–60 min": 2,
        "More than 60 min": 1,
      },
    },
  ];

  const baseQuestions = [
    {
      id: "sitting",
      question: "How many hours per day do you spend sitting?",
      options: {
        "Less than 3 hours": 4,
        "3–6 hours": 3,
        "6–9 hours": 2,
        "More than 9 hours": 1,
      },
    },
    {
      id: "main_activity",
      question: "What best describes your main activity?",
      options: {
        "Mostly sedentary": 4,
        "Light standing/walking": 3,
        "Moderate activity": 2,
        "Vigorous activity": 1,
      },
    },
    {
      id: "mode_of_transpo",
      question: "What is your primary mode of transportation?",
      options: {
        Walking: 1,
        Biking: 2,
        "Public transport": 3,
        "Private vehicle": 4,
      },
    },
  ];

  const currentStep = 3;
  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Helper to check if "doesExercise" has been selected (0 or 1)
  const isExerciseAnswered =
    data.physicalActivity?.doesExercise !== undefined &&
    data.physicalActivity?.doesExercise !== null;

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

        <Text style={styles.title}>Let’s Check Your Activity Level</Text>
        <Text style={styles.subtitle}>
          Tell us how often you stay active. Every step counts.
        </Text>

        {/* Question 1: ALWAYS VISIBLE */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Do you exercise?</Text>
          {["Yes", "No"].map((option) => {
            const val = option === "Yes" ? 1 : 2;
            return (
              <TouchableOpacity
                key={option}
                style={styles.optionRow}
                onPress={() => handleSelect("doesExercise", val)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    data.physicalActivity?.doesExercise === val &&
                      styles.radioSelected,
                  ]}
                />
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ONLY SHOW EVERYTHING ELSE IF THE FIRST QUESTION IS ANSWERED */}
        {isExerciseAnswered && (
          <>
            {/* Conditional Exercise Detail Section (Only if "Yes") */}
            {data.physicalActivity?.doesExercise === 1 && (
              <>
                <View style={styles.inputCard}>
                  <Text style={styles.label}>
                    Types of exercise (Check all that apply)
                  </Text>
                  {exerciseOptions.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.optionRow}
                      onPress={() => toggleExercise(item)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          data.physicalActivity?.exerciseTypes?.includes(
                            item
                          ) && styles.checkboxChecked,
                        ]}
                      />
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {exerciseQuestions.map((q) => (
                  <View key={q.id} style={styles.inputCard}>
                    <Text style={styles.label}>{q.question}</Text>
                    {Object.entries(q.options).map(([opt, value]) => (
                      <TouchableOpacity
                        key={opt}
                        style={styles.optionRow}
                        onPress={() => handleSelect(q.id, value)}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            data.physicalActivity?.[q.id] === value &&
                              styles.radioSelected,
                          ]}
                        />
                        <Text style={styles.optionText}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </>
            )}

            {/* Base Questions (Shown if Yes OR No, but only after selection) */}
            {baseQuestions.map((q) => (
              <View key={q.id} style={styles.inputCard}>
                <Text style={styles.label}>{q.question}</Text>
                {Object.entries(q.options).map(([opt, value]) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.optionRow}
                    onPress={() => handleSelect(q.id, value)}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        data.physicalActivity?.[q.id] === value &&
                          styles.radioSelected,
                      ]}
                    />
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <TouchableOpacity style={styles.continueButton} onPress={onNext}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}
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
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
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
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#0B1956",
    marginRight: 10,
  },
  checkboxChecked: { backgroundColor: "#0B1956" },
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
