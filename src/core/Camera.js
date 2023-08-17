import Matrix from "../math/Matrix.js";

export default class Camera {
    position = { x: 0, y: 0, z: -5 };
    rotation = { x: 0, y: 0, z: 0 };
    fov = 30;
    near = 1;
    far = 100;
    aspect = 1;

    get matrix() {
        const position = this.position;
        const rotation = this.rotation;
        const f = this.far;
        const n = this.near;
        const a = this.aspect;
        const c = Math.tan((this.fov / 360) * Math.PI);

        return Matrix.translate(-position.x, -position.y, -position.z)
            .trans(Matrix.rotateX(-rotation.x))
            .trans(Matrix.rotateY(-rotation.y))
            .trans(Matrix.rotateZ(-rotation.z))
            .trans(
                new Matrix(
                    [1 / (a * c), 0, 0, 0],
                    [0, 1 / c, 0, 0],
                    [0, 0, (f + n) / (n - f), (2 * f * n) / (f - n)],
                    [0, 0, -1, 0]
                )
            );
    }
}
