export type UserRole = "admin" | "cashier" | "kitchen" | "printer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  banned: boolean | null;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const roleColors: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-800",
  cashier: "bg-blue-100 text-blue-800",
  kitchen: "bg-orange-100 text-orange-800",
  printer: "bg-green-100 text-green-800",
};

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  cashier: "Cashier",
  kitchen: "Kitchen",
  printer: "Printer",
};

export const ITEMS_PER_PAGE = 10;
