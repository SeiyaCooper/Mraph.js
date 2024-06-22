import Vector from "../math/Vector.js";
import Geometry from "./Geometry.js";
import * as VECTORS from "../constants/vectors.js";

export default class Plane extends Geometry {
    constructor({ width = 1, height = 1 } = {}) {
        super();
        this.width = width;
        this.height = height;
        this.setIndex([0, 1, 3, 2, 0, 3]);
    }

    update() {
        const vertices = [
            ...VECTORS.ORIGIN,
            ...new Vector(this.width, 0, 0),
            ...new Vector(0, this.height, 0),
            ...new Vector(this.width, this.height, 0),
        ];
        this.setAttribute("position", vertices, 3);

        const normals = [...VECTORS.OUT, ...VECTORS.OUT, ...VECTORS.OUT, ...VECTORS.OUT];
        this.setAttribute("normal", normals, 3);

        const uvs = [0, 0, 1, 0, 0, 1, 1, 1];
        this.setAttribute("uv", uvs, 2);
    }
}
