export interface SurveyFormData {
  basicInfo: {
    username: string;
    age: string;
    gender: number;
    height: string;
    weight: string;
    waist: string;
    hip: string;
    knowbgl: string;
    systolic: string;
    diastolic: string;
    hba1c?: string;
    fbs?: string;
    cholesterol?: string;
    hdl?: string;
  };
  dietaryHabits: {
    fruits?: number;
    vegetables: number;
    fried: number;
    sweets: number;
    fastfood?: number;
    processed?: number;
    softdrink?: number;
    weight_concern: number;
  };
  physicalActivity: {
    exercise_times?: number;
    exercise_duration: number;
    exercise_types?: string[];
    sitting: number;
    main_activity?: number;
    mode_of_transpo: number;
    doesExercise: number | null;
  };
  sleepSubstance: {
    sleep_hours?: number;
    sleep_cigarette?: number;
    sleep_alcohol: number;
  };
  familyHistory: {
    fh_father?: number;
    fh_mother?: number;
    fh_sister?: number;
    fh_brother?: number;
    fh_extended?: number;
    any_family_diabetes?: number | null;
  };
}

export default SurveyFormData;
