import { useState } from "react";

export interface ModifierFormData {
  name: string;
  priceAdjustment: string;
  isRequired: boolean;
}

export const initialModifierFormData: ModifierFormData = {
  name: "",
  priceAdjustment: "0.00",
  isRequired: false,
};

export function useModifierForm() {
  const [formData, setFormData] = useState<ModifierFormData>(
    initialModifierFormData,
  );

  const resetForm = () => {
    setFormData(initialModifierFormData);
  };

  const updateField = <K extends keyof ModifierFormData>(
    field: K,
    value: ModifierFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "Modifier name is required";
    }
    return null;
  };

  return {
    formData,
    setFormData,
    resetForm,
    updateField,
    validateForm,
  };
}
