import { GoogleGenerativeAI } from "@google/generative-ai";
import lightExercises from "../../assets/exercises/light_exercises.json";
import moderateExercises from "../../assets/exercises/moderate_exercises.json";
import vigorousExercises from "../../assets/exercises/vigorous_exercises.json";
import featureWeights from "../context/FeatureWeighs";
import { AIReport } from "../types/GeminiTypes";
import { supabase } from "./client";

const surveySchema = {
  dietaryFrequency: {
    type: "Ordinal",
    mapping: {
      1: "Never",
      2: "Rarely",
      3: "Occasionally",
      4: "Frequently",
      5: "Daily",
    },
  },
  fruitsVegetablesIntake: {
    type: "Ordinal",
    mapping: {
      1: "Daily",
      2: "Frequently",
      3: "Occasionally",
      4: "Rarely",
      5: "Never",
    },
  },
  weightLossSuccess: {
    type: "Ordinal",
    mapping: {
      1: "Successfully",
      2: "Yes but no change",
      3: "No attempt",
      4: "Never",
    },
  },
  exerciseStatus: {
    type: "Binary",
    mapping: { 1: "Yes", 2: "No" },
  },
  exerciseFrequency: {
    type: "Ordinal",
    mapping: {
      1: "5+ times/week",
      2: "3–4 times/week",
      3: "1–2 times/week",
      4: "Never",
    },
  },
  exerciseDuration: {
    type: "Ordinal",
    mapping: {
      1: ">60 mins",
      2: "30–60 mins",
      3: "15–30 mins",
      4: "<15 mins",
      5: "No exercise",
    },
  },
  sittingTime: {
    type: "Ordinal",
    mapping: { 1: "<3 hours", 2: "3–6 hours", 3: "6–9 hours", 4: ">9 hours" },
  },
  activityLevel: {
    type: "Ordinal",
    mapping: {
      1: "Vigorous",
      2: "Moderate",
      3: "Light standing/walking",
      4: "Mostly sedentary",
    },
  },
  occupationalActivity: {
    type: "Ordinal",
    mapping: {
      1: "Vigorous",
      2: "Moderate",
      3: "Light standing/walking",
      4: "Mostly sedentary",
    },
  },
  transportation: {
    type: "Ordinal",
    mapping: {
      1: "Walking",
      2: "Biking",
      3: "Public transport",
      4: "Private vehicle",
    },
  },
  sleepHours: {
    type: "Ordinal",
    mapping: { 1: ">8 hours", 2: "7–8 hours", 3: "5–6 hours", 4: "<5 hours" },
  },
  smokingStatus: {
    type: "Ordinal",
    mapping: { 1: "Never", 2: "Former", 3: "Occasionally", 4: "Regularly" },
  },
  alcoholConsumption: {
    type: "Ordinal",
    mapping: { 1: "Never", 2: "Occasionally", 3: "Weekly", 4: "Almost daily" },
  },
  familyHistoryAge: {
    type: "Ordinal",
    mapping: {
      1: "No",
      2: "Not sure",
      3: "Before 40",
      4: "40-59",
      5: "60 or older",
    },
  },
  healthConcernLevel: {
    type: "Ordinal",
    mapping: {
      1: "Not concerned",
      2: "Slightly",
      3: "Somewhat",
      4: "Concerned",
      5: "Very concerned",
    },
  },
};

