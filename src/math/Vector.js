import { deepCopy } from "../utils/utils.js";
import * as MathFunc from "./math_func.js";
import Matrix from "./Matrix.js";

export default class Vector extends Array {
    /**
     * @param  {...number} nums
     */
    constructor(...nums) {
        super(...nums);
    }

    /**
     * mult a scalar
     * @param {number} num
     * @returns {Vector}
     */
    mult(num) {
        const ans = Matrix.from(this.row, 1, 1).toVector();
        for (let i = 0; i < this.row; i++) {
            ans[i] = num * this[i];
        }
        return ans;
    }

    /**
     * returns mat.mult(this)
     * @param {Matrix} mat
     * @returns {Vector}
     */
    trans(mat) {
        return mat.mult(this);
    }

    /**
     * @param {Vector} vec
     * @returns {number}
     */
    dot(vec) {
        let ans = 0;
        this.forEach((num, i) => {
            ans += num * vec[i];
        });
        return ans;
    }

    /**
     * returns cross product of this vector and vec
     * @param {Vector} vec
     * @returns
     */
    cross(vec) {
        if (vec.row === 2) {
            return this[0] * vec[1] - this[1] * vec[0];
        } else {
            const ans = Vector.fromRow(3);
            const m = this;
            const n = vec;

            ans[0] = m[1] * n[2] - m[2] * n[1];
            ans[1] = m[2] * n[0] - m[0] * n[2];
            ans[2] = m[0] * n[1] - m[1] * n[0];

            return ans;
        }
    }

    /**
     * returns hadamard product of this vector and vec
     * @param {Vector} vec
     * @returns {Vector}
     */
    elMult(vec) {
        const ans = Matrix.zeros(this.row, 1).toVector();

        for (let j = 0; j < this.row; j++) {
            ans[j] = this[j] * vec[j];
        }

        return ans;
    }

    /**
     * divide by a number
     * @param {number} num
     */
    divide(num) {
        const ans = Matrix.from(this.row, 1, 1).toVector();
        for (let i = 0; i < this.row; i++) {
            ans[i] = num / this[i];
        }
        return ans;
    }

    /**
     * @param {Vector} vec
     * @returns {Vector}
     */
    add(vec) {
        const ans = Vector.fromRow(this.row, 0);

        for (let j = 0; j < this.length; j++) {
            ans[j] = this[j] + vec[j];
        }

        return ans;
    }

    /**
     * @param {Vector} vec
     * @returns {Vector}
     */
    reduce(vec) {
        const ans = Vector.fromRow(this.row, 0);

        for (let j = 0; j < this.length; j++) {
            ans[j] = this[j] - vec[j];
        }

        return ans;
    }

    /**
     * normalize this vector
     * @returns {Vector}
     */
    normal() {
        const ans = this.clone();
        ans.norm = 1;
        return ans;
    }

    /**
     * returns linear interpolation results
     * @param {Vector} to
     * @param {number} p percent
     * @returns {Vector}
     */
    lerp(to, p) {
        return Vector.lerp(this, to, p);
    }

    /**
     * return a deep copy clone of this vector
     * @returns {Vector}
     */
    clone() {
        return deepCopy(this);
    }

    /**
     * copy values from another vector
     */
    copy(vec) {
        vec.forEach((num, i) => {
            this[i] = num;
        });
        return this;
    }

    /**
     * @returns {Matrix}
     */
    toMatrix() {
        return new Matrix(Array.from(this));
    }

    /**
     * Lerp between two vectors
     * @param {Vector} from
     * @param {Vector} to
     * @param {number} p percent
     * @returns {Vector}
     */
    static lerp(from, to, p) {
        return Vector.fromArray(MathFunc.lerpArray(from, to, p));
    }

    /**
     * @param {*} obj
     * @returns {boolean}
     */
    static isVector(obj) {
        return obj instanceof Vector;
    }

    /**
     * @param {number} row
     * @param {number} n
     * @returns {Vector}
     */
    static fromRow(row, n = 0) {
        return new Vector(...Array(row).fill(n));
    }

    /**
     * Creates a Vector from an array-like object
     * @param {Array | Vector} arr
     * @returns {Vector}
     */
    static fromArray(arr) {
        if (Vector.isVector()) {
            return arr.clone();
        } else {
            return new Vector(...arr);
        }
    }

    /**
     * @param {number} val
     */
    set norm(val) {
        this.copy(this.mult(val / this.norm));
    }

    /**
     * @type {number}
     */
    get norm() {
        return Math.sqrt(this.dot(this));
    }

    /**
     * @type {number}
     */
    get row() {
        return this.length;
    }
}
