import { useEffect, useState } from "react";
import { getCurrentUserFormData } from "../api/userFormData";
import { FormData } from "../types/UserDB";

export function useFormData() {
  const [formData, setFormData] = useState<FormData | FormData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFormData() {
      const data = await getCurrentUserFormData();
      setFormData(data);
      setLoading(false);
    }
    loadFormData();
  }, []);

  return { formData, loading };
}
