import Vector from "./Vector.js";
import { deepCopy } from "../utils/utils.js";

export default class Matrix {
    /**
     * @param {number[][]} [source = [[1]]]
     * @return {Matrix}
     */
    constructor(source = [[1]]) {
        this.columns = source;
    }

    /**
     *
     * @param {Matrix} mat
     * @returns {Matrix}
     */
    mult(mat) {
        if (!Matrix.isMatrix(mat)) return this.multNum(mat);
        if (mat.row != this.column) return this;

        const mat1 = this.columns;
        const mat2 = mat.columns;
        const ans = Matrix.zeros(mat.column, this.row);

        for (let i = 0; i < mat1[0].length; i++) {
            for (let j = 0; j < mat2.length; j++) {
                for (let k = 0; k < mat1[0].length; k++) {
                    ans.columns[j][i] += mat1[k][i] * mat2[j][k];
                }
            }
        }

        return ans;
    }

    /**
     *
     * @param {number} num
     * @returns {Matrix}
     */
    multNum(num) {
        if (typeof num != "number") return this;

        const ans = Matrix.identity(this.column, this.row);

        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                ans.columns[i][j] = this.columns[i][j] * num;
            }
        }

        return ans;
    }

    /**
     *
     * @param {Matrix} mat
     * @returns {Matrix}
     */
    add(mat) {
        if (mat.column < this.column || mat.row < this.row) return this;

        const mat1 = this.columns;
        const mat2 = mat.columns;
        const ans = Matrix.zeros(this.column, this.row);

        for (let i = 0; i < mat1[0].length; i++) {
            for (let j = 0; j < mat1.length; j++) {
                ans.columns[j][i] = mat1[j][i] + mat2[j][i];
            }
        }

        return ans;
    }

    /**
     *
     * @param {Matrix} mat
     * @returns {Matrix}
     */
    reduce(mat) {
        if (mat.column < this.column || mat.row < this.row) return this;

        const mat1 = this.columns;
        const mat2 = mat.columns;
        const ans = Matrix.zeros(this.column, this.row);

        for (let i = 0; i < mat1[0].length; i++) {
            for (let j = 0; j < mat1.length; j++) {
                ans.columns[j][i] = mat1[j][i] - mat2[j][i];
            }
        }

        return ans;
    }

    /**
     * return a deep copy clone of this matrix
     * @returns {Matrix}
     */
    clone() {
        return deepCopy(this);
    }

    /**
     * @returns {Vector}
     */
    toVector() {
        return new Vector(this.columns[0]);
    }

    /**
     * @param {*} obj
     * @returns {boolean}
     */
    static isMatrix(obj) {
        return Array.isArray(obj.columns) && Array.isArray(obj.columns[0]);
    }

    /**
     * create zeros from shape
     * @param {number} column
     * @param {number} row
     * @returns {Matrix}
     */
    static zeros(column, row) {
        return new Matrix(
            Array(column)
                .fill(0)
                .map((i) => Array(row).fill(0))
        );
    }

    /**
     * @param {number} n
     * the number of columns and rows
     * @returns {Matrix}
     */
    static identity(n) {
        const out = Matrix.zeros(n, n);
        for (let i = 0; i < n; i++) {
            out.columns[i][i] = 1;
        }
        return out;
    }

    /**
     * @returns {number} the number of columns
     */
    get column() {
        return this.columns.length;
    }

    /**
     * @returns {number} the number of rows
     */
    get row() {
        return this.columns[0].length;
    }
}
