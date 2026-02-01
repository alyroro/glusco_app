import { GoogleGenerativeAI } from "@google/generative-ai";
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
      
      PATIENT DATA:
      ${JSON.stringify(modelPrediction)}

      SURVEY SCHEMA:
      ${JSON.stringify(surveySchema)}

      INSTRUCTION:
      Identify the top 2 factors driving the current risk score. Explain them using the thresholds. 
      Provide a clear 'Next Step'. Also explain what specific changes can be made to reduce the risk. Make it clear, concise and short. Use simple language and talk to the patient directly.

      OUTPUT FORMAT:
      Return response ONLY as JSON: 
      {
        "summary": "overall text",
        "top_drivers": [{"feature": "name", "impact": "description"}],
        "specific_changes": ["change 1", "change 2"],
        "advice": ["bullet point 1", "bullet point 2"],
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

      Explain to the user:
      1. Did they have a 'Good' or 'Bad' week?
      2. What specific change (e.g. exercise) caused the drop or rise in risk?
      3. What should they focus on next week (e.g. reducing fried food)?

      OUTPUT FORMAT:
      Return response ONLY as JSON: 
      {
        "summary": "overall text",
        "top_drivers": [{"feature": "name", "impact": "description"}],
        "specific_changes": ["change 1", "change 2"],
        "advice": ["bullet point 1", "bullet point 2"],
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
