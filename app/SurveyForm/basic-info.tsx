import { Ionicons } from "@expo/vector-icons";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ============================================================
   NEW: CLEAN OCR → DATA EXTRACTION HELPER
   ============================================================ */
const extractBasicInfo = (raw: string) => {
  const text = raw.replace(/\s+/g, " ").toLowerCase();

  const patterns = {
    username: /(?:name|patient)[:\s]+([a-z\s]+?)(?=\s(?:age|sex|ht|wt|$))/i,
    age: /(?:age)[:\s]*(\d{1,3})/i,
    gender: /(?:sex|gender)[:\s]*(male|female|m|f)/i,
    height: /(?:height|ht)[:\s]*(\d{2,3})/i,
    weight: /(?:weight|wt)[:\s]*(\d{2,3})/i,
    waist: /(?:waist|waist\s+circumference)[:\s]*(\d{2,3})/i,
    hip: /(?:hip|hip\s+circumference)[:\s]*(\d{2,3})/i,
    bp: /(?:bp|blood\s+pressure)?[:\s]*(\d{2,3})\s*[\/\s-]\s*(\d{2,3})/i,
    hba1c: /(?:hba1c|a1c)[:\s]*(\d{1,2}(?:\.\d)?)/i,
    fbs: /(?:fbs|glucose|fasting\s+blood\s+sugar)[:\s]*(\d{2,3})/i,
    cholesterol: /(?:total\s+cholesterol|chol|t-chol)[:\s]*(\d{2,3})/i,
    hdl: /(?:hdl|hdl-c)[:\s]*(\d{2,3})/i,
  };

  const result: any = {};

  for (const key in patterns) {
    const match = text.match(patterns[key]);
    if (!match) continue;

    if (key === "bp") {
      result.systolic = match[1];
      result.diastolic = match[2];
    } else if (key === "gender") {
      const g = match[1];
      result.gender = g === "m" || g === "male" ? 1 : 2;
    } else if (key === "username") {
      result.username = match[1].trim();
    } else {
      result[key] = match[1];
    }
  }

  return result;
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function BasicInfo({ data, setFormData, onNext, loading }: any) {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);

  const currentStep = 1;
  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  /* ============================================================
     UPDATED CAMERA → OCR → DATA FLOW
     ============================================================ */
  const handleScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to scan records.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setIsScanning(true);
      try {
        const response = await TextRecognition.recognize(result.assets[0].uri);

        if (response.text) {
          const parsed = extractBasicInfo(response.text);

          if (Object.keys(parsed).length > 0) {
            setFormData((prev: any) => ({
              ...prev,
              basicInfo: { ...prev.basicInfo, ...parsed },
            }));

            Alert.alert(
              "Scan Success",
              "We've accurately filled in your details.",
            );
          } else {
            Alert.alert(
              "No Data Found",
              "We couldn't detect any valid information.",
            );
          }
        } else {
          Alert.alert("Scan Failed", "No text detected in the image.");
        }
      } catch (err) {
        Alert.alert(
          "Scan Error",
          "Could not read text. Please retake a clear photo.",
        );
      } finally {
        setIsScanning(false);
      }
    }
  };
  const handleSelect = (questionId: string, value: any) => {
    setFormData((prev: any) => {
      const stringValue = String(value);
      const updatedActivity = {
        ...prev.basicInfo,
        [questionId]: stringValue,
      };

      // RESET LOGIC: If user changes "Yes" to "No", clear the exercise-specific data
      if (questionId === "knowbgl" && value === "0") {
        delete updatedActivity.hba1c;
        delete updatedActivity.cholesterol;
        delete updatedActivity.fbs;
        delete updatedActivity.hdl;
      }

      return {
        ...prev,
        basicInfo: updatedActivity,
      };
    });
  };

  /* ============================================================
     UI SECTION — UNTOUCHED
     ============================================================ */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header & Progress */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/Auth/PrivacyAgreement")}
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

          <Text style={styles.title}>Let’s Get to Know You!</Text>
          <Text style={styles.subtitle}>
            Fill in your details manually or scan your lab records to save time.
          </Text>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="camera-outline" size={22} color="#FFF" />
                <Text style={styles.scanButtonText}>Scan Lab Record</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Username */}
          <View style={styles.inputCard}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={data.username}
              onChangeText={(text) =>
                setFormData((prev: any) => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, username: text },
                }))
              }
            />
          </View>

          {/* Age */}
          <View style={styles.inputCard}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={data.age ? String(data.age) : ""}
              onChangeText={(text) =>
                setFormData((prev: any) => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, age: text },
                }))
              }
            />
          </View>

          {/* Gender */}
          <View style={styles.inputCard}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.sexContainer}>
              <TouchableOpacity
                style={[
                  styles.sexOption,
                  data.gender === 2 && styles.selectedOption,
                ]}
                onPress={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, gender: 2 },
                  }))
                }
              >
                <Text
                  style={[
                    styles.sexText,
                    data.gender === 2 && styles.selectedText,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sexOption,
                  data.gender === 1 && styles.selectedOption,
                ]}
                onPress={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, gender: 1 },
                  }))
                }
              >
                <Text
                  style={[
                    styles.sexText,
                    data.gender === 1 && styles.selectedText,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Question 1: ALWAYS VISIBLE */}
          <View style={styles.inputCard}>
            <Text style={styles.label}>
              Do you know your blood glucose levels?
            </Text>
            {["Yes", "No"].map((option) => {
              const val = option === "Yes" ? "1" : "0";
              return (
                <TouchableOpacity
                  key={option}
                  style={styles.optionRow}
                  onPress={() => handleSelect("knowbgl", val)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      String(data.knowbgl) === String(val) &&
                        styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {data.knowbgl === "1" && (
            <>
              {/* Height */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.height ? String(data.height) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, height: text },
                    }))
                  }
                />
              </View>

              {/* Weight */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.weight ? String(data.weight) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, weight: text },
                    }))
                  }
                />
              </View>

              {/* Waist */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>Waist Circumference (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.waist ? String(data.waist) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, waist: text },
                    }))
                  }
                />
              </View>

              {/* Hip */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>Hip Circumference (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.hip ? String(data.hip) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, hip: text },
                    }))
                  }
                />
              </View>

              {/* Blood Pressure */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>
                  Blood Pressure (Systolic / Diastolic)
                </Text>
                <View style={styles.bpRow}>
                  <TextInput
                    style={[styles.input, styles.bpInput, { marginRight: 8 }]}
                    placeholder="Sys"
                    keyboardType="numeric"
                    value={data.systolic ? String(data.systolic) : ""}
                    onChangeText={(text) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, systolic: text },
                      }))
                    }
                  />
                  <TextInput
                    style={[styles.input, styles.bpInput]}
                    placeholder="Dia"
                    keyboardType="numeric"
                    value={data.diastolic ? String(data.diastolic) : ""}
                    onChangeText={(text) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, diastolic: text },
                      }))
                    }
                  />
                </View>
              </View>

              {/* Lab Values */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>HBA1C (%)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.hba1c ? String(data.hba1c) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, hba1c: text },
                    }))
                  }
                />
              </View>

              <View style={styles.inputCard}>
                <Text style={styles.label}>FBS (mg/dL)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.fbs ? String(data.fbs) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, fbs: text },
                    }))
                  }
                />
              </View>

              <View style={styles.inputCard}>
                <Text style={styles.label}>Total Cholesterol (mg/dL)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.cholesterol ? String(data.cholesterol) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, cholesterol: text },
                    }))
                  }
                />
              </View>

              <View style={styles.inputCard}>
                <Text style={styles.label}>HDL (mg/dL)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.hdl ? String(data.hdl) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, hdl: text },
                    }))
                  }
                />
              </View>
            </>
          )}

          {data.knowbgl === "0" && (
            <>
              {/* Height */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.height ? String(data.height) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, height: text },
                    }))
                  }
                />
              </View>

              {/* Weight */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.weight ? String(data.weight) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, weight: text },
                    }))
                  }
                />
              </View>

              {/* Waist */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>Waist Circumference (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.waist ? String(data.waist) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, waist: text },
                    }))
                  }
                />
              </View>

              {/* Hip */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>Hip Circumference (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={data.hip ? String(data.hip) : ""}
                  onChangeText={(text) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, hip: text },
                    }))
                  }
                />
              </View>

              {/* Blood Pressure */}
              <View style={styles.inputCard}>
                <Text style={styles.label}>
                  Blood Pressure (Systolic / Diastolic)
                </Text>
                <View style={styles.bpRow}>
                  <TextInput
                    style={[styles.input, styles.bpInput, { marginRight: 8 }]}
                    placeholder="Sys"
                    keyboardType="numeric"
                    value={data.systolic ? String(data.systolic) : ""}
                    onChangeText={(text) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, systolic: text },
                      }))
                    }
                  />
                  <TextInput
                    style={[styles.input, styles.bpInput]}
                    placeholder="Dia"
                    keyboardType="numeric"
                    value={data.diastolic ? String(data.diastolic) : ""}
                    onChangeText={(text) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, diastolic: text },
                      }))
                    }
                  />
                </View>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.continueButton} onPress={onNext}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.continueText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ============================================================
   STYLES — UNCHANGED
   ============================================================ */
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
  scanButton: {
    flexDirection: "row",
    backgroundColor: "#0B1956",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  scanButtonText: {
    color: "#FFF",
    fontWeight: "700",
    marginLeft: 10,
    fontSize: 16,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#101623E6",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#E5E7EB",
    borderRadius: 32,
    paddingHorizontal: 15,
    height: 40,
  },
  sexContainer: { flexDirection: "row", justifyContent: "space-around" },
  sexOption: {
    backgroundColor: "rgba(229, 231, 235, 0.7)",
    borderColor: "#0B1956",
    borderWidth: 1,
    borderRadius: 50,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: { backgroundColor: "#0B1956" },
  sexText: { color: "#000", fontSize: 14 },
  selectedText: { color: "#FFF", fontWeight: "600" },
  continueButton: {
    backgroundColor: "#0B1956",
    borderRadius: 32,
    paddingVertical: 15,
    marginTop: 30,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  bpRow: { flexDirection: "row" },
  bpInput: { flex: 1 },
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
});
