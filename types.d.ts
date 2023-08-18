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
        static zeros(row: number, column: number): Matrix;
        /**
         * @param {number} n
         * the number of columns and rows
         * @returns {Matrix}
         */
        static identity(n: number): Matrix;
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
        static from(row: number, column: number, n: number): Matrix;
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
         * @param {...number[]} source
         * @return {Matrix}
         */
        constructor(...source: number[][]);
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
         * copy value from another matrix
         * @param {Matrix} mat
         */
        copy(mat: Matrix): void;
        /**
         * @param {number} val
         */
        set norm(arg: number);
        /**
         * @returns {number} F-norm of this matrix
         */
        get norm(): number;
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
        fov: number;
        near: number;
        far: number;
        aspect: number;
        get matrix(): Matrix;
    }
    import Matrix from "math/Matrix";
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
        /**
         * list for actions to be called
         * @type {Map}
         */
        list: Map<any, any>;
        /**
         * @type {number}
         */
        maxTime: number;
        /**
         * @type {number}
         */
        minTime: number;
        /**
         * add an action to action list
         * @param {Number} start
         * @param {Number} stop
         * @param {Object} handle
         * @return {ActionList}
         */
        add(start: number, stop: number, handle: any): ActionList;
        /**
         * play this action list
         */
        play(): void;
    }
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
        clear(color?: number[]): void;
    }
}
declare module "core/Layer" {
    export default class Layer {
        constructor({ fillScreen, appendTo, rendererClass, }?: {
            fillScreen?: boolean;
            appendTo?: any;
            rendererClass?: typeof WebglRenderer;
        });
        elements: any[];
        camera: Camera;
        actionList: ActionList;
        canvas: HTMLCanvasElement;
        renderer: WebglRenderer;
        appendTo(el: any): Layer;
        add(...els: any[]): Layer;
        render(): Layer;
        clear(color: any): Layer;
    }
    import Camera from "core/Camera";
    import ActionList from "animation/ActionList";
    import WebglRenderer from "renderer/WebglRenderer";
}
declare module "mobjects/Graph" {
    export default class Graph {
        indices: any[];
        colors: any[];
        mode: string;
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        get matrix(): Matrix;
    }
    import Matrix from "math/Matrix";
}
declare module "mobjects/Segment" {
    export default class _default extends Graph {
        constructor(start: any, end: any);
        strokeWidth: number;
        indices: number[];
        start: any;
        end: any;
        get vertexes(): any[];
    }
    import Graph from "mobjects/Graph";
}
declare module "mraph" {
    import WebglRenderer from "renderer/WebglRenderer";
    import Matrix from "math/Matrix";
    import Camera from "core/Camera";
    import Layer from "core/Layer";
    import Segment from "mobjects/Segment";
    export { WebglRenderer, Matrix, Camera, Layer, Segment };
}
