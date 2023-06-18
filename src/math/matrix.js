export default class Matrix {
    /**
     * @constructor
     * @param {Number[]} [source = [0, 0, 0]]
     * @returns {Matrix}
     */
    constructor(source = [0, 0, 0]) {
        this.data = source;
    }

    /**
     * @param {Matrix|Number[]} mat
     */
    mult(mat) {
        this.data = Matrix.mult(this.data, Matrix.Mat2Arr(mat));
        return this;
    }

    /**
     * @param {Matrix|Number[]} mat
     */
    add(mat) {
        this.data = Matrix.add(this.data, Matrix.Mat2Arr(mat));
        return this;
    }

    /**
     * @param {Matrix|Number[]} mat
     */
    reduce(mat) {
        this.data = Matrix.reduce(this.data, Matrix.Mat2Arr(mat));
        return this;
    }

    /**
     * @returns {String}
     */
    toString() {
        return Matrix.Arr2Str(this.data);
    }

    /**
     * @param {Number[]} mat1
     * @param {Number[]} mat2
     * @returns {Number[]}
     */
    static add(mat1, mat2) {
        //for support one dimension array
        if (!mat1[0][0]) mat1 = [mat1];
        if (!mat2[0][0]) mat2 = [mat2];
        let ans = Matrix.createZeros(mat1[0].length, mat1.length).data;

        for (let i = 0; i < mat1[0].length; i++) {
            for (let j = 0; j < mat1.length; j++) {
                ans[j][i] = mat1[j][i] + mat2[j][i];
            }
        }

        //for support one dimension array
        if (ans.length == 1) ans = ans[0];
        return ans;
    }

    /**
     * @param {Number[]} mat1
     * @param {Number[]} mat2
     * @returns {Number[]}
     */
    static reduce(mat1, mat2) {
        //for support one dimension array
        if (!mat1[0][0]) mat1 = [mat1];
        if (!mat2[0][0]) mat2 = [mat2];
        let ans = Matrix.createZeros(mat1[0].length, mat1.length).data;

        for (let i = 0; i < mat1[0].length; i++) {
            for (let j = 0; j < mat1.length; j++) {
                ans[j][i] = mat1[j][i] - mat2[j][i];
            }
        }

        //for support one dimension array
        if (ans.length == 1) ans = ans[0];
        return ans;
    }

    /**
     * @param {Number[]} mat1
     * @param {Number[]} mat2
     * @returns {Number[]}
     */
    static mult(mat1, mat2) {
        //for support one dimension array
        if (!mat1[0][0]) mat1 = [mat1];
        if (!mat2[0][0]) mat2 = [mat2];

        let ans = Matrix.createZeros(mat1[0].length, mat2.length).data;

        for (let i = 0; i < mat1[0].length; i++) {
            for (let j = 0; j < mat2.length; j++) {
                for (let k = 0; k < mat1[0].length; k++) {
                    ans[j][i] += mat1[k][i] * mat2[j][k];
                }
            }
        }

        //for support one dimension array
        if (ans.length == 1) ans = ans[0];
        return ans;
    }

    /**
     *
     * @param {Number} row
     * @param {Number} column
     * @returns {Matrix}
     */
    static createZeros(row, column) {
        return new Matrix(
            Array(column)
                .fill(0)
                .map(() => {
                    return Array(row).fill(0);
                })
        );
    }

    /**
     *
     * @param {Number[]} obj
     * @returns {String}
     */
    static Arr2Str(obj) {
        if (Array.isArray(obj)) {
            let str = "[ ";
            obj.forEach((val, index) => {
                str += Matrix.Arr2Str(val);
                if (index != obj.length - 1) {
                    str += ", ";
                }
            });
            str += " ]";

            return str;
        } else {
            return obj.toString();
        }
    }

    /**
     *
     * @param {Matrix | Number[]} obj
     * @returns {Number[]}
     */
    static Mat2Arr(obj) {
        if (Matrix.isMatrix(obj)) {
            return obj.data;
        } else {
            return obj;
        }
    }

    /**
     *
     * @param {any} obj
     * @returns {Boolean}
     */
    static isMatrix(obj) {
        return obj instanceof Matrix && Array.isArray(obj.data);
    }
}
