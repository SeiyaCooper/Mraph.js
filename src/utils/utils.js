/**
 * @param {Object} obj
 * @param {...Object} source
 * @returns {Object}
 */
export function mergeObject(obj, ...source) {
    Object.assign(obj, ...source);
}
