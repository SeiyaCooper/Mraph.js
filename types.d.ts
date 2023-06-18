declare module "utils/utils" {
    export function mergeObject(target: any, ...source: any[]): void;
}
declare module "core/layer" {
    export default class Layer {
        constructor(canvas: any, config: any);
        elements: any[];
        set canvas(arg: any);
        get canvas(): any;
        set width(arg: any);
        get width(): any;
        set height(arg: any);
        get height(): any;
        create(type: any, ...attrs: any[]): any;
        draw(): void;
        background(color?: string): void;
        _canvas: any;
        context: any;
    }
}
declare module "core/graph" {
    export default class Graph {
        static draw(source: any, createPath: any): void;
        strokeColor: string;
        strokeWidth: number;
        strokeDash: any[];
        fillColor: string;
        visible: boolean;
    }
}
declare module "object/point" {
    export default class Point extends Graph {
        /**
         * get point from a array
         * @param {(Point | Array<Number>)} source
         * @return {Point}
         */
        static getPoint(source: (Point | Array<number>)): Point;
        /**
         * get position(array) from a point
         * @param {(Point | Array<Number>)} source
         * @return {Array<Number>}
         */
        static getPos(source: (Point | Array<number>)): Array<number>;
        constructor(x: any, y: any, config: any);
        x: any;
        y: any;
        size: number;
        draw(): void;
    }
    import Graph from "core/graph";
}
declare module "object/segment" {
    export default class Segment extends Graph {
        constructor(p1: any, p2: any, config: any);
        point1: Point;
        point2: Point;
        draw(): void;
        /**
         * get length
         */
        get length(): any;
        /**
         * get slope
         */
        get slope(): number;
        /**
         * get the angle with horizontal line
         */
        get angle(): number;
    }
    import Graph from "core/graph";
    import Point from "object/point";
}
declare module "object/line" {
    export default class Line extends Segment {
    }
    import Segment from "object/segment";
}
declare module "object/arc" {
    export default class Arc extends Graph {
        constructor(p1: any, p2: any, p3: any, config: any);
        point1: Point;
        point2: Point;
        point3: Point;
        side1: Segment;
        side2: Segment;
        draw(): void;
        set radius(arg: any);
        get radius(): any;
        _radius: any;
    }
    import Graph from "core/graph";
    import Point from "object/point";
    import Segment from "object/segment";
}
declare module "object/circle" {
    export default class Circle extends Graph {
        constructor(p1: any, p2: any, config: any);
        point1: Point;
        set radius(arg: any);
        get radius(): any;
        point2: Point;
        draw(): void;
        _radius: any;
    }
    import Graph from "core/graph";
    import Point from "object/point";
}
declare module "object/number_line" {
    export default class NumberLine extends Graph {
        constructor(p1: any, p2: any, unit: any, config: any);
        showIntPoints: boolean;
        intPointsLen: number;
        axis: Segment;
        unit: any;
        draw(): void;
        set layer(arg: any);
        get layer(): any;
        _layer: any;
    }
    import Graph from "core/graph";
    import Segment from "object/segment";
}
declare module "animation/action" {
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
declare module "animation/action_list" {
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
declare module "math/matrix" {
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
declare module "mraph" {
    import Layer from "core/layer";
    import Point from "object/point";
    import Segment from "object/segment";
    import Line from "object/line";
    import Arc from "object/arc";
    import Circle from "object/circle";
    import * as utils from "utils/utils";
    import NumberLine from "object/number_line";
    import ActionList from "animation/action_list";
    import Matrix from "math/matrix";
    export { Layer, Point, Segment, Line, Arc, Circle, utils, Constant, NumberLine, ActionList, Matrix };
}
