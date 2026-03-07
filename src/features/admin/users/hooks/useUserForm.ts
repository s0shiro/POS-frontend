import { useState } from "react";
import type { CreateUserPayload, UserRole } from "../types";

export function useUserForm() {
  const [formData, setFormData] = useState<CreateUserPayload>({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "cashier",
    });
  };

  const updateField = (
    field: keyof CreateUserPayload,
    value: string | UserRole,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "Name is required";
    }
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!formData.password || formData.password.length < 8) {
      return "Password must be at least 8 characters";
    }
    return null;
  };

  return {
    formData,
    resetForm,
    updateField,
    validateForm,
    setFormData,
  };
}
