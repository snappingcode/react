// utils/formatDate.ts

/**
 * Formtas a date into a readable format.
 * @param date - Date in date, string or number format.
 * @param locale - Locale settings (e.g., "en-US", "es-ES").
 * @param options - Options for Intl.DateTimeFormat.
 * @returns Date formatted as string.
 */
const formatDate = (
  date: Date | string | number,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {}
): string => {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date");
    }
    return new Intl.DateTimeFormat(locale, options).format(parsedDate);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export default formatDate;
