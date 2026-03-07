export const kdsKeys = {
  all: ["kds"] as const,
  orders: () => [...kdsKeys.all, "orders"] as const,
  stats: () => [...kdsKeys.all, "stats"] as const,
};
