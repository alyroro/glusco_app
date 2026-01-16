import { useState } from "react";
import { SurveyFormData } from "../types/SurveyFormData";
import BasicInfo from "./basic-info";
import DietaryHabits from "./dietary-habits";
import FamilyHistory from "./family-history";
import PhysicalActivity from "./physical-activity";
import RiskResult from "./risk-result";
import SleepSubstance from "./sleep-substance";

export default function SurveyForm() {
  const [step, setStep] = useState(0);
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

  const isBasicInfoValid = () => {
    const {
      username,
      age,
      gender,
      height,
      weight,
      waist,
      hip,
      systolic,
      diastolic,
      hba1c,
      fbs,
      cholesterol,
      hdl,
    } = formData.basicInfo;

    return (
      username.trim() !== "" &&
      age.trim() !== "" &&
      gender !== 0 &&
      height.trim() !== "" &&
      weight.trim() !== "" &&
      waist.trim() !== "" &&
      hip.trim() !== "" &&
      systolic.trim() !== "" &&
      diastolic.trim() !== "" &&
      hba1c.trim() !== "" &&
      fbs.trim() !== "" &&
      cholesterol.trim() !== "" &&
      hdl.trim() !== ""
    );
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

  const nextStep = () => {
    console.log("--- CURRENT FORM DATA ---");
    console.log(JSON.stringify(formData, null, 2));
    if (step === 0 && !isBasicInfoValid()) {
      alert("Please answer all required Basic Information fields.");
      return;
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

      // ... handle success
      setPredictionData(result);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <>
      {step === 0 && (
        <BasicInfo
          data={formData.basicInfo}
          setFormData={setFormData}
          onNext={nextStep}
          isValid={isBasicInfoValid()}
        />
      )}

      {step === 1 && (
        <DietaryHabits
          data={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
          isValid={isDietaryHabitsValid()}
        />
      )}

      {step === 2 && (
        <PhysicalActivity
          data={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
          isValid={isPhysicalActivityValid()}
        />
      )}

      {step === 3 && (
        <SleepSubstance
          data={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
          isValid={isSleepSubstanceValid()}
        />
      )}

      {step === 4 && (
        <FamilyHistory
          data={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
          isValid={isFamilyHistoryValid()}
        />
      )}

      {step === 5 && (
        <RiskResult
          data={formData}
          setFormData={setFormData}
          onNext={nextStep}
          onBack={prevStep}
          fetchPred={fetchPrediction}
          predictionData={predictionData}
          loading={loading}
        />
      )}
    </>
  );
}
