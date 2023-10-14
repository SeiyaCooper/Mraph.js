declare module "math/Vector" {
    export default class Vector extends Array<any> {
        /**
         * @param {*} obj
         * @returns {boolean}
         */
        static isVector(obj: any): boolean;
        /**
         * @param {number} row
         * @param {number} n
         * @returns {Vector}
         */
        static fromRow(row: number, n?: number): Vector;
        /**
         * @param {Array | Vector} arr
         * @returns {Vector}
         */
        static fromArray(arr: any[] | Vector): Vector;
        /**
         * @param  {...number} nums
         */
        constructor(...nums: number[]);
        /**
         * mult a scalar
         * @param {number} num
         * @returns {Vector}
         */
        mult(num: number): Vector;
        /**
         * returns mat.mult(this)
         * @param {Matrix} mat
         * @returns {Vector}
         */
        trans(mat: Matrix): Vector;
        /**
         * @param {Vector} vec
         * @returns {number}
         */
        dot(vec: Vector): number;
        /**
         * returns cross product of this vector and vec
         * @param {Vector} vec
         * @returns
         */
        cross(vec: Vector): number | Vector;
        /**
         * returns hadamard product of this vector and vec
         * @param {Vector} vec
         * @returns {Vector}
         */
        elMult(vec: Vector): Vector;
        /**
         * divide by a number
         * @param {number} num
         */
        divide(num: number): Vector;
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
         * normalize this vector
         * @returns {Vector}
         */
        normal(): Vector;
        /**
         * return a deep copy clone of this vector
         * @returns {Vector}
         */
        clone(): Vector;
        /**
         * copy values from another vector
         */
        copy(vec: any): Vector;
        /**
         * @returns {Matrix}
         */
        toMatrix(): Matrix;
        /**
         * @param {number} val
         */
        set norm(arg: number);
        /**
         * @type {number}
         */
        get norm(): number;
        /**
         * @type {number}
         */
        get row(): number;
    }
    import Matrix from "math/Matrix";
}
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
         * return a rotation matrix
         * @param {number} ang
         * the rotate angle
         * @param {number} [n = 4]
         * Specifies the number of rows and columns of the return matrix
         * Available numbers are 3 or 4
         * @returns {Matrix}
         */
        static rotateX(ang: number, n?: number): Matrix;
        /**
         * return a rotation matrix
         * @param {number} ang
         * the rotate angle
         * @param {number} [n = 4]
         * Specifies the number of rows and columns of the return matrix
         * Available numbers are 3 or 4
         * @returns {Matrix}
         */
        static rotateY(ang: number, n?: number): Matrix;
        /**
         * return a rotation matrix
         * @param {number} ang
         * the rotate angle
         * @param {number} [n = 4]
         * Specifies the number of rows and columns of the return matrix
         * Available numbers are 3 or 4
         * @returns {Matrix}
         */
        static rotateZ(ang: number, n?: number): Matrix;
        /**
         * returns a rotation matrix to rotate on given axis
         * @param {Vector} axis
         * the axis to rotate on
         * @param {number} angle
         * the rotate angle
         * @param {number} n
         */
        static rotateOn(axis: Vector, angle: number, n?: number): Matrix;
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
         * mult a vector, matrix or scalar
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
         * mult a scalar
         * @param {number} num
         * @returns {Matrix}
         */
        multNum(num: number): Matrix;
        /**
         * returns hadamard product of this matrix and mat
         * @param {Matrix} mat
         * @returns {Matrix}
         */
        elMult(mat: Matrix): Matrix;
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
        copy(mat: Matrix): Matrix;
        length: any;
        /**
         * resize this matrix with a number to fill
         * @param {number} row
         * @param {number} column
         * @param {number} [n=0]
         */
        resize(row: number, column: number, n?: number): Matrix;
        /**
         * Returns a vector constructed by flattening this matrix
         * @returns {Vector}
         */
        toVector(): Vector;
        /**
         * @param {number} val
         */
        set norm(arg: number);
        /**
         * @returns {number} F-norm of this matrix
         */
        get norm(): number;
        /**
         * return transpose of this matrix
         * @returns {Matrix}
         */
        get T(): Matrix;
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
declare module "core/Camera" {
    export default class Camera {
        position: Vector;
        rotation: Vector;
        up: Vector;
        projectionMat: Matrix;
        viewMat: Matrix;
        update(): void;
        matrix: Matrix;
        perspective({ fov, near, far, aspect }?: {
            fov?: number;
            near?: number;
            far?: number;
            aspect?: number;
        }): Camera;
        ortho({ left, right, bottom, top, near, far, }?: {
            left?: number;
            right?: number;
            bottom?: number;
            top?: number;
            near?: number;
            far?: number;
        }): Camera;
        lookAt(target: any): Camera;
    }
    import Vector from "math/Vector";
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
        _maxTime: number;
        /**
         * @type {number}
         */
        _minTime: number;
        /**
         * add an action to action list
         * @param {Number} start
         * @param {Number} stop
         * @param {Object} handle
         * @return {this}
         */
        add(start: number, stop: number, handle: any): this;
        /**
         * add an action to action list following last action
         * @param {Number} hold
         * @param {Object} handle
         * @return {this}
         */
        addFollow(hold: number, handle: any): this;
        /**
         * add action globally (from  min time to max time)
         * @param {Object} handle
         * @returns
         */
        addGlobal(handle: any): ActionList;
        /**
         * play this action list
         */
        play(): void;
        set maxTime(arg: number);
        get maxTime(): number;
        set minTime(arg: number);
        get minTime(): number;
    }
}
declare module "renderer/CanvasRenderer" {
    export default class CanvasRenderer {
        constructor(canvas: any);
        matrix: Matrix;
        modelMat: Matrix;
        set canvas(arg: any);
        get canvas(): any;
        resolution: Vector;
        render(mesh: any): void;
        begin(): CanvasRenderer;
        close(): CanvasRenderer;
        fill(): CanvasRenderer;
        stroke(): CanvasRenderer;
        clear(r: any, g: any, b: any, a: any): CanvasRenderer;
        style(el: any): CanvasRenderer;
        move(pos: any): CanvasRenderer;
        line3D(pos: any): CanvasRenderer;
        arc2D(pos: any, radius: any, stAng: any, edAng: any, anticlockwise?: boolean): CanvasRenderer;
        toScreenPos(pos: any): Vector;
        _canvas: any;
        context: any;
        /**
         * Returns the number of pixels in scene space per unit length on the screen
         */
        get sceneUnit(): number;
    }
    import Matrix from "math/Matrix";
    import Vector from "math/Vector";
}
declare module "core/Program" {
    export default class Program {
        constructor(gl: any, { vs, fs, attributes, uniforms, textures }?: {
            vs?: string;
            fs?: string;
            attributes?: {};
            uniforms?: {};
            textures?: any[];
        });
        locations: Map<any, any>;
        gl: any;
        vs: any;
        fs: any;
        program: any;
        set attributes(arg: any);
        get attributes(): any;
        set uniforms(arg: any);
        get uniforms(): any;
        set textures(arg: any);
        get textures(): any;
        setUniform(name: any, data: any): void;
        getExtension(name: any): any;
        _attributes: any;
        _uniforms: any;
        _textures: any;
    }
}
declare module "core/Color" {
    export default class Color extends Array<any> {
        /**
         * @param {number} [r=0]
         * @param {number} [g=0]
         * @param {number} [b=0]
         * @param {number} [a=1]
         */
        constructor(r?: number, g?: number, b?: number, a?: number);
        r: number;
        g: number;
        b: number;
        a: number;
        toIntRGBA(): Color;
        toRGBAStr(): string;
        toIntRGBAStr(): string;
    }
}
declare module "constants/colors" {
    export const BLUE_A: Color;
    export const BLUE_B: Color;
    export const BLUE_C: Color;
    export const BLUE_D: Color;
    export const BLUE_E: Color;
    export const GRAY_A: Color;
    export const GRAY_B: Color;
    export const GRAY_C: Color;
    export const GRAY_D: Color;
    export const GRAY_E: Color;
    import Color from "core/Color";
}
declare module "core/Layer" {
    export default class Layer {
        constructor({ fillScreen, appendTo, rendererClass, }?: {
            fillScreen?: boolean;
            appendTo?: any;
            rendererClass?: typeof CanvasRenderer;
        });
        elements: any[];
        camera: Camera;
        actionList: ActionList;
        canvas: HTMLCanvasElement;
        renderer: CanvasRenderer;
        program: Program;
        /**
         * append this.canvas to a HTMLElement
         * @param {HTMLElement} el
         * @returns {this}
         */
        appendTo(el: HTMLElement): this;
        /**
         * add mobjects to layer
         * @param  {...mobject} els
         * @returns {this}
         */
        add(...els: mobject[]): this;
        /**
         * render mobjects
         * @returns {this}
         */
        render(): this;
        /**
         * clear canvas by a color
         * @param {number} [r=0]
         * @param {number} [g=0]
         * @param {number} [b=0]
         * @param {number} [a=1]
         * @returns {this}
         */
        clear([r, g, b, a]?: number): this;
        /**
         * play animation by a refresh color
         * @param {number} [r=0]
         * @param {number} [g=0]
         * @param {number} [b=0]
         * @param {number} [a=1]
         * @returns {this}
         */
        play(r?: number, g?: number, b?: number, a?: number): this;
        /**
         * pause for a while between animations
         * @param {number} [time=1] in seconds
         */
        wait(time?: number): Layer;
    }
    import Camera from "core/Camera";
    import ActionList from "animation/ActionList";
    import CanvasRenderer from "renderer/CanvasRenderer";
    import Program from "core/Program";
}
declare module "core/Texture" {
    export default class Texture {
        constructor(gl: any, { image, target, flipY }?: {
            image: any;
            target?: any;
            flipY?: boolean;
        });
        gl: any;
        image: any;
        target: any;
        flipY: boolean;
        texture: any;
        upload(): void;
    }
}
declare module "renderer/WebglRenderer" {
    export default class WebglRenderer {
        constructor(canvas: any);
        canvas: any;
        gl: any;
        usage: any;
        render(mesh: any, program: any): void;
        clear(r: any, g: any, b: any, a: any): void;
    }
}
declare module "mobjects/Graph" {
    export default class Graph {
        indices: {
            data: any[];
        };
        children: any[];
        visible: boolean;
        mode: string;
        attributes: {
            position: {
                data: any[];
            };
            color: {
                data: any[];
            };
        };
        uniforms: {
            modelMat: Matrix;
        };
        /**
         * get ready for rendering
         * set some properties after get gl context
         */
        prepareToRender(): void;
        set gl(arg: any);
        get gl(): any;
        _gl: any;
    }
    import Matrix from "math/Matrix";
}
declare module "mobjects/Graph2D" {
    export default class Graph2D extends Graph {
        _normal: Vector;
        /**
         * @type {Matrix}
         * Cache for rotating matrices around normal vector
         */
        rot90OnNorVec: Matrix;
        _color: Color;
        strokeColor: Color;
        strokeWidth: number;
        fillColor: Color;
        set color(arg: Color);
        get color(): Color;
        set normal(arg: Vector);
        get normal(): Vector;
    }
    import Graph from "mobjects/Graph";
    import Vector from "math/Vector";
    import Matrix from "math/Matrix";
    import Color from "core/Color";
}
declare module "mobjects/2d/Arc" {
    export default class Arc extends Graph2D {
        constructor(startAng?: number, endAng?: number, radius?: number, center?: number[]);
        insertNum: number;
        startAng: number;
        endAng: number;
        radius: number;
        center: number[];
        update(): void;
        renderByCanvas2d(renderer: any): Arc;
    }
    import Graph2D from "mobjects/Graph2D";
}
declare module "mobjects/2d/Point" {
    export default class Point extends Arc {
        constructor(...args: any[]);
        _v: Vector;
        _a: Vector;
        center: any;
        renderByCanvas2d(renderer: any): Point;
        moveTo(pos: any, { runTime }?: {
            runTime?: number;
        }): void;
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
    }
    import Arc from "mobjects/2d/Arc";
    import Vector from "math/Vector";
}
declare module "mobjects/2d/Line" {
    export default class Segment extends Graph2D {
        constructor(start?: Point, end?: Point);
        indices: {
            data: number[];
        };
        tips: any[];
        start: Point;
        end: Point;
        update(): void;
        renderByCanvas2d(renderer: any): Segment;
        at(p: any): any;
        addTip(at: any, reverse?: boolean): void;
        set vector(arg: any);
        get vector(): any;
        set length(arg: any);
        get length(): any;
        get slope(): number;
    }
    import Graph2D from "mobjects/Graph2D";
    import Point from "mobjects/2d/Point";
}
declare module "mobjects/2d/Path" {
    export default class Path extends Graph2D {
        constructor(...points: any[]);
        _close: boolean;
        points: any[];
        update(): void;
        set close(arg: boolean);
        get close(): boolean;
    }
    import Graph2D from "mobjects/Graph2D";
}
declare module "mobjects/2d/Arrow" {
    export default class Arrow extends Line {
        constructor(...param: any[]);
    }
    import Line from "mobjects/2d/Line";
}
declare module "utils/math" {
    export function sigmoid(x: any): number;
}
declare module "mobjects/2d/VectorField2D" {
    export default class VectorField2D extends Graph2D {
        constructor(func?: (x: any, y: any) => any[], xRange?: number[], yRange?: number[]);
        lengthFunc: (length: any) => number;
        colorFunc: () => Color;
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
    import Graph2D from "mobjects/Graph2D";
    import Color from "core/Color";
    import Vector from "math/Vector";
}
declare module "mobjects/2d/Axis" {
    export default class Axis extends Line {
        static fromRange(base: any, dir: any, range: any): Axis;
        constructor(start: any, end: any, { unit }?: {
            unit?: number;
        });
        unit: number;
        renderByCanvas2d(renderer: any): Axis;
    }
    import Line from "mobjects/2d/Line";
}
declare module "mobjects/3d/Axes" {
    export default class Axes extends Graph2D {
        constructor({ xRange, yRange, zRange, center, }?: {
            xRange?: number[];
            yRange?: number[];
            zRange?: number[];
            center?: Point;
        });
        center: Point;
        xAxis: Axis;
        yAxis: Axis;
        zAxis: Axis;
        set layer(arg: any);
        get layer(): any;
        _layer: any;
    }
    import Graph2D from "mobjects/Graph2D";
    import Point from "mobjects/2d/Point";
    import Axis from "mobjects/2d/Axis";
}
declare module "mraph" {
    export * as COLORS from "constants/colors";
    import WebglRenderer from "renderer/WebglRenderer";
    import Matrix from "math/Matrix";
    import Vector from "math/Vector";
    import Camera from "core/Camera";
    import Layer from "core/Layer";
    import Program from "core/Program";
    import Texture from "core/Texture";
    import Color from "core/Color";
    import Line from "mobjects/2d/Line";
    import Arc from "mobjects/2d/Arc";
    import Path from "mobjects/2d/Path";
    import Point from "mobjects/2d/Point";
    import Arrow from "mobjects/2d/Arrow";
    import VectorField2D from "mobjects/2d/VectorField2D";
    import Axis from "mobjects/2d/Axis";
    import Axes from "mobjects/3d/Axes";
    export { WebglRenderer, Matrix, Vector, Camera, Layer, Program, Texture, Color, Line, Arc, Path, Point, Arrow, VectorField2D, Axis, Axes };
}
