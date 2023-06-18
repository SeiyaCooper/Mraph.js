declare module "math/Matrix" {
    export default class Matrix {
        /**
         * @param {Number[]} mat1
         * @param {Number[]} mat2
         * @returns {Number[]}
         */
        static add(mat1: number[], mat2: number[]): number[];
        /**
         * @param {Number[]} mat1
         * @param {Number[]} mat2
         * @returns {Number[]}
         */
        static reduce(mat1: number[], mat2: number[]): number[];
        /**
         * @param {Number[]} mat1
         * @param {Number[]} mat2
         * @returns {Number[]}
         */
        static mult(mat1: number[], mat2: number[]): number[];
        /**
         *
         * @param {Number} row
         * @param {Number} column
         * @returns {Matrix}
         */
        static createZeros(row: number, column: number): Matrix;
        /**
         *
         * @param {Number[]} obj
         * @returns {String}
         */
        static Arr2Str(obj: number[]): string;
        /**
         *
         * @param {Matrix | Number[]} obj
         * @returns {Number[]}
         */
        static Mat2Arr(obj: Matrix | number[]): number[];
        /**
         *
         * @param {any} obj
         * @returns {Boolean}
         */
        static isMatrix(obj: any): boolean;
        /**
         * @constructor
         * @param {Number[]} [source = [0, 0, 0]]
         * @returns {Matrix}
         */
        constructor(source?: number[]);
        data: number[];
        /**
         * @param {Matrix|Number[]} mat
         */
        mult(mat: Matrix | number[]): Matrix;
        /**
         * @param {Matrix|Number[]} mat
         */
        add(mat: Matrix | number[]): Matrix;
        /**
         * @param {Matrix|Number[]} mat
         */
        reduce(mat: Matrix | number[]): Matrix;
        /**
         * @returns {String}
         */
        toString(): string;
    }
}
declare module "utils/utils" {
    export function mergeObject(obj: any, ...source: any[]): void;
}
declare module "animation/Action" {
    export default class Action {
        /**
         * @constructor
         * @param {Object} handle - the object to construct by
         *                          which may include function start(), update(), stop()
         * @return {Action}
         */
        constructor(handle: any);
        /**
         * @type {Function}
         */
        start: Function;
        /**
         * @type {Function}
         */
        update: Function;
        /**
         * @type {Function}
         */
        stop: Function;
        /**
         * @type {Boolean}
         */
        isStarted: boolean;
        /**
         * @type {Boolean}
         */
        isStopped: boolean;
        /**
         * excute this action by current time
         * @param {Number} start - the start time
         * @param {Number} stop - the stop time
         * @param {Number} now - the current time
         * @return {null}
         */
        excute(start: number, stop: number, now: number): null;
        /**
         * merge this action with another
         * they should have same start time and stop time
         * @param {Action} - another action
         * @return {Action}
         */
        merge(action: any): Action;
    }
}
declare module "animation/ActionList" {
    export default class ActionList {
        list: any;
        maxTime: number;
        minTime: number;
        /**
         * add an action to action list
         * @param {Number} start
         * @param {Number} stop
         * @param {Object} handle
         * @return {ActionList}
         */
        add(start: number, stop: number, handle: any): ActionList;
        play(): void;
    }
}
declare module "mraph" {
    import Matrix from "math/Matrix";
    import ActionList from "animation/ActionList";
    export { Matrix, ActionList };
}
