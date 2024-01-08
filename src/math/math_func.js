/**
 * sigmoid function
 * @param {number} x
 * @returns {number}
 */
export function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

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
    return from + p * (to - from);
}

/**
 * Lerp between two arrays
 * @param {number[]} from
 * @param {number[]} to
 * @param {number} p percent
 * @returns {number[]}
 */
export function lerpArray(from, to, p) {
    const ans = [];
    for (let i = 0; i < from.length; i++) {
        ans[i] = lerp(from[i], to[i], p);
    }
    return ans;
}