export const getUserGemini = async (modelPrediction: object) => {
  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // Note: gemini-3-flash-preview might be unstable or have different naming; 1.5-flash is the current stable standard
    systemInstruction:
      "You are a professional Medical Assistant AI. You interpret clinical data. You NEVER diagnose. You ONLY return valid JSON.",
  });

  try {
    const prompt = `
      CONTEXT:
      - Model Weights: ${JSON.stringify(featureWeights)}
      - Clinical Thresholds: HbA1c (Normal <5.7, Diabetes >=6.5), FBS (Normal <100, Diabetes >=126)
      - If percent is < 31, return "low"; if percent is < 61, return "moderate"; else return "vigorous".

      PATIENT DATA:
      ${JSON.stringify(modelPrediction)}

      SURVEY SCHEMA:
      ${JSON.stringify(surveySchema)}

      EXERCISES:
      - ${JSON.stringify(lightExercises)}
      - ${JSON.stringify(moderateExercises)}
      - ${JSON.stringify(vigorousExercises)}

      INSTRUCTION:
      Identify the top 2 factors driving the current risk score.
      Provide a clear 'Next Step'. Identify which lifestyle factors (from the weights/schema) contributed most to the risk change. 
      Generate 5 highly specific, actionable "Daily Tasks" for the user to help reduce their risk next week. Make it clear, concise and short. Use simple language and talk to the patient directly.

      OUTPUT FORMAT:
      Return response ONLY as JSON: 
      {
        "summary": "overall text",
        "top_drivers": [{"feature": "name", "impact": "description"}],
        "specific_changes": ["change 1", "change 2"],
        "advice": ["bullet point 1", "bullet point 2"],
        "daily_tasks": [
      {
        "id": "unique_string",
        "label": "Drink 8 glasses of water",
        "icon": "water",
        "reasoning": "Because user reported low hydration while HbA1c is high."
      },
      {
        "id": "unique_string",
        "label": "30 min brisk walk",
        "icon": "walk",
        "reasoning": "To counteract the rise in FBS levels."
      }
    ],
        "disclaimer": "legal text"
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = await result.response;
    const text = response.text();
    console.log("Response Text:", response);
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    // CLEANING: Remove any potential markdown code blocks if the AI ignored the MIME type
    const cleanedText = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Return a fallback object so your UI doesn't crash
    return {
      summary: "Unable to generate AI analysis at this time.",
      top_drivers: [],
      advice: [
        "Please consult a medical professional for a detailed review of your results.",
      ],
      disclaimer: "AI analysis failed.",
    };
  }
};

export const getUserGeminiRetake = async ({
  modelPredictionLastWeek,
  modelPredictionThisWeek,
}: {
  modelPredictionLastWeek: object;
  modelPredictionThisWeek: object;
}) => {
  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // Note: gemini-3-flash-preview might be unstable or have different naming; 1.5-flash is the current stable standard
    systemInstruction:
      "You are a professional Medical Assistant AI. You interpret clinical and lifestyle data for predicting Diabetes. Compare the data taken  You NEVER diagnose. You ONLY return valid JSON.",
  });

  try {
    const prompt = `
      CONTEXT:
      - Model Weights: ${JSON.stringify(featureWeights)}
      - Clinical Thresholds: HbA1c (Normal <5.7, Diabetes >=6.5), FBS (Normal <100, Diabetes >=126)
      
      PATIENT DATA LAST WEEK:
      ${JSON.stringify(modelPredictionLastWeek)}

      PATIENT DATA THIS WEEK:
      ${JSON.stringify(modelPredictionThisWeek)}

      SURVEY SCHEMA:
      ${JSON.stringify(surveySchema)}

      EXERCISES:
      - ${JSON.stringify(lightExercises)}
      - ${JSON.stringify(moderateExercises)}
      - ${JSON.stringify(vigorousExercises)}

      Explain to the user:
      1. Did they have a 'Good' or 'Bad' week?
      2. What specific change (e.g. exercise) caused the drop or rise in risk?
      3. What should they focus on next week (e.g. reducing fried food)?
      4. Identify which lifestyle factors (from the weights/schema) contributed most to the risk change. 
      5. Generate 5 highly specific, actionable "Daily Tasks" for the user to help reduce their risk next week.

      OUTPUT FORMAT:
      Return response ONLY as JSON: 
      {
        "summary": "overall text",
        "risk_delta": "Value of increase/decrease"
        "top_drivers": [{"feature": "name", "impact": "description"}],
        "specific_changes": ["change 1", "change 2"],
        "advice": ["bullet point 1", "bullet point 2"],
        "daily_tasks": [
      {
        "id": "unique_string",
        "label": "Drink 8 glasses of water",
        "icon": "water",
        "reasoning": "Because user reported low hydration while HbA1c is high."
      },
      {
        "id": "unique_string",
        "label": "30 min brisk walk",
        "icon": "walk",
        "reasoning": "To counteract the rise in FBS levels."
      }
    ],
        "disclaimer": "legal text"
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = await result.response;
    const text = response.text();
    console.log("Response Text:", response);
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    // CLEANING: Remove any potential markdown code blocks if the AI ignored the MIME type
    const cleanedText = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Return a fallback object so your UI doesn't crash
    return {
      summary: "Unable to generate AI analysis at this time.",
      top_drivers: [],
      advice: [
        "Please consult a medical professional for a detailed review of your results.",
      ],
      disclaimer: "AI analysis failed.",
    };
  }
};

export const insertAnalysisToDB = async (
  ai_analysis: AIReport,
  user_id: string,
) => {
  try {
    const { data, error } = await supabase
      .from("ai_analysis")
      .insert({
        user_id: user_id,
        summary: ai_analysis.summary,
        top_drivers: ai_analysis.top_drivers,
        specific_changes: ai_analysis.specific_changes,
        daily_tasks: ai_analysis.daily_tasks,
        risk_delta: ai_analysis.risk_delta,
        advice: ai_analysis.advice,
        disclaimer: ai_analysis.disclaimer,
      })
      .select();

    if (!data || error) {
      console.error("Error inserting AI analysis:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error inserting AI analysis:", error);
    return null;
  }
};

export const getCurrentUserAIReport = async () => {
  // 1. Get the ID of the authenticated user from the session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  // 2. Fetch only the LATEST row for this user
  const { data, error } = await supabase
    .from("ai_analysis")
    .select("*")
    .eq("uuid", user.id)
    .order("created_at", { ascending: false }) // Newest first
    .limit(1) // Get only one record
    .maybeSingle(); // Returns the object directly, or null if nothing found

  if (error) {
    console.error("Error fetching latest AI report:", error);
    return null;
  }

  return data; // This will now be a single object, not an array
};
