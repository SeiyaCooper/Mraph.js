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
         * Specifies the number of rows and columns of the return matrix.
         * Available numbers are 3 or 4
         * @returns {Matrix}
         */
        static rotateX(ang: number, n?: number): Matrix;
        /**
         * return a rotation matrix
         * @param {number} ang
         * the rotate angle
         * @param {number} [n = 4]
         * Specifies the number of rows and columns of the return matrix.
         * Available numbers are 3 or 4
         * @returns {Matrix}
         */
        static rotateY(ang: number, n?: number): Matrix;
        /**
         * return a rotation matrix
         * @param {number} ang
         * the rotate angle
         * @param {number} [n = 4]
         * Specifies the number of rows and columns of the return matrix.
         * Available numbers are 3 or 4
         * @returns {Matrix}
         */
        static rotateZ(ang: number, n?: number): Matrix;
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
}
declare module "core/Camera" {
    export default class Camera {
        _position: number[];
        _rotation: number[];
        projectionMat: Matrix;
        viewMat: Matrix;
        set position(arg: number[]);
        get position(): number[];
        set rotation(arg: number[]);
        get rotation(): number[];
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
        usage: any;
        render(mesh: any, program: any): void;
        clear(r: any, g: any, b: any, a: any): void;
    }
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
        program: Program;
        appendTo(el: any): Layer;
        add(...els: any[]): Layer;
        render(): Layer;
        clear(r?: number, g?: number, b?: number, a?: number): Layer;
    }
    import Camera from "core/Camera";
    import ActionList from "animation/ActionList";
    import WebglRenderer from "renderer/WebglRenderer";
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
declare module "mobjects/Segment" {
    export default class Segment extends Graph {
        constructor(start: any, end: any);
        strokeWidth: number;
        strokeColor: number[];
        indices: {
            data: number[];
        };
        start: any;
        end: any;
        update(): void;
        renderByCanvas2d(renderer: any): Segment;
    }
    import Graph from "mobjects/Graph";
}
declare module "mobjects/Arc" {
    export default class Arc extends Graph {
        constructor(startAng?: number, endAng?: number, radius?: number, center?: number[]);
        insertNum: number;
        strokeWidth: number;
        strokeColor: number[];
        fillColor: number[];
        startAng: number;
        endAng: number;
        radius: number;
        center: number[];
        update(): void;
    }
    import Graph from "mobjects/Graph";
}
declare module "mobjects/Path" {
    export default class Path extends Graph {
        constructor(...points: any[]);
        _close: boolean;
        points: any[];
        update(): void;
        set close(arg: boolean);
        get close(): boolean;
    }
    import Graph from "mobjects/Graph";
}
declare module "mobjects/Point" {
    export default class Point extends Arc {
        constructor(...args: any[]);
        center: any;
    }
    import Arc from "mobjects/Arc";
}
declare module "mraph" {
    import WebglRenderer from "renderer/WebglRenderer";
    import Matrix from "math/Matrix";
    import Camera from "core/Camera";
    import Layer from "core/Layer";
    import Program from "core/Program";
    import Texture from "core/Texture";
    import Segment from "mobjects/Segment";
    import Arc from "mobjects/Arc";
    import Path from "mobjects/Path";
    import Point from "mobjects/Point";
    export { WebglRenderer, Matrix, Camera, Layer, Program, Texture, Segment, Arc, Path, Point };
}
