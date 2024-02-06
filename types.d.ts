declare module "math/math_func" {
    /**
     * sigmoid function
     * @param {number} x
     * @returns {number}
     */
    export function sigmoid(x: number): number;
    /**
     * get mean value from a set numbers
     * @param  {...number} nums
     * @returns {number}
     */
    export function mean(...nums: number[]): number;
    /**
     * Lerp function
     * @param {number} from
     * @param {number} to
     * @param {number} p percent
     * @returns {number}
     */
    export function lerp(from: number, to: number, p: number): number;
    /**
     * Lerp between two arrays
     * @param {number[]} from
     * @param {number[]} to
     * @param {number} p percent
     * @returns {number[]}
     */
    export function lerpArray(from: number[], to: number[], p: number): number[];
    export function linear(x: number): number;
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
        copy(mat: Matrix): this;
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
        set norm(val: number);
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
declare module "math/Vector" {
    export default class Vector extends Array<any> {
        /**
         * Lerp between two vectors
         * @param {Vector} from
         * @param {Vector} to
         * @param {number} p percent
         * @returns {Vector}
         */
        static lerp(from: Vector, to: Vector, p: number): Vector;
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
         * Creates a Vector from an array-like object
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
         * returns linear interpolation results
         * @param {Vector} to
         * @param {number} p percent
         * @returns {Vector}
         */
        lerp(to: Vector, p: number): Vector;
        /**
         * return a deep copy clone of this vector
         * @returns {Vector}
         */
        clone(): Vector;
        /**
         * copy values from another vector
         */
        copy(vec: any): this;
        /**
         * @returns {Matrix}
         */
        toMatrix(): Matrix;
        /**
         * @param {number} val
         */
        set norm(val: number);
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
declare module "animation/Event" {
    export default class Event {
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
declare module "animation/Timeline" {
    export default class Timeline {
        /**
         * A single number to describe state
         * 0 - stopped
         * 1 - active
         * 2 - paused
         * @type {number}
         */
        state: number;
        /**
         * list for events to be called
         * @type {Map}
         */
        events: Map<any, any>;
        /**
         * list for events which would be called during active
         * @type {Map}
         */
        globalEvents: Map<any, any>;
        /**
         * list for events that would always be called,
         * those events will keep this timeline active
         * @type {Map}
         */
        infinityEvents: Map<any, any>;
        /**
         * return value of requsetAnimationFrame()
         * @type {number | null}
         */
        clock: number | null;
        /**
         * @type {number}
         */
        _maxTime: number;
        /**
         * @type {number}
         */
        _minTime: number;
        /**
         * @type {number}
         */
        current: number;
        /**
         * @type {number}
         */
        fps: number;
        /**
         * add an event to this timeline
         * @param {Number} start
         * @param {Number} stop
         * @param {Object} handle
         * @param {Object} config
         * @return {this}
         */
        add(start: number, stop: number, handle: any, { updateMax, updateMin }?: any): this;
        /**
         * add a one-time-only event
         * @param {number} at
         * @param {Function} handler
         */
        once(at: number, handler: Function): void;
        /**
         * add an event to event list following last event
         * @param {Number} hold
         * @param {Object} handler
         * @param {Object} config
         * @return {this}
         */
        addFollow(hold: number, handler: any, config: any): this;
        /**
         * add global event
         * @param {Object} handler
         * @returns {this}
         */
        addGlobal(handler: any): this;
        /**
         * add infinity event
         * @param {Object} handler
         * @returns {this}
         */
        addInfinity(handler: any): this;
        /**
         * start palying animation
         */
        play(): void;
        /**
         * trigger events by current time
         */
        process(): void;
        /**
         * Stop palying aniamtion
         */
        pause(): void;
        set maxTime(val: number);
        get maxTime(): number;
        set minTime(val: number);
        get minTime(): number;
        get allStopped(): boolean;
    }
}
declare module "constants/draw_modes" {
    export function toWebGLMode(gl: any, mode: any): any;
    export const POINTS: 0;
    export const LINE_STRIP: 1;
    export const LINE_LOOP: 2;
    export const LINES: 3;
    export const TRIANGLE_STRIP: 4;
    export const TRIANGLE_FAN: 5;
    export const TRIANGLES: 6;
}
declare module "core/WebGL/WebGLRenderer" {
    export default class WebGLRenderer {
        constructor(canvas: any, contextConfig?: {});
        canvas: any;
        gl: any;
        usage: any;
        render(mesh: any, camera: any, material: any): void;
        clear(r: any, g: any, b: any, a: any): void;
    }
}
declare module "core/Camera" {
    export default class Camera {
        position: Vector;
        rotation: Vector;
        up: Vector;
        projectionMat: Matrix;
        viewMat: Matrix;
        update(): void;
        perspective({ fov, near, far, aspect }?: {
            fov?: number;
            near?: number;
            far?: number;
            aspect?: number;
        }): this;
        ortho({ left, right, bottom, top, near, far, }?: {
            left?: number;
            right?: number;
            bottom?: number;
            top?: number;
            near?: number;
            far?: number;
        }): this;
        lookAt(target: any): this;
        matrix: Matrix;
    }
    import Vector from "math/Vector";
    import Matrix from "math/Matrix";
}
declare module "extra/OrbitControl" {
    export default class OrbitControl {
        constructor(camera: any, { element }?: {
            element?: Document;
        });
        center: Vector;
        _element: Document;
        enableZoom: boolean;
        radius: number;
        scale: number;
        zoomSpeed: number;
        enableRotate: boolean;
        theta: number;
        phi: number;
        phiMax: number;
        phiMin: number;
        deltaAngleMax: number;
        rotateSpeed: number;
        rotateEase: number;
        enableMove: boolean;
        moveSpeed: number;
        moveEase: number;
        camera: any;
        set element(el: Document);
        get element(): Document;
        update(): void;
        rotate(deltaPhi: any, deltaTheta: any): void;
        zoom(scale: any): void;
        move(deltaX: any, deltaY: any): void;
        handleTouchStart(e: any): void;
        handleTouchMove(e: any): void;
        handleTouchEnd(e: any): void;
        handleMouseDown(e: any): void;
        handleMouseMove(e: any): void;
        handleMouseUp(): void;
        handleWheel(e: any): void;
    }
    import Vector from "math/Vector";
}
declare module "animation/Subscriber" {
    export default class Subscriber {
        static watch(target: any, handler: any, { maxDepth, whiteList }?: {
            maxDepth?: number;
            whiteList?: any[];
        }): any;
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
        toArray(): number[];
        toIntRGBA(): Color;
        toRGBAStr(): string;
        toIntRGBAStr(): string;
    }
}
declare module "constants/colors" {
    export const RED_A: Color;
    export const RED_B: Color;
    export const RED_C: Color;
    export const RED_D: Color;
    export const RED: Color;
    export const BLUE_A: Color;
    export const BLUE_B: Color;
    export const BLUE_C: Color;
    export const BLUE_D: Color;
    export const BLUE_E: Color;
    export const BLUE: Color;
    export const GRAY_A: Color;
    export const GRAY_B: Color;
    export const GRAY_C: Color;
    export const GRAY_D: Color;
    export const GRAY_E: Color;
    export const GRAY: Color;
    import Color from "core/Color";
}
declare module "core/WebGL/WebGLProgram" {
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
        set attributes(val: any);
        get attributes(): any;
        set uniforms(val: any);
        get uniforms(): any;
        set textures(val: any);
        get textures(): any;
        use(): void;
        setUniform(name: any, data: any): void;
        setAttriBuffer(name: any, value: any, n: any, usage: any): void;
        getExtension(name: any): any;
        _attributes: any;
        _uniforms: any;
        _textures: any;
    }
}
declare module "material/MobjectMaterial" {
    export default class MobjectMaterial {
        vertexShader: string;
        fragmentShader: string;
        initProgram(gl: any): void;
        program: WebGLProgram;
    }
    import WebGLProgram from "core/WebGL/WebGLProgram";
}
declare module "core/Layer" {
    export default class Layer {
        constructor({ fillScreen, appendTo, rendererClass, contextConfig, }?: {
            fillScreen?: boolean;
            appendTo?: any;
            rendererClass?: typeof WebGLRenderer;
            contextConfig?: {};
        });
        elements: any[];
        camera: Camera;
        timeline: Timeline;
        defaultMaterial: MobjectMaterial;
        canvas: HTMLCanvasElement;
        renderer: WebGLRenderer;
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
         * create a mobject
         * @param {function} mobjClass constructor of this mobject
         * @param {any} [...attrs]
         * @returns {this}
         */
        create(mobjClass: Function, ...attrs: any[]): this;
        /**
         * render mobjects
         * @returns {this}
         */
        render(): this;
        /**
         * clear canvas by a color
         * @param {number[] | Color} [color = COLORS.GRAY_E]
         * @returns {this}
         */
        clear([r, g, b, a]?: number[] | Color): this;
        /**
         * play animation with a refresh color
         * @param {Color} [color = COLORS.GRAY_E]
         * @returns {this}
         */
        play(color?: Color): this;
        /**
         * pause for a while between animations
         * @param {number} [time=1] in seconds
         */
        wait(time?: number): this;
        /**
         * @returns Control
         */
        enableOrbitControl(): OrbitControl;
    }
    import Camera from "core/Camera";
    import Timeline from "animation/Timeline";
    import MobjectMaterial from "material/MobjectMaterial";
    import WebGLRenderer from "core/WebGL/WebGLRenderer";
    import OrbitControl from "extra/OrbitControl";
}
declare module "core/Texture" {
    export default class Texture {
        constructor(gl: any, { image, target, flipY, minFilter, magFilter, }?: {
            image: any;
            target?: any;
            flipY?: boolean;
            minFilter?: any;
            magFilter?: any;
        });
        gl: any;
        image: any;
        target: any;
        flipY: boolean;
        texture: any;
        set minFilter(val: any);
        get minFilter(): any;
        set magFilter(val: any);
        get magFilter(): any;
        upload(): void;
        __minFilter: any;
        __magFilter: any;
    }
}
declare module "material/CustomMaterial" {
    export default class CustomMaterial {
        constructor({ vertexShader, fragmentShader }?: {
            vertexShader?: string;
            fragmentShader?: string;
        });
        vertexShader: string;
        fragmentShader: string;
        initProgram(gl: any): void;
        program: WebGLProgram;
    }
    import WebGLProgram from "core/WebGL/WebGLProgram";
}
declare module "material/BasicMaterial" {
    export default class BasicMaterial {
        constructor({ color }?: {
            color?: Color;
        });
        vertexShader: string;
        fragmentShader: string;
        color: Color;
        initProgram(gl: any): void;
        program: WebGLProgram;
        get transparent(): boolean;
    }
    import Color from "core/Color";
    import WebGLProgram from "core/WebGL/WebGLProgram";
}
declare module "core/Object3D" {
    export default class Object3D {
        /**
         * @type {Geometry | undefined}
         */
        parent: Geometry | undefined;
        /**
         * @type {Geometry[]}
         */
        children: Geometry[];
        /**
         * @type {Matrix}
         */
        _matrix: Matrix;
        /**
         * @param  {...Geometry} objs
         */
        addChild(...objs: Geometry[]): void;
        /**
         * @param  {...Geometry} objs
         */
        deleteChild(...objs: Geometry[]): void;
        /**
         * delete all children
         */
        clearChildren(): void;
        set matrix(val: any);
        get matrix(): any;
    }
    import Matrix from "math/Matrix";
}
declare module "geometry/Geometry" {
    export default class Geometry extends Object3D {
        /**
         * attribute variables
         * @type {Object}
         */
        attributes: any;
        /**
         * uniform variables
         * @type {Object}
         */
        uniforms: any;
        /**
         * @type {number}
         */
        mode: number;
        /**
         * @type {number | Object}
         */
        indices: number | any;
        /**
         * properties to be watched so that this geometry can be updated when needed
         * @type {string[]}
         */
        watchList: string[];
        /**
         * @type {boolean}
         */
        needsUpdate: boolean;
        /**
         * Update variables.
         * Every geometry should have this method,
         * so that it can be updated when needed.
         */
        update(): void;
        /**
         * Merge all children into this geometry.
         * This method assuming all children have and only have two variables, position and color.
         */
        combineChildren(): void;
        /**
         * Set value of a single attribute variable
         * @param {string} name
         * @param {number[]} data
         * @param {number} n
         */
        setAttribute(name: string, data: number[], n: number): void;
        /**
         * Get value of a single attribute variable
         * @param {string} name
         * @param {number[]} data
         * @param {number} n
         */
        getAttribute(name: string): any;
        /**
         * set index
         * @param {number | number[]} data
         */
        setIndex(data: number | number[]): void;
    }
    import Object3D from "core/Object3D";
}
declare module "constants/vectors" {
    export function ORIGIN(): Vector;
    export function UP(): Vector;
    export function DOWN(): Vector;
    export function RIGHT(): Vector;
    export function LEFT(): Vector;
    export function IN(): Vector;
    export function OUT(): Vector;
    import Vector from "math/Vector";
}
declare module "geometry/Plane" {
    export default class Plane extends Geometry {
        constructor({ position, width, height, normal, }?: {
            position?: Vector;
            width?: number;
            height?: number;
            normal?: Vector;
        });
        indices: {
            data: number[];
        };
        attributes: {
            position: {
                data: any[];
            };
        };
        position: Vector;
        width: number;
        height: number;
        normal: Vector;
    }
    import Geometry from "geometry/Geometry";
    import Vector from "math/Vector";
}
declare module "geometry/Box" {
    export default class Box extends Geometry {
        constructor({ center, width, height, depth, }?: {
            center?: Vector;
            width?: number;
            height?: number;
            depth?: number;
        });
        center: Vector;
        width: number;
        height: number;
        depth: number;
    }
    import Geometry from "geometry/Geometry";
    import Vector from "math/Vector";
}
declare module "geometry/Segment" {
    export default class Segment extends Geometry {
        constructor(start?: import("mraph").Vector, end?: import("mraph").Vector);
        strokeWidth: number;
        strokeColor: Color;
        normal: import("mraph").Vector;
        indices: {
            data: number[];
        };
        attributes: {};
        start: import("mraph").Vector;
        end: import("mraph").Vector;
        get vector(): import("mraph").Vector;
    }
    import Geometry from "geometry/Geometry";
    import Color from "core/Color";
}
declare module "geometry/Sphere" {
    export default class Sphere extends Geometry {
        constructor({ radius, phiStart, phiEnd, phiSegments, thetaStart, thetaEnd, thetaSegments, }?: {
            radius?: number;
            phiStart?: number;
            phiEnd?: number;
            phiSegments?: number;
            thetaStart?: number;
            thetaEnd?: number;
            thetaSegments?: number;
        });
        radius: number;
        phiStart: number;
        phiEnd: number;
        phiSegments: number;
        thetaStart: number;
        thetaEnd: number;
        thetaSegments: number;
    }
    import Geometry from "geometry/Geometry";
}
declare module "mobjects/Graph2D" {
    export default class Graph2D extends Geometry {
        normal: import("mraph").Vector;
        up: import("mraph").Vector;
        argumentBuffer: any[];
        commandBuffer: any[];
        fillColor: Color;
        strokeColor: Color;
        strokeWidth: number;
        begin(): void;
        move(pos: any): void;
        line(pos: any): void;
        arc(radius: any, startAngle: any, endAngle: any, clockwise?: boolean): void;
        stroke(): void;
        fill(): void;
        clear(): void;
        toWorldPos(pos: any): any;
        setColor(color: any): void;
    }
    import Geometry from "geometry/Geometry";
    import Color from "core/Color";
}
declare module "mobjects/Arc" {
    export default class Arc extends Graph {
        constructor(startAng?: number, endAng?: number, radius?: number, center?: number[]);
        startAng: number;
        endAng: number;
        radius: number;
        center: number[];
        update(): this;
    }
    import Graph from "mobjects/Graph2D";
}
declare module "mobjects/Point" {
    export default class Point extends Arc {
        constructor(...args: any[]);
        _v: Vector;
        _a: Vector;
        center: any;
        update(): this;
        moveTo(pos: any, { runTime }?: {
            runTime?: number;
        }): void;
        set v(val: Vector);
        get v(): Vector;
        set a(val: Vector);
        get a(): Vector;
        set x(val: any);
        get x(): any;
        set y(val: any);
        get y(): any;
        set z(val: any);
        get z(): any;
    }
    import Arc from "mobjects/Arc";
    import Vector from "math/Vector";
}
declare module "mobjects/Line" {
    export default class Line extends Graph2D {
        constructor(start?: Point, end?: Point);
        indices: {
            data: number[];
        };
        tips: any[];
        start: Point;
        end: Point;
        update(): this;
        at(p: any): any;
        addTip(at: any, reverse?: boolean): void;
        set vector(vec: any);
        get vector(): any;
        set length(val: any);
        get length(): any;
        get slope(): number;
    }
    import Graph2D from "mobjects/Graph2D";
    import Point from "mobjects/Point";
}
declare module "mobjects/Arrow" {
    export default class Arrow extends Line {
        constructor(...param: any[]);
    }
    import Line from "mobjects/Line";
}
declare module "mobjects/Axis" {
    export default class Axis extends Line {
        /**
         * Create an Axis from oringin point, direction vector and range
         * @param {Point | Vector} base
         * @param {Vector} dir - direction vector
         * @param {number[]} range - an array to describe range,
         *                           it should be formated like [start, end, unit]
         * @returns
         */
        static fromRange(base: Point | Vector, dir: Vector, range: number[]): Axis;
        constructor(start: any, end: any, { unit }?: {
            unit?: number;
        });
        tickLength: number;
        unit: number;
        update(): this;
    }
    import Line from "mobjects/Line";
    import Point from "mobjects/Point";
    import Vector from "math/Vector";
}
declare module "mobjects/Axes" {
    export default class Axes extends Graph2D {
        constructor({ xRange, yRange, zRange, center, }?: {
            xRange?: number[];
            yRange?: number[];
            zRange?: number[];
            center?: Point;
        });
        _tickLength: number;
        center: Point;
        xAxis: Axis;
        yAxis: Axis;
        zAxis: Axis;
        addTip(): void;
        set tickLength(val: number);
        get tickLength(): number;
    }
    import Graph2D from "mobjects/Graph2D";
    import Point from "mobjects/Point";
    import Axis from "mobjects/Axis";
}
declare module "mobjects/VectorField2D" {
    export default class VectorField2D extends Geometry {
        constructor({ func, xRange, yRange, }?: {
            func?: (x: any, y: any) => any[];
            xRange?: number[];
            yRange?: number[];
        });
        lengthFunc: (length: any) => number;
        colorFunc: () => Color;
        _center: Vector;
        xRange: number[];
        yRange: number[];
        func: (x: any, y: any) => any[];
        set center(center: Vector);
        get center(): Vector;
    }
    import Geometry from "geometry/Geometry";
    import Color from "core/Color";
    import Vector from "math/Vector";
}
declare module "extra/OBJLoader" {
    export function parseToGeometry(src: any): Promise<Geometry>;
    export function parseToObject(src: any): Promise<{
        position: any[];
        normal: any[];
        uv: any[];
    }>;
    import Geometry from "geometry/Geometry";
}
declare module "mraph" {
    export * as MathFunc from "math/math_func";
    export * as OBJLoader from "extra/OBJLoader";
    export * as COLORS from "constants/colors";
    export * as VECTORS from "constants/vectors";
    export * as DrawModes from "constants/draw_modes";
    import Matrix from "math/Matrix";
    import Vector from "math/Vector";
    import Geometry from "geometry/Geometry";
    import Plane from "geometry/Plane";
    import Box from "geometry/Box";
    import Segment from "geometry/Segment";
    import Sphere from "geometry/Sphere";
    import Graph2D from "mobjects/Graph2D";
    import Point from "mobjects/Point";
    import Line from "mobjects/Line";
    import Arc from "mobjects/Arc";
    import Arrow from "mobjects/Arrow";
    import Axis from "mobjects/Axis";
    import Axes from "mobjects/Axes";
    import VectorField2D from "mobjects/VectorField2D";
    import Layer from "core/Layer";
    import Camera from "core/Camera";
    import Texture from "core/Texture";
    import Color from "core/Color";
    import WebGLRenderer from "core/WebGL/WebGLRenderer";
    import WebGLProgram from "core/WebGL/WebGLProgram";
    import CustomMaterial from "material/CustomMaterial";
    import BasicMaterial from "material/BasicMaterial";
    import Event from "animation/Event";
    import Timeline from "animation/Timeline";
    import Subscriber from "animation/Subscriber";
    import OrbitControl from "extra/OrbitControl";
    export { Matrix, Vector, Geometry, Plane, Box, Segment, Sphere, Graph2D, Point, Line, Arc, Arrow, Axis, Axes, VectorField2D, Layer, Camera, Texture, Color, WebGLRenderer, WebGLProgram, CustomMaterial, BasicMaterial, Event, Timeline, Subscriber, OrbitControl };
}
