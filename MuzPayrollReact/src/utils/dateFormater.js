// selected date to an ISO string (toISOString()), which applies UTC timezone conversion.

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // yyyy-MM-dd
};

export const toLocalDate = (date) =>
  date instanceof Date
    ? date.toLocaleDateString("en-CA") // yyyy-MM-dd
    : date;
