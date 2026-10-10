const STORAGE_KEY = "ppodeuk:demo-date";

const parseDemoDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getDemoDate = () => {
  if (typeof window === "undefined") return new Date();

  const queryDate = new URLSearchParams(window.location.search).get("demoDate");
  if (queryDate && parseDemoDate(queryDate)) {
    window.localStorage.setItem(STORAGE_KEY, queryDate);
  }

  return (
    parseDemoDate(queryDate) ||
    parseDemoDate(window.localStorage.getItem(STORAGE_KEY)) ||
    new Date()
  );
};