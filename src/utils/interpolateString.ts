import { Parser } from "expr-eval";

/**
 * Interpolates a template string with values from a given object.
 *
 * @param {Object} data - The source object containing the values to interpolate.
 * @param {string} template - The template string with placeholders for interpolation.
 * @returns {string} The interpolated string.
 */
const interpolateString = (data: any, template: string) => {
  // console.log("🔍 Original data:", data);
  // console.log("🔍 Template before interpolation:", template);

  let interpolatedString = template;
  const parser = new Parser();
  const matches = template?.match(/{{\s*[\w\.]+\s*}}/g) || [];
  // console.log("matches", matches);
  // console.log("template", template);
  matches.forEach((match) => {
    const path = match.slice(2, -2).trim();
    //console.log(`🔹 Evaluating path: "${path}"`);

    try {
      let value: any = parser.evaluate(path, data);
      //console.log(`✅ Evaluated value (${path}):`, value);

      // 🔥 Si el valor es un objeto o array, lo convertimos a JSON válido
      if (typeof value === "object" && value !== null) {
        //console.log(`⚠️ Value is an object, converting to JSON:`, value);
        value = JSON.stringify(value, null, 2); // Pretty print JSON for better readability
      }

      interpolatedString = interpolatedString.replace(
        new RegExp(match, "g"),
        value
      );
      //console.log(`✅ Updated interpolatedString:`, interpolatedString);
    } catch (error) {
      //console.error(`❌ Error parsing ${path}:`, error);
      interpolatedString = interpolatedString.replace(
        new RegExp(match, "g"),
        ""
      );
    }
  });

  //console.log("🔍 Final interpolated string:", interpolatedString);
  return interpolatedString;
};

export default interpolateString;
