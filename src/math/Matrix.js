import MraphError from "../utils/MraphError.js";
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
        if (Vector.isInstance(mat)) mat = mat.toMatrix();
        if (!Matrix.isInstance(mat)) return this.multNum(mat);

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
     * Swaps two rows.
     * One of the elementary transformations.
     * @param {number} i the first row.
     * @param {number} j the second row.
     */
    swapRow(i, j) {
        const ans = this.clone();
        for (let k = 0; k < this.column; k++) {
            ans[k][i] = this[k][j];
            ans[k][j] = this[k][i];
        }
        return ans;
    }

    /**
     * Scales a row.
     * One of the elementary transformations.
     * @param {number} i the row to scale with.
     * @param {number} factor scale factor.
     */
    scaleRow(i, factor) {
        const ans = this.clone();
        for (let j = 0; j < this.column; j++) {
            ans[j][i] *= factor;
        }
        return ans;
    }

    /**
     * Scales a row and add it to another row.
     * @param {number} i the target row.
     * @param {number} j
     * @param {number} factor
     */
    addScaledRow(i, j, factor) {
        const ans = this.clone();
        for (let k = 0; k < this.column; k++) {
            ans[k][i] += this[k][j] * factor;
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
     *
     * @param {number[]} start
     * @param {number[]} end
     */
    sub(start = [0, 0], end = []) {
        let [startRow, startCol] = start;
        let [endRow, endCol] = end;

        startCol = startCol < 0 ? startCol + this.column : startCol;
        startCol = startCol < -this.column ? 0 : startCol;

        endCol = endCol ?? this.column;
        endCol = endCol < 0 ? endCol + this.column : endCol;
        endCol = endCol < -this.column ? 0 : endCol;

        const out = new Matrix();
        for (let i = startCol; i < endCol; i++) {
            out.push(this[i].slice(startRow, endRow));
        }

        return out;
    }

    /**
     * print this matrix on the console
     */
    print() {
        console.log(this.toString());
    }

    /**
     * Returns a vector constructed by flattening this matrix
     * @returns {Vector}
     */
    toVector() {
        return new Vector(...this.flat());
    }

    /**
     * Returns a string to print this matrix
     * @returns {string}
     */
    toString() {
        let out = "[";
        for (let i = 0; i < this.length; i++) {
            for (let num of this[i]) {
                out += `${num}, `;
            }
            if (i < this.length - 1) out += "\n";
        }
        out += "]";
        return out;
    }

    /**
     * @param {*} obj
     * @returns {boolean}
     */
    static isInstance(obj) {
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
     * returns a rotation matrix
     * @param {number} ang
     * the rotate angle
     * @param {number} [n = 4]
     * Specifies the number of rows and columns of the return matrix
     * Available numbers are 3 or 4
     * @returns {Matrix}
     */
    static rotateX(ang, n = 4) {
        if (n === 3) {
            return new Matrix([1, 0, 0], [0, Math.cos(ang), -Math.sin(ang)], [0, Math.sin(ang), Math.cos(ang)]);
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
     * returns a rotation matrix
     * @param {number} ang
     * the rotate angle
     * @param {number} [n = 4]
     * Specifies the number of rows and columns of the return matrix
     * Available numbers are 3 or 4
     * @returns {Matrix}
     */
    static rotateY(ang, n = 4) {
        if (n === 3) {
            return new Matrix([Math.cos(ang), 0, -Math.sin(ang)], [0, 1, 0], [Math.sin(ang), 0, Math.cos(ang), 0]);
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
     * returns a rotation matrix
     * @param {number} ang
     * the rotate angle
     * @param {number} [n = 4]
     * Specifies the number of rows and columns of the return matrix
     * Available numbers are 3 or 4
     * @returns {Matrix}
     */
    static rotateZ(ang, n = 4) {
        if (n === 3) {
            return new Matrix([Math.cos(ang), -Math.sin(ang), 0], [Math.sin(ang), Math.cos(ang), 0], [0, 0, 1]);
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
        const C = new Matrix([0, -K[2], K[1]], [K[2], 0, -K[0]], [-K[1], K[0], 0]);
        let ans = I.add(C.mult(C).mult(1 - Math.cos(angle))).add(C.mult(Math.sin(angle)));

        if (n === 3) {
            return ans;
        } else {
            ans = ans.resize(4, 4);
            ans[3][3] = 1;
            return ans;
        }
    }

    /**
     * returns a scale matrix
     * @param {number} x scale ratio at x direction
     * @param {number} y scale ratio at y direction
     * @param {number} z scale ratio at z direction
     * @param {number} [n=4] Specifies the number of rows and columns of the return matrix.
     *                       Available numbers are 3 or 4.
     * @returns
     */
    static scale(x, y, z, n = 4) {
        if (n === 3) {
            return new Matrix([x, 0, 0], [0, y, 0], [0, 0, z]);
        } else {
            return new Matrix([x, 0, 0, 0], [0, y, 0, 0], [0, 0, z, 0], [0, 0, 0, 1]);
        }
    }

    /**
     * return a 4*4 translation Matrix
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Matrix}
     */
    static translation(x, y, z) {
        return new Matrix([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [x, y, z, 1]);
    }

    /**
     * Gets row reduced echelon form of the given matrix.
     * @param {Matrix} mat
     */
    static RREF(mat, { columnMax = Infinity } = {}) {
        let ans = mat.clone();
        let rowStart = 0;

        const pivotPos = [];

        // Gets echelon form
        for (let i = 0; i < ans.column; i++) {
            if (i >= columnMax) break;
            if (rowStart > mat.row - 1) break;
            if (isZeros(ans[i], rowStart)) continue;

            pivotPos.push([i, rowStart]);

            const vec = ans[i];
            let maxIdx,
                maxNum = 0;
            for (let j = rowStart; j < vec.length; j++) {
                if (Math.abs(vec[j]) > maxNum) {
                    maxIdx = j;
                    maxNum = Math.abs(vec[j]);
                }
            }

            if (maxIdx !== 0) ans = ans.swapRow(rowStart, maxIdx);

            for (let j = rowStart + 1; j < ans.row; j++) {
                const factor = -ans[i][j] / ans[i][rowStart];
                if (factor !== 0) ans = ans.addScaledRow(j, rowStart, factor);
            }
            rowStart++;
        }

        for (let i = 0; i < pivotPos.length; i++) {
            const pivotCol = pivotPos[i][0];
            const pivotRow = pivotPos[i][1];
            const pivot = ans[pivotCol][pivotRow];

            for (let j = 0; j < pivotRow; j++) {
                const factor = -ans[pivotCol][j] / ans[pivotCol][pivotRow];
                if (factor !== 0) ans = ans.addScaledRow(j, pivotRow, factor);
            }

            if (pivot !== 1) ans = ans.scaleRow(pivotRow, 1 / pivot);
        }

        return ans;

        // Helper functions
        function isZeros(vec, start) {
            let ans = true;
            for (let i = start; i < vec.length; i++) {
                ans = !vec[i];
                if (!ans) break;
            }
            return ans;
        }
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
     * Transpose of this matrix
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
     * The inverse matrix of this matrix
     * @returns {Matrix}
     */
    get I() {
        if (this.row !== this.column) MraphError.error("The matrix provided cannot be inversed.");

        const n = this.row;
        const identity = Matrix.identity(n);
        let expaned = this.clone().concat(identity);

        expaned = Matrix.RREF(expaned, { columnMax: n });

        return expaned.sub([0, n]);
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
