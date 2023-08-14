import Matrix from "./Matrix.js";
import { deepCopy } from "../utils/utils.js";

export default class Vector {
    /**
     * @param {number[]} [source = [1]]
     * @returns {Vector}
     */
    constructor(source = [1]) {
        this.columns = source;
    }

    /**
     * @param {Matrix} mat
     * @returns {Vector}
     */
    trans(mat) {
        if (!Matrix.isMatrix) return this;
        return mat.mult(this.toMatrix()).toVector();
    }

    /**
     * @param {Vector} vec
     * @returns {Vector}
     */
    add(vec) {
        return this.toMatrix().add(vec.toMatrix()).toVector();
    }

    /**
     * @param {Vector} vec
     * @returns {Vector}
     */
    reduce(vec) {
        return this.toMatrix().reduce(vec.toMatrix()).toVector();
    }

    /**
     * @param {number} num
     * @returns {Vector}
     */
    mult(num) {
        const ans = Matrix.from(1, this.row, 1).toVector();
        for (let i = 0; i < this.row; i++) {
            ans.columns[i] = num * this.columns[i];
        }
        return ans;
    }

    /**
     * return the dot product
     * @param {Vector} vec
     * @returns
     */
    dot(vec) {
        if (!Vector.isVector(vec)) return this;

        let ans = 0;
        for (const num of this.columns) {
            ans += num ** 2;
        }
        return ans;
    }

    /**
     * normalize this vector
     * @returns {Vector}
     */
    normal() {
        const ans = this.clone();
        ans.length = 1;
        return ans;
    }

    /**
     * @param {number} row
     * @param {number} [n = 0]
     * the number to be filled with
     * @returns {Vector}
     */
    resize(row, n = 0) {
        const out = [...this.columns];
        const start = out.length;
        out.length = row;
        out.fill(n, start, row);
        return new Vector(out);
    }

    /**
     * return a deep copy clone of this vector
     * @returns {Vector}
     */
    clone() {
        return deepCopy(this);
    }

    /**
     * @returns {Matrix}
     */
    toMatrix() {
        return new Matrix([this.columns]);
    }

    /**
     * @param {*} obj
     * @returns {boolean}
     */
    static isVector(obj) {
        return Array.isArray(obj.columns) && !!obj.toMatrix;
    }

    set length(num) {
        this.columns = this.mult(num / this.length).columns;
    }

    /**
     * @type {number}
     */
    get length() {
        return Math.sqrt(this.dot(this));
    }

    /**
     * @type {number}
     */
    get row() {
        return this.columns.length;
    }
}
