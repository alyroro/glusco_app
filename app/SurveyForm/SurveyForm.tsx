import { useState } from "react";
import supabase from "../api/client";
import { useProfile } from "../hooks/useProfile";
import { SurveyFormData } from "../types/SurveyFormData";
import { PredictionData } from "../types/UserDB";
import BasicInfo from "./basic-info";
import DietaryHabits from "./dietary-habits";
import FamilyHistory from "./family-history";
import PhysicalActivity from "./physical-activity";
import RiskResult from "./risk-result";
import SleepSubstance from "./sleep-substance";

export default function SurveyForm() {
  const [step, setStep] = useState(0);
  const { profile, loading: profileLoading } = useProfile();
  const [predictionData, setPredictionData] = useState<{
    clinical: number;
    lifestyle: number;
    combined: number;
    percent: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SurveyFormData>({
    basicInfo: {
      username: "",
      age: "",
      gender: 0,
      height: "",
      weight: "",
      waist: "",
      hip: "",
      systolic: "",
      diastolic: "",
      hba1c: "",
      fbs: "",
      cholesterol: "",
      hdl: "",
    },
    dietaryHabits: {
      fruits: 0,
      vegetables: 0,
      fried: 0,
      sweets: 0,
      fastfood: 0,
      processed: 0,
      softdrink: 0,
      weight_concern: 0,
    },
    physicalActivity: {
      exercise_times: 4,
      exercise_duration: 5,
      sitting: 0,
      main_activity: 0,
      mode_of_transpo: 0,
      doesExercise: null,
      exercise_types: [],
    },
    sleepSubstance: {
      sleep_hours: 0,
      sleep_cigarette: 0,
      sleep_alcohol: 0,
    },
    familyHistory: {
      fh_father: 0,
      fh_mother: 0,
      fh_sister: 0,
      fh_brother: 0,
      fh_extended: 0,
    },
  });

  const isBasicInfoValid = async () => {
    const info = formData.basicInfo;

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    // Numbers: Allows only digits and a single decimal point
    const numericRegex = /^\d*\.?\d+$/;

    // --- 3. Validate Username ---
    if (!usernameRegex.test(info.username)) {
      alert("Username can only contain letters, numbers, and underscores.");
      return false;
    }

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
      info.diastolic.trim() !== "" &&
      info.hba1c.trim() !== "" &&
      info.fbs.trim() !== "" &&
      info.cholesterol.trim() !== "" &&
      info.hdl.trim() !== "";

    if (!allFieldsFilled) {
      alert("Please fill in all fields.");
      return false;
    }

    // 2. Check Username Availability (Network check)
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("username, email")
      .eq("username", info.username.trim())
      .maybeSingle(); // maybeSingle doesn't throw an error if 0 rows found

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (existingUser && existingUser.email !== user?.email) {
      alert("This username is already taken. Please choose another one.");
      return false;
    }

    return true;
  };

  const isDietaryHabitsValid = () => {
    const d = formData.dietaryHabits;

    return (
      d.fruits !== 0 &&
      d.vegetables !== 0 &&
      d.fried !== 0 &&
      d.sweets !== 0 &&
      d.fastfood !== 0 &&
      d.processed !== 0 &&
      d.softdrink !== 0 &&
      d.weight_concern !== 0
    );
  };

  const isPhysicalActivityValid = () => {
    const p = formData.physicalActivity;

    return (
      p.exercise_times !== 0 &&
      p.exercise_duration !== 0 &&
      p.sitting !== 0 &&
      p.main_activity !== 0 &&
      p.mode_of_transpo !== 0
    );
  };

  const isSleepSubstanceValid = () => {
    const s = formData.sleepSubstance;

    return (
      s.sleep_hours !== 0 && s.sleep_cigarette !== 0 && s.sleep_alcohol !== 0
    );
  };

  const isFamilyHistoryValid = () => {
    const f = formData.familyHistory;

    return (
      f.fh_father !== 0 &&
      f.fh_mother !== 0 &&
      f.fh_sister !== 0 &&
      f.fh_brother !== 0 &&
      f.fh_extended !== 0
    );
  };

  const nextStep = async () => {
    console.log("--- CURRENT FORM DATA ---");
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
      hba1c: parseFloat(formData.basicInfo.hba1c),
      fbs: parseFloat(formData.basicInfo.fbs),
      cholesterol: parseFloat(formData.basicInfo.cholesterol),
      hdl: parseFloat(formData.basicInfo.hdl),
      doesExercise: formData.physicalActivity.doesExercise,
    };

    try {
      setLoading(true);
      console.log(flattenedData);
      const response = await fetch("http://192.168.100.6:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flattenedData),
      });

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
      hba1c: parseFloat(formData.basicInfo.hba1c) || 0,
      fbs: parseFloat(formData.basicInfo.fbs) || 0,
      cholesterol: parseFloat(formData.basicInfo.cholesterol) || 0,
      hdl: parseFloat(formData.basicInfo.hdl) || 0,
      // Dietary Habits (Convert category IDs to Floats)
      fruits: parseFloat(formData.dietaryHabits.fruits.toString()),
      vegetables: parseFloat(formData.dietaryHabits.vegetables.toString()),
      fried: parseFloat(formData.dietaryHabits.fried.toString()),
      sweets: parseFloat(formData.dietaryHabits.sweets.toString()),
      fastfood: parseFloat(formData.dietaryHabits.fastfood.toString()),
      processed: parseFloat(formData.dietaryHabits.processed.toString()),
      softdrink: parseFloat(formData.dietaryHabits.softdrink.toString()),
      weight_concern: parseFloat(
        formData.dietaryHabits.weight_concern.toString(),
      ),

      // Physical Activity
      exercise_times: parseFloat(
        formData.physicalActivity.exercise_times.toString(),
      ),
      exercise_duration: parseFloat(
        formData.physicalActivity.exercise_duration.toString(),
      ),
      sitting: parseFloat(formData.physicalActivity.sitting.toString()),
      main_activity: parseFloat(
        formData.physicalActivity.main_activity.toString(),
      ),
      mode_of_transpo: parseFloat(
        formData.physicalActivity.mode_of_transpo.toString(),
      ),

      // Sleep & Substance
      sleep_hours: parseFloat(formData.sleepSubstance.sleep_hours.toString()),
      sleep_cigarette: parseFloat(
        formData.sleepSubstance.sleep_cigarette.toString(),
      ),
      sleep_alcohol: parseFloat(
        formData.sleepSubstance.sleep_alcohol.toString(),
      ),

      // Family History
      fh_father: parseFloat(formData.familyHistory.fh_father.toString()),
      fh_mother: parseFloat(formData.familyHistory.fh_mother.toString()),
      fh_sister: parseFloat(formData.familyHistory.fh_sister.toString()),
      fh_brother: parseFloat(formData.familyHistory.fh_brother.toString()),
      fh_extended: parseFloat(formData.familyHistory.fh_extended.toString()),
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
    </>
  );
}
