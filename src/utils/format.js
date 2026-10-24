export function formatDate(value) {
  const date = value && typeof value.toDate === "function" ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function titleCaseStatus(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "—";
}
