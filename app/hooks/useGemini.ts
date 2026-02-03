// hooks/useGemini.ts
import { useEffect, useState } from "react";
import {
  getCurrentUserAIReport,
  getUserGemini,
  getUserGeminiRetake,
} from "../api/userGemini";
import { AIReport } from "../types/GeminiTypes";

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

export function useUserAnalysis() {
  const [analysis, setAnalysis] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalysis() {
      const data = await getCurrentUserAIReport();
      setAnalysis(data);
      setLoading(false);
    }
    fetchAnalysis();
  }, []);

  return { analysis, analysisLoading: loading };
}
