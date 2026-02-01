interface Driver {
  feature: string;
  impact: string;
}

interface GeminiResult {
  summary: string;
  top_drivers: Driver[];
  specific_changes: string[];
  advice: string[];
  disclaimer: string;
}

export interface AIReport {
  summary: string;
  top_drivers: Driver[];
  specific_changes: string[];
  advice: string[];
  disclaimer: string;
}

export interface GeminiResultRetake {
  summary: string;
  top_drivers: Driver[];
  specific_changes: string[];
  advice: string[];
  disclaimer: string;
}
export default GeminiResult;
