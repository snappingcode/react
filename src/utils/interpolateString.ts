import { Parser } from 'expr-eval';

/**
 * Interpolates a template string with values from a given object.
 *
 * @param {Object} data - The source object containing the values to interpolate.
 * @param {string} template - The template string with placeholders for interpolation.
 * @returns {string} The interpolated string.
 */
const interpolateString = (data: any, template: string) => {
    let interpolatedString = template;

    const parser = new Parser();
    const matches = template?.match(/{{\s*[\w\.]+\s*}}/g) || [];


    matches.forEach((match) => {
        const path = match.slice(2, -2).trim();
        try {
            const value = parser.evaluate(path, data) || '';
            interpolatedString = interpolatedString.replace(new RegExp(match, 'g'), value.toString());
        } catch (error) {
            console.error(`Error parsing ${path}:`, error);
            interpolatedString = interpolatedString.replace(new RegExp(match, 'g'), '');
        }
    });



    return interpolatedString;
};

export default interpolateString;
