interface Driver {
  feature: string;
  impact: string;
}

export interface DailyTask {
  id: string;
  label: string;
  icon: string;
  reasoning: string;
}

interface GeminiResult {
  summary: string;
  risk_delta?: number;
  daily_tasks?: DailyTask[];
  top_drivers: Driver[];
  specific_changes: string[];
  advice: string[];
  disclaimer: string;
}

export interface AIReport {
  summary: string;
  risk_delta?: number;
  daily_tasks?: DailyTask[];
  top_drivers: Driver[];
  specific_changes: string[];
  advice: string[];
  disclaimer: string;
}

export interface GeminiResultRetake {
  summary: string;
  risk_delta?: number;
  daily_tasks?: DailyTask[];
  top_drivers: Driver[];
  specific_changes: string[];
  advice: string[];
  disclaimer: string;
}
export default GeminiResult;
