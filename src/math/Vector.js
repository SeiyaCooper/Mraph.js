import Matrix from "./Matrix.js";

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
        return this.toMatrix().mult(num).toVector();
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
}
