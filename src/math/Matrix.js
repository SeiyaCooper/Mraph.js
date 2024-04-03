import { deepCopy } from "../utils/utils.js";
import Vector from "./Vector.js";

export default class Matrix extends Array {
    /**
     * @param {...number[]} source
     * @return {Matrix}
     */
    constructor(...source) {
        super(...source);
    }

    /**
     * mult a vector, matrix or scalar
     * @param {Matrix} mat
     * @returns {Matrix}
     */
    mult(mat) {
        if (Vector.isVector(mat)) mat = mat.toMatrix();
        if (!Matrix.isMatrix(mat)) return this.multNum(mat);

        let ans = Matrix.zeros(this.row, mat.column);

        for (let i = 0; i < this[0].length; i++) {
            for (let j = 0; j < mat.length; j++) {
                for (let k = 0; k < this[0].length; k++) {
                    ans[j][i] += this[k][i] * mat[j][k];
                }
            }
        }

        if (ans.column === 1) ans = ans.toVector();

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
     * mult a scalar
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
     * returns hadamard product of this matrix and mat
     * @param {Matrix} mat
     * @returns {Matrix}
     */
    elMult(mat) {
        const ans = Matrix.zeros(this.row, this.column);

        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                ans[i][j] = this[i][j] * mat[i][j];
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
     * @param {Matrix} mat
     * @returns {Matrix}
     */
    minus(mat) {
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
        if (mat.length > this.length) {
            const len = this.length;
            this.length = mat.length;
            this.fill(new Array(), len, this.length);
        }
        mat.forEach((vec, i) => {
            vec.forEach((num, j) => {
                this[i][j] = num;
            });
        });
        return this;
    }

    /**
     * resize this matrix with a number to fill
     * @param {number} row
     * @param {number} column
     * @param {number} [n=0]
     */
    resize(row, column, n = 0) {
        const out = Matrix.from(row, column, n);

        for (let i = 0; i < out.length; i++) {
            for (let j = 0; j < out[0].length; j++) {
                if (!this[i]) continue;
                out[i][j] = this[i][j] ?? n;
            }
        }

        return out;
    }

    /**
     * Returns a vector constructed by flattening this matrix
     * @returns {Vector}
     */
    toVector() {
        return new Vector(...this.flat());
    }

    /**
     * @param {*} obj
     * @returns {boolean}
     */
    static isMatrix(obj) {
        return obj instanceof Matrix && Array.isArray(obj[0]);
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
     * return a rotation matrix
     * @param {number} ang
     * the rotate angle
     * @param {number} [n = 4]
     * Specifies the number of rows and columns of the return matrix
     * Available numbers are 3 or 4
     * @returns {Matrix}
     */
    static rotateX(ang, n = 4) {
        if (n === 3) {
            return new Matrix(
                [1, 0, 0],
                [0, Math.cos(ang), -Math.sin(ang)],
                [0, Math.sin(ang), Math.cos(ang)]
            );
        } else {
            return new Matrix(
                [1, 0, 0, 0],
                [0, Math.cos(ang), -Math.sin(ang), 0],
                [0, Math.sin(ang), Math.cos(ang), 0],
                [0, 0, 0, 1]
            );
        }
    }

    /**
     * return a rotation matrix
     * @param {number} ang
     * the rotate angle
     * @param {number} [n = 4]
     * Specifies the number of rows and columns of the return matrix
     * Available numbers are 3 or 4
     * @returns {Matrix}
     */
    static rotateY(ang, n = 4) {
        if (n === 3) {
            return new Matrix(
                [Math.cos(ang), 0, -Math.sin(ang)],
                [0, 1, 0],
                [Math.sin(ang), 0, Math.cos(ang), 0]
            );
        } else {
            return new Matrix(
                [Math.cos(ang), 0, -Math.sin(ang), 0],
                [0, 1, 0, 0],
                [Math.sin(ang), 0, Math.cos(ang), 0],
                [0, 0, 0, 1]
            );
        }
    }

    /**
     * return a rotation matrix
     * @param {number} ang
     * the rotate angle
     * @param {number} [n = 4]
     * Specifies the number of rows and columns of the return matrix
     * Available numbers are 3 or 4
     * @returns {Matrix}
     */
    static rotateZ(ang, n = 4) {
        if (n === 3) {
            return new Matrix(
                [Math.cos(ang), -Math.sin(ang), 0],
                [Math.sin(ang), Math.cos(ang), 0],
                [0, 0, 1]
            );
        } else {
            return new Matrix(
                [Math.cos(ang), -Math.sin(ang), 0, 0],
                [Math.sin(ang), Math.cos(ang), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            );
        }
    }

    /**
     * returns a rotation matrix to rotate on given axis
     * @param {Vector} axis
     * the axis to rotate on
     * @param {number} angle
     * the rotate angle
     * @param {number} n
     */
    static rotateOn(axis, angle, n = 4) {
        // Rodrigues' rotation formula

        const I = Matrix.identity(3);
        const K = axis.normal();
        const C = new Matrix(
            [0, -K[2], K[1]],
            [K[2], 0, -K[0]],
            [-K[1], K[0], 0]
        );
        let ans = I.add(C.mult(C).mult(1 - Math.cos(angle))).add(
            C.mult(Math.sin(angle))
        );

        if (n === 3) {
            return ans;
        } else {
            ans = ans.resize(4, 4);
            ans[3][3] = 1;
            return ans;
        }
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
     * return transpose of this matrix
     * @returns {Matrix}
     */
    get T() {
        const ans = Matrix.zeros(this.column, this.row);

        for (let i = 0; i < this[0].length; i++) {
            for (let j = 0; j < this.length; j++) {
                ans[i][j] = this[j][i];
            }
        }

        return ans;
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
