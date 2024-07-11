import Matrix from "../math/Matrix.js";
import Vector from "../math/Vector.js";
import Node from "./Node.js";

export default class Camera extends Node {
    /**
     * The center of this camera.
     * @type {Vector}
     */
    center = new Vector(0, 0, -10);

    /**
     * @type {Vector}
     */
    rotation = new Vector(0, 0, 0);

    /**
     * @type {Vector}
     */
    up = new Vector(0, 1, 0);

    /**
     * Projection matrix, generated automatically, indentity matrix by default.
     * @type {Matrix}
     */
    projectionMat = Matrix.identity(4);

    /**
     * View matrix, generated automatically, indentity matrix by default.
     * @type {Matrix}
     */
    viewMat = Matrix.identity(4);

    /**
     * @type {Matrix}
     */
    matrix = Matrix.identity(4);

    /**
     * @type {string}
     */
    mode = "perspective";

    /**
     * @type {number}
     */
    far = 10000000;

    /**
     * @type {number}
     */
    near = 0.001;

    /**
     * @type {number}
     */
    left = -1;

    /**
     * @type {number}
     */
    right = 1;

    /**
     * @type {number}
     */
    bottom = -1;

    /**
     * @type {number}
     */
    top = 1;

    /**
     * @type {number}
     */
    fov = 45;

    /**
     * @type {number}
     */
    aspect = 1;

    constructor() {
        super();
        const self = this;
        const handler = {
            get(obj, prop) {
                return obj[prop];
            },
            set(obj, prop, value) {
                obj[prop] = value;
                if (+prop <= 2) {
                    self.updateMatrix();
                }
                return true;
            },
        };

        const posProxy = new Proxy(this.center, handler);
        const rotProxy = new Proxy(this.rotation, handler);
        this.center = posProxy;
        this.rotation = rotProxy;
    }

    updateViewMatrix() {
        const center = this.center;
        const rotation = this.rotation;
        this.viewMat = Matrix.translation(...center)
            .trans(Matrix.rotateX(-rotation[0]))
            .trans(Matrix.rotateY(-rotation[1]))
            .trans(Matrix.rotateZ(-rotation[2]));
        this.matrix = this.projectionMat.mult(this.viewMat);
    }

    perspective({ fov, near, far, aspect } = {}) {
        this.fov = fov ?? this.fov;
        this.near = near ?? this.near;
        this.far = far ?? this.far;
        this.aspect = aspect ?? this.aspect;
        this.mode = "perspective";

        const f = this.far;
        const n = this.near;
        const a = this.aspect;
        const c = Math.tan((this.fov / 360) * Math.PI);

        this.projectionMat = new Matrix(
            [1 / (a * c), 0, 0, 0],
            [0, 1 / c, 0, 0],
            [0, 0, (f + n) / (n - f), -1],
            [0, 0, (2 * f * n) / (n - f), 0]
        );

        this.updateViewMatrix();
        return this;
    }

    ortho({ left, right, bottom, top, near, far } = {}) {
        this.left = left ?? this.left;
        this.right = right ?? this.right;
        this.bottom = bottom ?? this.bottom;
        this.top = top ?? this.top;
        this.near = near ?? this.near;
        this.far = far ?? this.far;
        this.mode = "ortho";

        const [l, r, b, t, n, f] = [this.left, this.right, this.bottom, this.top, this.near, this.far];

        const mat = Matrix.translation((r + l) / (l - r), (t + b) / (b - t), (f + n) / (n - f));
        mat[0][0] = 2 / (r - l);
        mat[1][1] = 2 / (t - b);
        mat[2][2] = 2 / (n - f);
        mat[3][3] = 1;

        this.projectionMat = mat;
        this.updateViewMatrix();
        return this;
    }

    lookAt(target) {
        target = Vector.fromArray(target);

        const p = this.center.mult(-1);
        const k = target.add(p).normal();
        const i = k.cross(this.up).normal();
        const j = i.cross(k);

        this.viewMat = Matrix.translation(...p).trans(
            new Matrix([i[0], j[0], -k[0], 0], [i[1], j[1], -k[1], 0], [i[2], j[2], -k[2], 0], [0, 0, 0, 1])
        );
        this.matrix = this.projectionMat.mult(this.viewMat);

        return this;
    }
}
