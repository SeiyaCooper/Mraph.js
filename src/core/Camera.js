import Matrix from "../math/Matrix.js";
import Vector from "../math/Vector.js";

export default class Camera {
    center = new Vector(0, 0, -10);
    rotation = new Vector(0, 0, 0);
    up = new Vector(0, 1, 0);
    projectionMat = Matrix.identity(4);
    viewMat = Matrix.identity(4);

    constructor() {
        const self = this;
        const handler = {
            get(obj, prop) {
                return obj[prop];
            },
            set(obj, prop, value) {
                obj[prop] = value;
                if (+prop <= 2) {
                    self.update();
                }
                return true;
            },
        };

        const posProxy = new Proxy(this.center, handler);
        const rotProxy = new Proxy(this.rotation, handler);
        this.center = posProxy;
        this.rotation = rotProxy;
    }

    update() {
        const center = this.center;
        const rotation = this.rotation;
        this.viewMat = Matrix.translate(...center)
            .trans(Matrix.rotateX(-rotation[0]))
            .trans(Matrix.rotateY(-rotation[1]))
            .trans(Matrix.rotateZ(-rotation[2]));
    }

    perspective({ fov = 45, near = 0.01, far = 50, aspect = 1 } = {}) {
        const f = far;
        const n = near;
        const a = aspect;
        const c = Math.tan((fov / 360) * Math.PI);
        this.projectionMat = new Matrix(
            [1 / (a * c), 0, 0, 0],
            [0, 1 / c, 0, 0],
            [0, 0, (f + n) / (n - f), -1],
            [0, 0, (2 * f * n) / (n - f), 0]
        );
        this.near = near;
        this.far = far;
        this.update();
        return this;
    }

    ortho({
        left = -1,
        right = 1,
        bottom = -1,
        top = 1,
        near = 0.1,
        far = 1,
    } = {}) {
        const [l, r, b, t, n, f] = [left, right, bottom, top, near, far];
        const mat = Matrix.translate(
            (r + l) / (l - r),
            (t + b) / (b - t),
            (f + n) / (n - f)
        );
        mat[0][0] = 2 / (r - l);
        mat[1][1] = 2 / (t - b);
        mat[2][2] = 2 / (n - f);
        mat[3][3] = 1;
        this.projectionMat = mat;
        this.near = near;
        this.far = far;
        this.update();
        return this;
    }

    lookAt(target) {
        target = Vector.fromArray(target);

        const p = this.center.mult(-1);
        const k = target.add(p).normal();
        const i = k.cross(this.up).normal();
        const j = i.cross(k);

        this.viewMat = Matrix.translate(...p).trans(
            new Matrix(
                [i[0], j[0], -k[0], 0],
                [i[1], j[1], -k[1], 0],
                [i[2], j[2], -k[2], 0],
                [0, 0, 0, 1]
            )
        );
        this.matrix = this.projectionMat.mult(this.viewMat);

        return this;
    }
}
