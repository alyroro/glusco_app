// hooks/useGemini.ts
import { useEffect, useState } from "react";
import { getUserGemini, getUserGeminiRetake } from "../api/userGemini";

export function useGemini(modelPrediction: object | null) {
  const [resultText, setResultText] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if we actually have prediction data
    if (!modelPrediction) return;

    async function loadAIExplanation() {
      setLoading(true);
      try {
        const result = await getUserGemini(modelPrediction!);
        console.log("Gemini Result:", result);
        setResultText(result);
      } catch (err) {
        console.error("Gemini Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAIExplanation();
  }, [modelPrediction]); // Re-run whenever predictionData changes

  return { resultText, aiLoading: loading };
}

export function useGeminiRetake({
  modelPredictionLastWeek,
  modelPredictionThisWeek,
}: {
  modelPredictionLastWeek: any;
  modelPredictionThisWeek: any;
}) {
  const [resultText, setResultText] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if we actually have prediction data
    if (!modelPredictionLastWeek || !modelPredictionThisWeek) return;

    async function loadAIExplanation() {
      setLoading(true);
      try {
        const result = await getUserGeminiRetake({
          modelPredictionLastWeek,
          modelPredictionThisWeek,
        });
        console.log("Gemini Result:", result);
        setResultText(result);
      } catch (err) {
        console.error("Gemini Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAIExplanation();
  }, [modelPredictionLastWeek, modelPredictionThisWeek]); // Re-run whenever predictionData changes

  return { resultText, aiLoading: loading };
}
