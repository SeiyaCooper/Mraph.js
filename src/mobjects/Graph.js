import Matrix from "../math/Matrix.js";

export default class Graph {
    indices = [];
    colors = [];
    mode = "TRIANGLES";
    rotation = { x: 0, y: 0, z: 0 };

    // TODO
    get matrix() {
        const rotation = this.rotation;

        return Matrix.rotateX(rotation.x)
            .trans(Matrix.rotateY(rotation.y))
            .trans(Matrix.rotateZ(rotation.z));
    }
}
