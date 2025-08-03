/**
 * Linear function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const linear = (t) => t;

/**
 * Quadratic ease in function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeInQuad = (t) => t * t;

/**
 * Quadratic ease out function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

/**
 * Quadratic ease in out function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Cubic ease in function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeInCubic = (t) => t * t * t;

/**
 * Cubic ease out function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Cubic ease in out function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Sine ease in function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeInSine = (t) => 1 - Math.cos((t * Math.PI) / 2);

/**
 * Sine ease out function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeOutSine = (t) => Math.sin((t * Math.PI) / 2);

/**
 * Sine ease in out function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Bounce ease in function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeInBounce = (t) => 1 - easeOutBounce(1 - t);

/**
 * Bounce ease out function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeOutBounce = (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
        return n1 * t * t;
    } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
};

/**
 * Bounce ease in out function
 * @param {number} t - process, 0 to 1
 * @returns {number}
 */
export const easeInOutBounce = (t) =>
    t < 0.5 ? (1 - easeOutBounce(1 - 2 * t)) / 2 : (1 + easeOutBounce(2 * t - 1)) / 2;
