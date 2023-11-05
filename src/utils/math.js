/**
 * sigmoid function
 * @param {number} x
 * @returns
 */
export function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

/**
 * get mean value from a set numbers
 * @param  {...number} nums
 */
export function mean(...nums) {
    let sum = 0;
    for (let num of nums) {
        sum += num;
    }
    return sum / nums.length;
}
