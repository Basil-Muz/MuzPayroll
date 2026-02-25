// selected date to an ISO string (toISOString()), which applies UTC timezone conversion.

export const formatDate = (date) => {
  console.log("dates fron util",date)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // yyyy-MM-dd
};

export const toLocalDate = (date) =>
  date instanceof Date
    ? date.toLocaleDateString("en-CA") // yyyy-MM-dd
    : date;

export const formatLocalDate = (date) => date.toLocaleDateString("en-CA");

// Add this utility function
// utils/dateHelpers.js
export const toDateObject = (dateValue) => {
  if (!dateValue) return null;

  // If it's already a Date object
  if (dateValue instanceof Date) {
    return dateValue;
  }

  // If it's a string in YYYY-MM-DD format
  if (typeof dateValue === "string" && dateValue.includes("-")) {
    const [year, month, day] = dateValue.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  // If it's a timestamp
  if (typeof dateValue === "number") {
    return new Date(dateValue);
  }

  // Try parsing as date string
  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? null : parsed;
};
export const toLocalIsoDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const toDateString = (dateValue) => {
  if (!dateValue) return null;

  const dateObj = toDateObject(dateValue);
  if (!dateObj) return null;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
