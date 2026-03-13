import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import supabase from "../api/client";
import { insertAnalysisToDB } from "../api/userGemini";
import { useUser } from "../context/UserContext";
import { useGeminiRetake } from "../hooks/useGemini";
import { SurveyFormData } from "../types/SurveyFormData";
import { PredictionData } from "../types/UserDB";
import AIExplanation from "./ai-explanation";
import BasicInfo from "./basic-info";
import DietaryHabits from "./dietary-habits";
import FamilyHistory from "./family-history";
import PhysicalActivity from "./physical-activity";
import RiskResult from "./risk-result";
import SleepSubstance from "./sleep-substance";

export default function SurveyForm() {
  const [step, setStep] = useState(0);
  const {
    profile,
    loading: loadingNew,
    predLoading,
    formData: formDataNew,
    formLoading,
  } = useUser();

  const [predictionData, setPredictionData] = useState<{
    clinical: number;
    lifestyle: number;
    combined: number;
    percent: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SurveyFormData | null>(null);
  const latestForm = Array.isArray(formDataNew)
    ? formDataNew[formDataNew.length - 1]
    : formDataNew;
  // --- FIX: Use useEffect to initialize state once data is available ---
  useEffect(() => {
    if (!loadingNew && !predLoading && !formLoading && !formData) {
      setFormData({
        basicInfo: {
          username: profile?.username || "",
          age: latestForm?.age || "",
          gender: latestForm?.gender || 0,
          height: latestForm?.height || "",
          weight: latestForm?.weight || "",
          waist: latestForm?.waist || "",
          hip: latestForm?.hip || "",
          systolic: latestForm?.systolic || "",
          diastolic: latestForm?.diastolic || "",
          hba1c: latestForm?.hba1c || "",
          fbs: latestForm?.fbs || "",
          cholesterol: latestForm?.cholesterol || "",
          hdl: latestForm?.hdl || "",
          knowbgl: latestForm?.knowbgl || "",
        },
        dietaryHabits: {
          // fruits: 0,
          vegetables: latestForm?.vegetables || 0,
          fried: latestForm?.fried || 0,
          sweets: latestForm?.sweets || 0,
          // fastfood: 0,
          // processed: 0,
          // softdrink: 0,
          weight_concern: latestForm?.weight_concern || 0,
        },
        physicalActivity: {
          // exercise_times: 4,
          exercise_duration: latestForm?.exercise_duration || 0,
          sitting: latestForm?.sitting || 0,
          // main_activity: 0,
          mode_of_transpo: latestForm?.mode_of_transpo || 0,
          doesExercise: latestForm?.doesExercise || null,
          exercise_types: [],
        },
        sleepSubstance: {
          // sleep_hours: 0,
          // sleep_cigarette: 0,
          sleep_alcohol: latestForm?.sleep_alcohol || 0,
        },
        familyHistory: {
          // fh_father: 0,
          // fh_mother: 0,
          // fh_sister: 0,
          // fh_brother: 0,
          // fh_extended: 0,
          any_family_diabetes: latestForm?.any_family_diabetes || null,
        },
      });
    }
  }, [loadingNew, predLoading, formLoading, profile, formDataNew]);

  const combinedData = useMemo(() => {
    // If we don't have a prediction yet, don't send anything to Gemini
    if (!predictionData || !formData) return null;

    return {
      // Spread the result from your Python API (percent, combined score, etc.)
      ...predictionData,
      // Spread the raw clinical and lifestyle inputs
      ...formData.basicInfo,
      ...formData.dietaryHabits,
      ...formData.physicalActivity,
      ...formData.sleepSubstance,
      ...formData.familyHistory,
    };
  }, [predictionData, formData]);

  const { resultText, aiLoading } = useGeminiRetake({
    modelPredictionLastWeek: latestForm,
    modelPredictionThisWeek: combinedData,
  });

  useEffect(() => {
    if (resultText && profile) {
      const insertAIReport = async () => {
        try {
          const data = await insertAnalysisToDB(resultText, profile.id);
          console.log("Inserted AI Analysis:", data);
        } catch (error) {
          console.error("Error inserting AI Analysis:", error);
        }
      };
      insertAIReport();
    }
  }, [resultText, profile]);

  if (loadingNew || predLoading || formLoading || !formData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={[styles.subtitle, { marginTop: 20 }]}>
          Getting your health data...
        </Text>
      </View>
    );
  }
  const isBasicInfoValid = async () => {
    const info = formData.basicInfo;

    // Numbers: Allows only digits and a single decimal point
    const numericRegex = /^\d*\.?\d+$/;

    const allFieldsFilled =
      info.username.trim() !== "" &&
      info.age.trim() !== "" &&
      info.gender !== 0 &&
      info.knowbgl.trim() !== "";

    if (!allFieldsFilled) {
      alert("Please fill in all fields.");
      return false;
    }
    if (info.knowbgl === "1") {
      const numericFields = [
        { label: "Age", value: info.age },
        { label: "Height", value: info.height },
        { label: "Weight", value: info.weight },
        { label: "Waist", value: info.waist },
        { label: "Hip", value: info.hip },
        { label: "Systolic", value: info.systolic },
        { label: "Diastolic", value: info.diastolic },
        { label: "HbA1c", value: info.hba1c },
        { label: "FBS", value: info.fbs },
        { label: "Cholesterol", value: info.cholesterol },
        { label: "HDL", value: info.hdl },
      ];

      for (const field of numericFields) {
        if (!numericRegex.test(field.value!)) {
          alert(
            `Invalid characters in ${field.label}. Please enter numbers only.`,
          );
          return false;
        }
      }

      // 1. Check if fields are empty FIRST (Local check is faster)
      const allFieldsFilled =
        info.username.trim() !== "" &&
        info.age.trim() !== "" &&
        info.gender !== 0 &&
        info.height.trim() !== "" &&
        info.weight.trim() !== "" &&
        info.waist.trim() !== "" &&
        info.hip.trim() !== "" &&
        info.systolic.trim() !== "" &&
        info.diastolic.trim() !== "" &&
        info.hba1c?.trim() !== "" &&
        info.fbs?.trim() !== "" &&
        info.cholesterol?.trim() !== "" &&
        info.hdl?.trim() !== "";

      if (!allFieldsFilled) {
        alert("Please fill in all fields.");
        return false;
      }
    }
    if (info.knowbgl === "0") {
      const numericFields = [
        { label: "Age", value: info.age },
        { label: "Height", value: info.height },
        { label: "Weight", value: info.weight },
        { label: "Waist", value: info.waist },
        { label: "Hip", value: info.hip },
        { label: "Systolic", value: info.systolic },
        { label: "Diastolic", value: info.diastolic },
      ];

      for (const field of numericFields) {
        if (!numericRegex.test(field.value)) {
          alert(
            `Invalid characters in ${field.label}. Please enter numbers only.`,
          );
          return false;
        }
      }

      // 1. Check if fields are empty FIRST (Local check is faster)
      const allFieldsFilled =
        info.username.trim() !== "" &&
        info.age.trim() !== "" &&
        info.gender !== 0 &&
        info.height.trim() !== "" &&
        info.weight.trim() !== "" &&
        info.waist.trim() !== "" &&
        info.hip.trim() !== "" &&
        info.systolic.trim() !== "" &&
        info.diastolic.trim() !== "";

      if (!allFieldsFilled) {
        alert("Please fill in all fields.");
        return false;
      }
    }

    return true;
  };

  const isDietaryHabitsValid = () => {
    const d = formData.dietaryHabits;

    return (
      // d.fruits !== 0 &&
      d.vegetables !== 0 &&
      d.fried !== 0 &&
      d.sweets !== 0 &&
      // d.fastfood !== 0 &&
      // d.processed !== 0 &&
      // d.softdrink !== 0 &&
      d.weight_concern !== 0
    );
  };

  const isPhysicalActivityValid = () => {
    const p = formData.physicalActivity;

    if (p.doesExercise === 1) {
      return (
        // p.exercise_times !== 0 &&
        p.exercise_duration !== 0 &&
        p.sitting !== 0 &&
        // p.main_activity !== 0 &&
        p.mode_of_transpo !== 0
      );
    }
    if (p.doesExercise === 2) {
      return (
        // p.exercise_times !== 0 &&
        // p.exercise_duration !== 0 &&
        p.sitting !== 0 &&
        // p.main_activity !== 0 &&
        p.mode_of_transpo !== 0
      );
    }
    return p.doesExercise !== null;
  };

  const isSleepSubstanceValid = () => {
    const s = formData.sleepSubstance;

    return s.sleep_alcohol !== 0;
  };

  const isFamilyHistoryValid = () => {
    const f = formData.familyHistory;

    return (
      // f.fh_father !== 0 &&
      // f.fh_mother !== 0 &&
      // f.fh_sister !== 0 &&
      // f.fh_brother !== 0 &&
      // f.fh_extended !== 0 &&
      f.any_family_diabetes !== null
    );
  };

  const nextStep = async () => {
    console.log("--- CURRENT RETAKE FORM DATA ---");
    console.log(JSON.stringify(formData, null, 2));
    if (step === 0) {
      setLoading(true); // Optional: show a spinner while checking DB
      const isValid = await isBasicInfoValid(); // CRITICAL: await the result
      setLoading(false);

      if (!isValid) return; // Stop here if validation fails
    }

    if (step === 1 && !isDietaryHabitsValid()) {
      alert("Please answer all required Dietary Habits questions.");
      return;
    }

    if (step === 2 && !isPhysicalActivityValid()) {
      alert("Please answer all required Physical Activity questions.");
      return;
    }

    if (step === 3 && !isSleepSubstanceValid()) {
      alert("Please answer all required Sleep & Substance questions.");
      return;
    }

    if (step === 4 && !isFamilyHistoryValid()) {
      alert("Please answer all required Family History questions.");
      return;
    }

    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const fetchPrediction = async () => {
    const flattenedData = {
      ...formData.basicInfo,
      ...formData.dietaryHabits,
      ...formData.physicalActivity,
      ...formData.sleepSubstance,
      ...formData.familyHistory,
      // Ensure numeric values are actually numbers, not strings
      age: parseInt(formData.basicInfo.age),
      height: parseFloat(formData.basicInfo.height),
      weight: parseFloat(formData.basicInfo.weight),
      waist: parseFloat(formData.basicInfo.waist),
      hip: parseFloat(formData.basicInfo.hip),
      systolic: parseInt(formData.basicInfo.systolic),
      diastolic: parseInt(formData.basicInfo.diastolic),
      knowbgl: parseInt(formData.basicInfo.knowbgl),
      hba1c: parseFloat(formData.basicInfo.hba1c?.toString() || "0"),
      fbs: parseFloat(formData.basicInfo.fbs?.toString() || "0"),
      cholesterol: parseFloat(
        formData.basicInfo.cholesterol?.toString() || "0",
      ),
      hdl: parseFloat(formData.basicInfo.hdl?.toString() || "0"),
      doesExercise: formData.physicalActivity.doesExercise,
    };

    try {
      setLoading(true);
      console.log(flattenedData);
      const response = await fetch(
        "https://thesisdiabetes-production.up.railway.app/predict2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(flattenedData),
        },
      );

      const result = await response.json();

      if (response.status === 422) {
        console.error("Validation Error Details:", result.detail);
        return 0;
      }
      console.log("Prediction Result:", result);
      // ... handle success
      setPredictionData(result);

      setLoading(false);
      return result;
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const insertFormData = async () => {
    const flattenedData = {
      exercise_types: formData.physicalActivity.exercise_types,
      // Basic Info (Converting strings/ints to Floats)
      age: parseFloat(formData.basicInfo.age) || 0,
      gender: parseFloat(formData.basicInfo.gender.toString()),
      height: parseFloat(formData.basicInfo.height) || 0,
      weight: parseFloat(formData.basicInfo.weight) || 0,
      waist: parseFloat(formData.basicInfo.waist) || 0,
      hip: parseFloat(formData.basicInfo.hip) || 0,
      systolic: parseFloat(formData.basicInfo.systolic) || 0,
      diastolic: parseFloat(formData.basicInfo.diastolic) || 0,
      hba1c: parseFloat(formData.basicInfo.hba1c?.toString() || "0"),
      fbs: parseFloat(formData.basicInfo.fbs?.toString() || "0"),
      cholesterol: parseFloat(
        formData.basicInfo.cholesterol?.toString() || "0",
      ),
      hdl: parseFloat(formData.basicInfo.hdl?.toString() || "0"),
      // Dietary Habits (Convert category IDs to Floats)
      vegetables: parseFloat(formData.dietaryHabits.vegetables.toString()),
      fried: parseFloat(formData.dietaryHabits.fried.toString()),
      sweets: parseFloat(formData.dietaryHabits.sweets.toString()),
      weight_concern: parseFloat(
        formData.dietaryHabits.weight_concern.toString(),
      ),

      // Physical Activity

      exercise_duration: parseFloat(
        formData.physicalActivity.exercise_duration.toString(),
      ),
      sitting: parseFloat(formData.physicalActivity.sitting.toString()),

      mode_of_transpo: parseFloat(
        formData.physicalActivity.mode_of_transpo.toString(),
      ),

      // Sleep & Substance

      sleep_alcohol: parseFloat(
        formData.sleepSubstance.sleep_alcohol.toString(),
      ),

      user_id: profile?.id || null,
    };
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_formdata")
        .insert(flattenedData);

      if (error) {
        alert("Failed to insert to database");
        console.log(error);
      }

      setLoading(false);
    } catch (err) {
      console.error("Insert error:", err);
    }
  };

  const updateUsername = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      console.log(user);
      // Use .update() to modify an existing record
      const { data, error } = await supabase
        .from("users")
        .update({
          // Use the actual username from your state, or email as fallback
          username: formData.basicInfo.username || user.email,
        })
        .eq("uuid", user.id); // Assuming your column name is 'uuid'

      if (error) {
        console.error("Update Error:", error.message);
        alert("Failed to update username: " + error.message);
      } else {
        console.log("Username updated successfully!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const insertPrediction = async (dataPrediction: PredictionData) => {
    const data = dataPrediction || predictionData;

    if (!data) {
      alert("No prediction data available to insert.");
      return;
    }

    const predData = {
      ...dataPrediction,
      user_id: profile?.id || null,
    };

    const { data: authData, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error);
      return;
    }

    try {
      setLoading(true);
      console.log(predData);
      const { data, error } = await supabase.from("pred").insert(predData);

      if (error) {
        alert(error.message);
        console.log(error);
      }

      setLoading(false);
    } catch (err) {
      console.error("Insert error:", err);
    }
  };

  return (
    <>
      {step === 0 && (
        <BasicInfo
          data={formData.basicInfo}
          setFormData={setFormData}
          onNext={nextStep}
          loading={loading}
        />
      )}

      {step === 1 && (
        <DietaryHabits
          data={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}

      {step === 2 && (
        <PhysicalActivity
          data={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}

      {step === 3 && (
        <SleepSubstance
          data={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}

      {step === 4 && (
        <FamilyHistory
          data={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}

      {step === 5 && (
        <RiskResult
          data={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
          fetchPred={fetchPrediction}
          insertFormData={insertFormData}
          insertPrediction={insertPrediction}
          updateUsername={updateUsername}
          predictionData={predictionData}
          loading={loading}
        />
      )}

      {step === 6 && (
        <AIExplanation aiText={resultText} aiLoading={aiLoading} />
      )}
    </>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,
  },
  summaryBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#0B1956",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingHorizontal: 30,
  },
  summaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",

    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#0B1956",
    alignItems: "center",
    paddingTop: 120,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 20,
    textAlign: "center",
  },
  centerContent: {
    justifyContent: "center",
    paddingTop: 0, // Reset padding when centering spinner
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  greeting: {
    fontSize: 15,
    color: "#000",
    marginTop: 5,
  },
  profilePicContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#0B1956",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  riskContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  innerCircleContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  riskPercent: {
    fontSize: 36,
    fontWeight: "700",
    color: "#121212",
  },

  riskLevelContainer: {
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  riskLevelLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#121212",
    textTransform: "capitalize",
    marginBottom: 10,
  },

  riskTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  riskLevel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#121212",
    marginTop: 5,
  },
  riskMessage: {
    fontSize: 13,
    textAlign: "center",
    color: "#555",
    marginTop: 5,
    width: 260,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 25,
    marginTop: 25,
  },

  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Ensures even spacing between the two cards
    marginTop: 30,
    paddingHorizontal: 16, // Better padding for side-by-side cards
  },
  card: {
    width: "48%", // This forces 2 items per row (48% + 48% + gap)
    height: 150,
    backgroundColor: "#E8D9EE",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16, // Vertical spacing between rows
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#121212",
    marginTop: 6,
  },
  cardSub: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    color: "#446CC3",
  },

  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  dayLabel: { fontSize: 10, color: "#000" },
  dayNumber: { fontSize: 10, color: "#000" },
});
