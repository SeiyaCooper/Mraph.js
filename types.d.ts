declare module "utils/utils" {
    /**
     * @param {Object} obj
     * @param {...Object} source
     * @returns {Object}
     */
    export function mergeObject(obj: any, ...source: any[]): any;
    /**
     * @param {Object} obj
     * @returns {Object}
     */
    export function deepCopy(obj: any): any;
}
declare module "math/Matrix" {
    export default class Matrix extends Array<any> {
        /**
         * @param {*} obj
         * @returns {boolean}
         */
        static isMatrix(obj: any): boolean;
        /**
         * create zeros from shape
         * @param {number} column
         * @param {number} row
         * @returns {Matrix}
         */
        static zeros(column: number, row: number): Matrix;
        /**
         * @param {number} n
         * the number of columns and rows
         * @returns {Matrix}
         */
        static identity(n: number): Matrix;
        /**
         * @param  {...any} args
         * @returns
         *
         * @example
         * Matrix.from(columns);
         * // returns new Matrix(columns)
         *
         * @example
         * Matrix.from(2,1,3);
         * // returns new Matrix([
         *     [3],
         *     [3]
         * ])
         */
        static from(...args: any[]): any[] | Matrix;
        /**
         * return a 4*4 rotation matrix
         * @param {number} ang
         * the rotate angle
         * @returns {Matrix}
         */
        static rotateX(ang: number): Matrix;
        /**
         * return a 4*4 rotation matrix
         * @param {number} ang
         * the rotate angle
         * @returns {Matrix}
         */
        static rotateY(ang: number): Matrix;
        /**
         * return a 4*4 rotation matrix
         * @param {number} ang the rotate angle
         * @returns {Matrix}
         */
        static rotateZ(ang: number): Matrix;
        /**
         * return a 4*4 translation Matrix
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @returns {Matrix}
         */
        static translate(x: number, y: number, z: number): Matrix;
        /**
         * return a 4*4 perspective matrix
         * @param {number} fudgeFactor
         * @returns
         */
        static perspective(fudgeFactor: number): Matrix;
        /**
         * @param {number[][]} [source = [[1]]]
         * @return {Matrix}
         */
        constructor(source?: number[][]);
        /**
         *
         * @param {Matrix} mat
         * @returns {Matrix}
         */
        mult(mat: Matrix): Matrix;
        /**
         * @param {Matrix} mat
         * @returns {Matrix}
         */
        trans(mat: Matrix): Matrix;
        /**
         *
         * @param {number} num
         * @returns {Matrix}
         */
        multNum(num: number): Matrix;
        /**
         *
         * @param {Matrix} mat
         * @returns {Matrix}
         */
        add(mat: Matrix): Matrix;
        /**
         *
         * @param {Matrix} mat
         * @returns {Matrix}
         */
        reduce(mat: Matrix): Matrix;
        /**
         * return a deep copy clone of this matrix
         * @returns {Matrix}
         */
        clone(): Matrix;
        /**
         * @returns {number} the number of columns
         */
        get column(): number;
        /**
         * @returns {number} the number of rows
         */
        get row(): number;
    }
}
declare module "core/Camera" {
    export default class Camera {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        get matrix(): Matrix;
    }
    import Matrix from "math/Matrix";
}
declare module "renderer/WebglRenderer" {
    export default class WebglRenderer {
        constructor(canvas: any);
        canvas: any;
        gl: any;
        vertexShader: any;
        fragmentShader: any;
        program: any;
        render(mesh: any, camera: any): void;
    }
}
declare module "mraph" {
    import WebglRenderer from "renderer/WebglRenderer";
    import Matrix from "math/Matrix";
    import Camera from "core/Camera";
    export { WebglRenderer, Matrix, Camera };
}
