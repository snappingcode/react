/**
 * Sets a value deep inside a nested object using a dot-notated path.
 * Creates intermediate objects if they don't exist.
 *
 * @param obj - The original object to update.
 * @param path - Dot-notated string path (e.g., "config.formTitle").
 * @param value - The value to set.
 * @returns A new object with the updated value.
 */
export const setNestedValue = (obj: any, path: string, value: any): any => {
  const keys = path.split(".");
  const lastKey = keys.pop();

  const newObj = { ...obj };
  let current = newObj;

  for (const key of keys) {
    if (typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    } else {
      current[key] = { ...current[key] };
    }
    current = current[key];
  }

  if (lastKey) {
    current[lastKey] = value;
  }

  return newObj;
};

/**
 * Retrieves a value from a nested object using a dot-notated path.
 *
 * @param obj - The object to read from.
 * @param path - Dot-notated string path (e.g., "config.formTitle").
 * @returns The value at the path, or undefined if not found.
 */
export const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

/**
 * Applies multiple dot-notated key/value pairs into a nested object.
 * Uses `setNestedValue` internally.
 *
 * @param base - The base object to start with.
 * @param flatData - An object where keys may be dot-notated paths.
 * @returns A new object with all nested values applied.
 */
export const applyNestedValues = (
  base: Record<string, any>,
  flatData: Record<string, any>
): Record<string, any> => {
  let result = { ...base };
  for (const key in flatData) {
    result = setNestedValue(result, key, flatData[key]);
  }
  return result;
};
