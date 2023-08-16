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
         * return the dot product
         * @param {Vector} vec
         * @returns
         */
        dot(vec: Vector): number | Vector;
        /**
         * normalize this vector
         * @returns {Vector}
         */
        normal(): Vector;
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
         * @param {number} num
         */
        set length(arg: number);
        /**
         * @type {number}
         */
        get length(): number;
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
declare module "renderer/CanvasRenderer" {
    export default class CanvasRenderer {
        constructor(canvas: any);
        matrix: Matrix;
        set canvas(arg: any);
        get canvas(): any;
        begin(): CanvasRenderer;
        close(): CanvasRenderer;
        fill(): CanvasRenderer;
        stroke(): CanvasRenderer;
        clear(): CanvasRenderer;
        style(el: any): void;
        move(pos: any): CanvasRenderer;
        line3D(pos: any): CanvasRenderer;
        arc2D(centerPos: any, radius: any, stAng: any, edAng: any, anticlockwise?: boolean): CanvasRenderer;
        _canvas: any;
        context: any;
    }
    import Matrix from "math/Matrix";
}
declare module "core/Layer" {
    export default class Layer {
        /**
         * @param {HTMLCanvasElement} canvas
         * @param {Object} [config={}] Optional Configurations
         */
        constructor(canvas: HTMLCanvasElement, config?: any);
        elements: any[];
        actionList: ActionList;
        rendererClass: typeof CanvasRenderer;
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
        play(): void;
        _canvas: any;
        renderer: CanvasRenderer;
        set matrix(arg: import("mraph").Matrix);
        get matrix(): import("mraph").Matrix;
    }
    import ActionList from "animation/ActionList";
    import CanvasRenderer from "renderer/CanvasRenderer";
}
declare module "renderer/WebglRenderer" {
    export default class WebglRenderer {
        constructor(canvas: any);
        vertexes: any[];
        path: any[];
        mode: any;
        styleSet: {
            strokeWidth: number;
        };
        set canvas(arg: any);
        get canvas(): any;
        set matrix(arg: any);
        get matrix(): any;
        begin(): void;
        close(): void;
        fill(): void;
        stroke(): void;
        clear(): void;
        style(el: any): void;
        move(pos: any): void;
        line3D(pos: any): void;
        arc2D(): void;
        _canvas: any;
        gl: any;
        vertexShader: any;
        fragmentShader: any;
        program: any;
        _matrix: any;
    }
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
    }
}
declare module "objects/Point" {
    export default class Point extends Graph {
        /**
         * @param {Vector|number[]|...number} pos
         */
        constructor(...args: any[]);
        _v: Vector;
        _a: Vector;
        pos: any;
        render(): Point;
        set v(arg: Vector);
        get v(): Vector;
        set a(arg: Vector);
        get a(): Vector;
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
    import Vector from "math/Vector";
}
declare module "objects/Segment" {
    export default class Segment extends Graph {
        constructor(start: any, end: any);
        start: any;
        end: any;
        render(): Segment;
        set vector(arg: any);
        get vector(): any;
        _vector: any;
        set length(arg: any);
        get length(): any;
    }
    import Graph from "objects/Graph";
}
declare module "objects/Group" {
    export default class Group extends Graph {
        constructor(...objs: any[]);
        set objs(arg: any);
        get objs(): any;
        render(): Group;
        add(...objs: any[]): void;
        set(attrName: any, val: any): Group;
        _objs: any;
        set renderer(arg: any);
        get renderer(): any;
        _renderer: any;
    }
    import Graph from "objects/Graph";
}
declare module "objects/Polygon" {
    export default class Polygon extends Group {
        set points(arg: any);
        get points(): any;
        render(): Polygon;
        _points: any;
    }
    import Group from "objects/Group";
}
declare module "objects/Arrow" {
    export default class Arrow extends Segment {
        constructor(...param: any[]);
    }
    import Segment from "objects/Segment";
}
declare module "utils/math" {
    export function sigmoid(x: any): number;
}
declare module "objects/VectorField2D" {
    export default class VectorField2D extends Group {
        constructor(func: any, xRange?: number[], yRange?: number[]);
        lengthFunc: (length: any) => number;
        _center: Vector;
        xRange: number[];
        yRange: number[];
        set func(arg: any);
        get func(): any;
        update(): void;
        _func: any;
        set center(arg: Vector);
        get center(): Vector;
    }
    import Group from "objects/Group";
    import Vector from "math/Vector";
}
declare module "mraph" {
    import Matrix from "math/Matrix";
    import Vector from "math/Vector";
    import Layer from "core/Layer";
    import ActionList from "animation/ActionList";
    import WebglRenderer from "renderer/WebglRenderer";
    import CanvasRenderer from "renderer/CanvasRenderer";
    import Point from "objects/Point";
    import Segment from "objects/Segment";
    import Polygon from "objects/Polygon";
    import Arrow from "objects/Arrow";
    import VectorField2D from "objects/VectorField2D";
    export { Matrix, Vector, Layer, ActionList, WebglRenderer, CanvasRenderer, Point, Segment, Polygon, Arrow, VectorField2D };
}
