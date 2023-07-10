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
    const out = Array.isArray(obj) ? [] : {};
    for (let attr in obj) {
        out[attr] =
            typeof obj[attr] === "object" ? deepCopy(obj[attr]) : obj[attr];
    }
    return out;
}
