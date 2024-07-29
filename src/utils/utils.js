import Vector from "../math/Vector.js";
import Matrix from "../math/Matrix.js";
import Color from "../math/Color.js";

/**
 * @param {Object} obj
 * @param {...Object} source
 * @returns {Object}
 */
export function mergeObject(obj, ...source) {
    Object.assign(obj, ...source);
}

/**
 * @param {Object} obj
 * @returns {Object}
 */
export function deepCopy(obj) {
    let out;

    if (Color.isInstance(obj)) {
        out = new Color();
    } else if (Vector.isInstance(obj)) {
        out = new Vector();
    } else if (Matrix.isInstance(obj)) {
        out = new Matrix();
    } else if (Array.isArray(obj)) {
        out = [];
    } else {
        out = Object.create(Object.getPrototypeOf(obj));
    }

    for (let attr in obj) {
        out[attr] = typeof obj[attr] === "object" ? deepCopy(obj[attr]) : obj[attr];
    }
    return out;
}
