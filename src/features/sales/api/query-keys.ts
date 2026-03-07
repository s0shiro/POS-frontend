export const salesKeys = {
  all: ["sales"] as const,
  summaries: () => [...salesKeys.all, "summary"] as const,
  summary: (date: string) => [...salesKeys.summaries(), date] as const,
  transactions: () => [...salesKeys.all, "transactions"] as const,
  transaction: (date: string, cashierId?: string) =>
    [...salesKeys.transactions(), { date, cashierId }] as const,
};
