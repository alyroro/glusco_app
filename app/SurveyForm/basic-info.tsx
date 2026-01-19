import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BasicInfo({ data, setFormData, onNext, loading }: any) {
  // const [selectedSex, setSelectedSex] = useState<string | null>(null);
  // const [recordsAccess, setRecordsAccess] = useState<string | null>(null);

  // const [username, setUsername] = useState<string>("");
  // const [age, setAge] = useState<string>("");
  // const [height, setHeight] = useState<string>("");
  // const [weight, setWeight] = useState<string>("");
  // const [waist, setWaist] = useState<string>("");
  // const [hip, setHip] = useState<string>("");

  // const [systolic, setSystolic] = useState<string>("");
  // const [diastolic, setDiastolic] = useState<string>("");

  // const [hba1c, setHba1c] = useState<string>("");
  // const [fbs, setFbs] = useState<string>("");
  // const [totalCholesterol, setTotalCholesterol] = useState<string>("");
  // const [hdl, setHdl] = useState<string>("");

  const router = useRouter();

  const currentStep = 1;
  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

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
            We’ll start with a few simple details to help us understand you
            better and provide more accurate health insights.
          </Text>

          <View style={styles.inputCard}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#777"
              value={data.username}
              onChangeText={(text) =>
                setFormData((prev: { basicInfo: any }) => ({
                  ...prev,
                  basicInfo: {
                    ...prev.basicInfo,
                    username: text,
                  },
                }))
              }
            />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>How old are you?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              keyboardType="numeric"
              placeholderTextColor="#777"
              value={data.age}
              onChangeText={(text) =>
                setFormData((prev: { basicInfo: any }) => ({
                  ...prev,
                  basicInfo: {
                    ...prev.basicInfo,
                    age: text,
                  },
                }))
              }
            />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>Sex</Text>
            <View style={styles.sexContainer}>
              <TouchableOpacity
                style={[
                  styles.sexOption,
                  data.gender === 2 && styles.selectedOption,
                ]}
                onPress={(text) =>
                  setFormData((prev: { basicInfo: any }) => ({
                    ...prev,
                    basicInfo: {
                      ...prev.basicInfo,
                      gender: 2,
                    },
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
                  setFormData((prev: { basicInfo: any }) => ({
                    ...prev,
                    basicInfo: {
                      ...prev.basicInfo,
                      gender: 1,
                    },
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

          {/* <View style={styles.inputCard}>
          <Text style={styles.label}>
            Do you have access to your clinical records, such as your blood
            sugar levels?
          </Text>

          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setRecordsAccess("Yes")}
            >
              <View
                style={[
                  styles.radioCircle,
                  recordsAccess === "Yes" && styles.radioChecked,
                ]}
              />
              <Text style={styles.radioLabel}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setRecordsAccess("No")}
            >
              <View
                style={[
                  styles.radioCircle,
                  recordsAccess === "No" && styles.radioChecked,
                ]}
              />
              <Text style={styles.radioLabel}>No</Text>
            </TouchableOpacity>
          </View>
        </View> */}

          <View style={styles.inputCard}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your height"
              keyboardType="numeric"
              placeholderTextColor="#777"
              autoComplete="off"
              importantForAutofill="no"
              textContentType="none"
              value={data.height}
              onChangeText={(text) =>
                setFormData((prev: { basicInfo: any }) => ({
                  ...prev,
                  basicInfo: {
                    ...prev.basicInfo,
                    height: text,
                  },
                }))
              }
            />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your weight"
              keyboardType="numeric"
              placeholderTextColor="#777"
              autoComplete="off"
              importantForAutofill="no"
              textContentType="none"
              value={data.weight}
              onChangeText={(text) =>
                setFormData((prev: { basicInfo: any }) => ({
                  ...prev,
                  basicInfo: {
                    ...prev.basicInfo,
                    weight: text,
                  },
                }))
              }
            />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>Waist Circumference (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter waist circumference"
              keyboardType="numeric"
              placeholderTextColor="#777"
              value={data.waist}
              onChangeText={(text) =>
                setFormData((prev: { basicInfo: any }) => ({
                  ...prev,
                  basicInfo: {
                    ...prev.basicInfo,
                    waist: text,
                  },
                }))
              }
            />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>Hip Circumference (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter hip circumference"
              keyboardType="numeric"
              placeholderTextColor="#777"
              value={data.hip}
              onChangeText={(text) =>
                setFormData((prev: { basicInfo: any }) => ({
                  ...prev,
                  basicInfo: {
                    ...prev.basicInfo,
                    hip: text,
                  },
                }))
              }
            />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>
              Blood Pressure (Systolic / Diastolic)
            </Text>
            <View style={styles.bpRow}>
              <TextInput
                style={[styles.input, styles.bpInput, { marginRight: 8 }]}
                placeholder="Systolic"
                keyboardType="numeric"
                placeholderTextColor="#777"
                value={data.systolic}
                onChangeText={(text) =>
                  setFormData((prev: { basicInfo: any }) => ({
                    ...prev,
                    basicInfo: {
                      ...prev.basicInfo,
                      systolic: text,
                    },
                  }))
                }
              />
              <TextInput
                style={[styles.input, styles.bpInput]}
                placeholder="Diastolic"
                keyboardType="numeric"
                placeholderTextColor="#777"
                value={data.diastolic}
                onChangeText={(text) =>
                  setFormData((prev: { basicInfo: any }) => ({
                    ...prev,
                    basicInfo: {
                      ...prev.basicInfo,
                      diastolic: text,
                    },
                  }))
                }
              />
            </View>
          </View>

          <>
            <View style={styles.inputCard}>
              <Text style={styles.label}>HBA1C</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter HBA1C (%)"
                keyboardType="numeric"
                placeholderTextColor="#777"
                value={data.hba1c}
                onChangeText={(text) =>
                  setFormData((prev: { basicInfo: any }) => ({
                    ...prev,
                    basicInfo: {
                      ...prev.basicInfo,
                      hba1c: text,
                    },
                  }))
                }
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.label}>FBS</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter FBS (mg/dL)"
                keyboardType="numeric"
                placeholderTextColor="#777"
                value={data.fbs}
                onChangeText={(text) =>
                  setFormData((prev: { basicInfo: any }) => ({
                    ...prev,
                    basicInfo: {
                      ...prev.basicInfo,
                      fbs: text,
                    },
                  }))
                }
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.label}>Total Cholesterol</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter total cholesterol (mg/dL)"
                keyboardType="numeric"
                placeholderTextColor="#777"
                value={data.cholesterol}
                onChangeText={(text) =>
                  setFormData((prev: { basicInfo: any }) => ({
                    ...prev,
                    basicInfo: {
                      ...prev.basicInfo,
                      cholesterol: text,
                    },
                  }))
                }
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.label}>HDL</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter HDL (mg/dL)"
                keyboardType="numeric"
                placeholderTextColor="#777"
                value={data.hdl}
                onChangeText={(text) =>
                  setFormData((prev: { basicInfo: any }) => ({
                    ...prev,
                    basicInfo: {
                      ...prev.basicInfo,
                      hdl: text,
                    },
                  }))
                }
              />
            </View>
          </>

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

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F8F3ED",
    paddingVertical: 40,
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 30,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 20,
  },
  backButton: {
    marginRight: 10,
  },
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
    textAlign: "left",
    color: "#101623E6",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "left",
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
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#E5E7EB",
    borderRadius: 32,
    paddingHorizontal: 15,
    height: 40,
  },
  sexContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 1,
  },
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
  selectedOption: {
    backgroundColor: "#0B1956",
  },
  sexText: {
    color: "#000",
    fontSize: 14,
  },
  selectedText: {
    color: "#FFF",
    fontWeight: "600",
  },
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

  radioContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0B1956",
    backgroundColor: "rgba(229,231,235,0.7)",
    marginRight: 10,
  },
  radioChecked: {
    backgroundColor: "#0B1956",
  },
  radioLabel: {
    fontSize: 16,
    color: "#000",
  },
  bpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bpInput: {
    flex: 1,
  },
});
