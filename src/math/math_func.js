import MraphError from "../utils/MraphError.js";
import Complex from "./Complex.js";

/**
 * sigmoid function
 * @param {number} x
 * @returns {number}
 */
export function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

/**
 * linear function
 * @param {number} x
 * @returns {number}
 */
export const linear = (x) => x;

/**
 * Returns e (the base of natural logarithms) raised to a power.
 * @param {number | Complex} x
 */
export const exp = (x) => {
    if (typeof x === "number") {
        return Math.exp(x);
    } else if (Complex.isInstance(x)) {
        const im = x.im;
        const re = x.re;

        return new Complex(Math.cos(im), Math.sin(im)).mult(Math.exp(re));
    } else {
        MraphError.error("Invalid value for the exp function");
        return;
    }
};

/**
 * get mean value from a set numbers
 * @param  {...number} nums
 * @returns {number}
 */
export function mean(...nums) {
    let sum = 0;
    for (let num of nums) {
        sum += num;
    }
    return sum / nums.length;
}

/**
 * Lerp function
 * @param {number} from
 * @param {number} to
 * @param {number} p percent
 * @returns {number}
 */
export function lerp(from, to, p) {
    return p * to + (1 - p) * from;
}

/**
 * Lerps between two arrays
 * @param {number[]} from
 * @param {number[]} to
 * @param {number} p percent
 * @returns {number[]}
 */
export function lerpArray(from, to, p) {
    const ans = [];
    for (let i = 0; i < from.length; i++) {
        ans[i] = p * to[i] + (1 - p) * from[i];
    }
    return ans;
}
