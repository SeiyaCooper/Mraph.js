import MraphError from "../utils/MraphError.js";
import Complex from "./Complex.js";
import { deepCopy } from "../utils/utils.js";

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
    } else if (Array.isArray(x)) {
        const ans = deepCopy(x);

        ans.forEach((val, index) => {
            ans[index] = exp(val);
        });

        return ans;
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
export function lerpArray(from, to, p, { recurse = true } = {}) {
    const ans = [];
    from.forEach((el, index) => {
        if (Array.isArray(el) && recurse) {
            ans.push(lerpArray(el, to[index], p));
            return;
        }

        ans.push(p * to[index] + (1 - p) * from[index]);
    });
    return ans;
}

/**
 * Inserts points into a path to reach the target number of points 'targetPointsNum'.
 * @param {number[][]} path
 * @param {number} targetPointsNum
 * @return {void}
 */
export function insertPointsAlongPath(path, targetPointsNum) {
    const originNum = path.length;

    if (originNum >= targetPointsNum) return;
    if (originNum === 0) return;

    const diffNum = targetPointsNum - originNum;

    if (originNum === 1) {
        for (let i = 0; i < diffNum; i++) {
            path.push(deepCopy(path[0]));
        }
        return;
    }

    const norms = [];
    for (let j = 0; j < path.length - 1; j++) {
        norms.push(getDistance(path[j], path[j + 1]));
    }

    for (let i = 0; i < diffNum; i++) {
        const maxIndex = norms.indexOf(Math.max(...norms));

        path.splice(maxIndex + 1, 0, lerpArray(path[maxIndex], path[maxIndex + 1], 1 / 2));
        norms.splice(
            maxIndex,
            1,
            getDistance(path[maxIndex], path[maxIndex + 1]),
            getDistance(path[maxIndex + 1], path[maxIndex + 2])
        );
    }
}

/**
 * Gets the distance between two position.
 * @param {number[]} pos0
 * @param {number[]} pos1
 * @returns {number}
 */
export function getDistance(pos0, pos1) {
    let squared = 0;
    for (let i = 0; i < pos0.length; i++) {
        squared += (pos0[i] - pos1[i]) ** 2;
    }
    return Math.sqrt(squared);
}
