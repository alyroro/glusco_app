import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FamilyHistory({
  data,
  setFormData,
  onNext,
  onBack,
}: any) {
  const router = useRouter();

  const handleSelect = (questionId: string, option: number) => {
    // FIX: We now use the correct map based on the question ID
    setFormData((prev: any) => ({
      ...prev,
      familyHistory: {
        ...prev.familyHistory,
        [questionId]: option,
      },
    }));
  };

  // const mainFamilyQuestions = [
  //   {
  //     key: "fh_father",
  //     label: "Father",
  //     question:
  //       "Has your father been diagnosed with Type 2 Diabetes? (If yes, indicate the age at diagnosis.)",
  //     options: {
  //       No: 1,
  //       "Yes, before 40": 3,
  //       "Yes, 40-59": 4,
  //       "Yes, 60 or older": 5,
  //       "Not sure": 2,
  //     },
  //   },
  //   {
  //     key: "fh_mother",
  //     label: "Mother",
  //     question:
  //       "Has your mother been diagnosed with Type 2 Diabetes? (If yes, indicate the age at diagnosis.)",
  //     options: {
  //       No: 1,
  //       "Yes, before 40": 3,
  //       "Yes, 40-59": 4,
  //       "Yes, 60 or older": 5,
  //       "Not sure": 2,
  //     },
  //   },
  //   {
  //     key: "fh_sister",
  //     label: "Sister",
  //     question:
  //       "Has your sister been diagnosed with Type 2 Diabetes? (If yes, indicate the age at diagnosis.)",
  //     options: {
  //       No: 1,
  //       "Yes, before 40": 3,
  //       "Yes, 40-59": 4,
  //       "Yes, 60 or older": 5,
  //       "Not sure": 2,
  //     },
  //   },
  //   {
  //     key: "fh_brother",
  //     label: "Brother",
  //     question:
  //       "Has your brother been diagnosed with Type 2 Diabetes? (If yes, indicate the age at diagnosis.)",
  //     options: {
  //       No: 1,
  //       "Yes, before 40": 3,
  //       "Yes, 40-59": 4,
  //       "Yes, 60 or older": 5,
  //       "Not sure": 2,
  //     },
  //   },
  // ];

  // const additionalQuestions = [
  //   {
  //     key: "fh_extended",
  //     question:
  //       "Has anyone in your extended family (grandparents, aunts, uncles, cousins) been diagnosed with Type 2 Diabetes?",
  //     options: { Yes: 3, No: 1, "Not sure": 2 },
  //   },
  // ];
  const mainFamilyQuestions = [
    {
      key: "any_family_diabetes",
      label: "Any Family Member",
      question:
        "Have any of your close family members (Father, Mother, or Siblings) ever been diagnosed with Type 2 Diabetes? ",
      options: {
        No: 0,
        Yes: 1,
      },
    },
  ];
  const progressPercentage = 100;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/SurveyForm/sleep-substance")}
          >
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

        <Text style={styles.title}>Your Family Health Background</Text>
        <Text style={styles.subtitle}>
          Tell us if anyone in your family has diabetes or related conditions.
          Family history helps us understand your inherited risk.
        </Text>

        {mainFamilyQuestions.map((q) => (
          <View key={q.key} style={styles.inputCard}>
            <View style={styles.rectAndContent}>
              <View style={styles.verticalRect} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{q.label}</Text>
                <Text style={styles.question}>{q.question}</Text>
                {Object.entries(q.options).map(([option, value]) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.optionRow}
                    onPress={() => handleSelect(q.key, value)}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        data.familyHistory[q.key] === value &&
                          styles.radioSelected,
                      ]}
                    />
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}

        {/* {additionalQuestions.map((q) => (
          <View key={q.key} style={styles.inputCard}>
            <Text style={styles.question}>{q.question}</Text>
            {Object.entries(q.options).map(([option, value]) => (
              <TouchableOpacity
                key={option}
                style={styles.optionRow}
                onPress={() => handleSelect(q.key, value)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    data.familyHistory[q.key] === value && styles.radioSelected,
                  ]}
                />
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))} */}

        {/* Generate Risk Button */}
        <TouchableOpacity style={styles.continueButton} onPress={onNext}>
          <Text style={styles.continueText}>Generate Risk</Text>
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
  rectAndContent: { flexDirection: "row", alignItems: "flex-start" },
  verticalRect: {
    width: 5,
    backgroundColor: "#446CC3",
    borderRadius: 2,
    marginRight: 10,
    alignSelf: "stretch",
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101623E6",
    marginBottom: 5,
  },
  question: {
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
