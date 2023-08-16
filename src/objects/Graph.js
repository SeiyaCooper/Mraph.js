import Matrix from "../math/Matrix.js";

export default class Graph {
    size = 5;
    visible = true;
    _color = [0, 0, 0, 1];
    vertexes = [];
    indices = [];
    colors = [];
    rotation = { x: 0, y: 0, z: 0 };
    position = { x: 0, y: 0, z: 0 };

    set color(rgba) {
        this._color = rgba;
        this.colors = Array(this.vertexes.length).fill(rgba);
    }
    get color() {
        return this._color;
    }

    get matrix() {
        const pos = this.position;
        return Matrix.rotateX(this.rotation.x)
            .trans(Matrix.rotateY(this.rotation.y))
            .trans(Matrix.rotateZ(this.rotation.z))
            .trans(Matrix.translate(pos.x, pos.y, pos.z));
    }
}
