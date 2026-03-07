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
  if (status === "preparing") return "border-blue-500 bg-blue-50";
  if (minutes >= 15) return "border-red-500 bg-red-50";
  if (minutes >= 10) return "border-orange-500 bg-orange-50";
  if (minutes >= 5) return "border-yellow-500 bg-yellow-50";
  return "border-green-500 bg-green-50";
};
