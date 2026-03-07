// Format elapsed time
export const formatElapsedTime = (minutes: number) => {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Get urgency color based on elapsed time
export const getUrgencyColor = (minutes: number, status: string) => {
  if (status === "preparing")
    return "border-blue-500 bg-blue-500/10 text-blue-500 dark:bg-blue-500/20";
  if (minutes >= 15)
    return "border-red-500 bg-red-500/10 text-red-500 dark:bg-red-500/20";
  if (minutes >= 10)
    return "border-orange-500 bg-orange-500/10 text-orange-500 dark:bg-orange-500/20";
  if (minutes >= 5)
    return "border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-500";
  return "border-green-500 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-500";
};
