import Matrix from "../math/Matrix.js";

export default class Camera {
    position = { x: 0, y: 0, z: 0 };
    rotation = { x: 0, y: 0, z: 0 };

    get matrix() {
        const position = this.position;
        const rotation = this.rotation;

        return Matrix.rotateX(-rotation.x)
            .trans(Matrix.rotateY(-rotation.y))
            .trans(Matrix.rotateZ(-rotation.z))
            .trans(Matrix.translate(-position.x, -position.y, -position.z));
    }
}
