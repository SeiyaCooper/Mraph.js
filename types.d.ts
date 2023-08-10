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
declare module "math/Vector" {
    export default class Vector {
        /**
         * @param {*} obj
         * @returns {boolean}
         */
        static isVector(obj: any): boolean;
        /**
         * @param {number} row
         * @returns {Vector}
         */
        static identity(row: number): Vector;
        /**
         * @param {number[]} [source = [1]]
         * @returns {Vector}
         */
        constructor(source?: number[]);
        columns: number[];
        /**
         * @param {Matrix} mat
         * @returns {Vector}
         */
        trans(mat: Matrix): Vector;
        /**
         * @param {Vector} vec
         * @returns {Vector}
         */
        add(vec: Vector): Vector;
        /**
         * @param {Vector} vec
         * @returns {Vector}
         */
        reduce(vec: Vector): Vector;
        /**
         * @param {number} num
         * @returns {Vector}
         */
        mult(num: number): Vector;
        /**
         * @param {number} row
         * @param {number} [n = 0]
         * the number to be filled with
         * @returns {Vector}
         */
        resize(row: number, n?: number): Vector;
        /**
         * return a deep copy clone of this vector
         * @returns {Vector}
         */
        clone(): Vector;
        /**
         * @returns {Matrix}
         */
        toMatrix(): Matrix;
        /**
         * @type {number}
         */
        get row(): number;
    }
    import Matrix from "math/Matrix";
}
declare module "math/Matrix" {
    export default class Matrix {
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
         * @param {number[][]} [source = [[1]]]
         * @return {Matrix}
         */
        constructor(source?: number[][]);
        columns: number[][];
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
         * @param {Matrix} matrix
         * @returns {Matrix}
         */
        copy(matrix: Matrix): Matrix;
        /**
         * @returns {Vector}
         */
        toVector(): Vector;
        /**
         * @returns {number} the number of columns
         */
        get column(): number;
        /**
         * @returns {number} the number of rows
         */
        get row(): number;
    }
    import Vector from "math/Vector";
}
declare module "renderer/Renderer" {
    export default class Renderer {
        constructor(canvas: any);
        matrix: Matrix;
        set canvas(arg: any);
        get canvas(): any;
        begin(): Renderer;
        close(): Renderer;
        fill(): Renderer;
        stroke(): Renderer;
        clear(): Renderer;
        style(el: any): void;
        move(pos: any): Renderer;
        line3D(pos: any): Renderer;
        arc2D(centerPos: any, radius: any, stAng: any, edAng: any, anticlockwise?: boolean): Renderer;
        _canvas: any;
        context: any;
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
declare module "core/Layer" {
    export default class Layer {
        constructor(canvas: any);
        elements: any[];
        actionList: ActionList;
        set canvas(arg: any);
        get canvas(): any;
        /**
         * @param  {...{render: Function}} drawable
         */
        add(...drawable: {
            render: Function;
        }[]): void;
        render(): void;
        clear(): void;
        _canvas: any;
        renderer: Renderer;
        set matrix(arg: import("mraph").Matrix);
        get matrix(): import("mraph").Matrix;
    }
    import ActionList from "animation/ActionList";
    import Renderer from "renderer/Renderer";
}
declare module "objects/Graph" {
    export default class Graph {
        size: number;
        dash: any[];
        alpha: number;
        visible: boolean;
        fillColor: string;
        strokeColor: string;
        strokeWidth: number;
        matrix: Matrix;
    }
    import Matrix from "math/Matrix";
}
declare module "objects/Point" {
    export default class Point extends Graph {
        /**
         * @param {Vector|number[]|...number} pos
         */
        constructor(...args: any[]);
        pos: any;
        render(): Point;
        set x(arg: any);
        get x(): any;
        set y(arg: any);
        get y(): any;
        set z(arg: any);
        get z(): any;
        set w(arg: any);
        get w(): any;
    }
    import Graph from "objects/Graph";
}
declare module "objects/Segment" {
    export default class Segment extends Graph {
        constructor(start: any, end: any);
        start: any;
        end: any;
        render(): Segment;
    }
    import Graph from "objects/Graph";
}
declare module "objects/Box" {
    export default class Box extends Graph {
        constructor(base: any, width: any, height: any, depth: any);
        base: any;
        height: any;
        width: any;
        depth: any;
    }
    import Graph from "objects/Graph";
}
declare module "objects/Arrow" {
    export default class _default extends Segment {
        render(): void;
    }
    import Segment from "objects/Segment";
}
declare module "mraph" {
    import Matrix from "math/Matrix";
    import Vector from "math/Vector";
    import Layer from "core/Layer";
    import ActionList from "animation/ActionList";
    import Point from "objects/Point";
    import Segment from "objects/Segment";
    import Box from "objects/Box";
    import Arrow from "objects/Arrow";
    export { Matrix, Vector, Layer, ActionList, Point, Segment, Box, Arrow };
}
