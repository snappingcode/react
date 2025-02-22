// utils/formatDate.ts

/**
 * Returns a date formatted as "DD/MM/YYYY".
 * @param date - Date in date, string or number format.
 * @returns Date in format "DD/MM/YYYY".
 */
const formatToShortDate = (date: Date | string | number): string => {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date");
    }
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export default formatToShortDate;
