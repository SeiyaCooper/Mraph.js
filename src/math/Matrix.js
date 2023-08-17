import { deepCopy } from "../utils/utils.js";

export default class Matrix extends Array {
    /**
     * @param {...number[]} source
     * @return {Matrix}
     */
    constructor(...source) {
        super(...source);
    }

    /**
     *
     * @param {Matrix} mat
     * @returns {Matrix}
     */
    mult(mat) {
        if (!Matrix.isMatrix(mat)) return this.multNum(mat);

        const ans = Matrix.zeros(this.row, mat.column);

        for (let i = 0; i < this[0].length; i++) {
            for (let j = 0; j < mat.length; j++) {
                for (let k = 0; k < this[0].length; k++) {
                    ans[j][i] += this[k][i] * mat[j][k];
                }
            }
        }

        return ans;
    }

    /**
     * @param {Matrix} mat
     * @returns {Matrix}
     */
    trans(mat) {
        return mat.mult(this);
    }

    /**
     *
     * @param {number} num
     * @returns {Matrix}
     */
    multNum(num) {
        const ans = Matrix.zeros(this.row, this.column);

        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                ans[i][j] = this[i][j] * num;
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
        const ans = Matrix.zeros(this.row, this.column);

        for (let i = 0; i < this[0].length; i++) {
            for (let j = 0; j < this.length; j++) {
                ans[j][i] = this[j][i] + mat[j][i];
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
        const ans = Matrix.zeros(this.row, this.column);

        for (let i = 0; i < this[0].length; i++) {
            for (let j = 0; j < this.length; j++) {
                ans[j][i] = this[j][i] - mat[j][i];
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
     * copy value from another matrix
     * @param {Matrix} mat
     */
    copy(mat) {
        mat.forEach((vec, i) => {
            vec.forEach((num, j) => {
                this[i][j] = num;
            });
        });
    }

    /**
     * @param {*} obj
     * @returns {boolean}
     */
    static isMatrix(obj) {
        return Array.isArray(obj[0]);
    }

    /**
     * create zeros from shape
     * @param {number} column
     * @param {number} row
     * @returns {Matrix}
     */
    static zeros(row, column) {
        return Matrix.from(row, column, 0);
    }

    /**
     * @param {number} n
     * the number of columns and rows
     * @returns {Matrix}
     */
    static identity(n) {
        const ans = Matrix.from(n, n, 0);

        for (let i = 0; i < n; i++) {
            ans[i][i] = 1;
        }

        return ans;
    }

    /**
     * @param {number} row
     * @param {number} column
     * @param {number} n
     * @returns {Matrix}
     *
     * @example
     * Matrix.from(2,1,3);
     * // returns new Matrix(
     * //     [3],
     * //     [3]
     * // )
     */
    static from(row, column, n) {
        return new Matrix(
            ...Array(column)
                .fill(0)
                .map(() => Array(row).fill(n))
        );
    }

    /**
     * return a 4*4 rotation matrix
     * @param {number} ang
     * the rotate angle
     * @returns {Matrix}
     */
    static rotateX(ang) {
        return new Matrix(
            [1, 0, 0, 0],
            [0, Math.cos(ang), -Math.sin(ang), 0],
            [0, Math.sin(ang), Math.cos(ang), 0],
            [0, 0, 0, 1]
        );
    }

    /**
     * return a 4*4 rotation matrix
     * @param {number} ang
     * the rotate angle
     * @returns {Matrix}
     */
    static rotateY(ang) {
        return new Matrix(
            [Math.cos(ang), 0, -Math.sin(ang), 0],
            [0, 1, 0, 0],
            [Math.sin(ang), 0, Math.cos(ang), 0],
            [0, 0, 0, 1]
        );
    }

    /**
     * return a 4*4 rotation matrix
     * @param {number} ang the rotate angle
     * @returns {Matrix}
     */
    static rotateZ(ang) {
        return new Matrix(
            [Math.cos(ang), -Math.sin(ang), 0, 0],
            [Math.sin(ang), Math.cos(ang), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        );
    }

    /**
     * return a 4*4 translation Matrix
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Matrix}
     */
    static translate(x, y, z) {
        return new Matrix(
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [x, y, z, 1]
        );
    }

    /**
     * @param {number} val
     */
    set norm(val) {
        this.copy(this.mult(val / this.norm));
    }

    /**
     * @returns {number} F-norm of this matrix
     */
    get norm() {
        let ans = 0;
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this[0].length; j++) {
                ans += this[i][j] ** 2;
            }
        }
        return Math.sqrt(ans);
    }

    /**
     * @returns {number} the number of columns
     */
    get column() {
        return this.length;
    }

    /**
     * @returns {number} the number of rows
     */
    get row() {
        return this[0].length;
    }
}
