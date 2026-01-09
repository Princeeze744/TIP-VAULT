// Format date safely (avoids hydration mismatch)
export function formatDate(date?: string | Date): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  // Use a fixed locale to avoid server/client mismatch
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date?: string | Date): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getToday(): string {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}