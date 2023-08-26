import Matrix from "../math/Matrix.js";

export default class Camera {
    _position = [0, 0, 0];
    _rotation = [0, 0, 0];
    projectionMat = Matrix.identity(4);
    viewMat = Matrix.identity(4);

    constructor() {
        this.position = [0, 0, 10];
        this.rotation = [0, 0, 0];
    }

    update() {
        const position = this.position;
        const rotation = this.rotation;
        this.viewMat = Matrix.translate(
            -position[0],
            -position[1],
            -position[2]
        )
            .trans(Matrix.rotateX(-rotation[0]))
            .trans(Matrix.rotateY(-rotation[1]))
            .trans(Matrix.rotateZ(-rotation[2]));
        this.matrix = this.projectionMat.mult(this.viewMat);
    }

    perspective({ fov = 45, near = 1, far = 100, aspect = 1 } = {}) {
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
        this.update();
        return this;
    }

    set position(arr) {
        this._position = arr;
        this.update();
    }

    get position() {
        return this._position;
    }

    set rotation(arr) {
        this._rotation = arr;
        this.update();
    }

    get rotation() {
        return this._rotation;
    }
}
