import Vector from "../math/Vector.js";
import Geometry from "./Geometry.js";
import * as VECTORS from "../constants/vectors.js";

export default class Plane extends Geometry {
    indices = { data: [0, 1, 3, 2, 0, 3] };

    constructor({ width = 1, height = 1, normal = VECTORS.OUT.clone() } = {}) {
        super();
        this.width = width;
        this.height = height;
        this.normal = normal;
    }

    update() {
        const normal = this.normal;

        const yAxis = new Vector(normal[1], normal[2], normal[0]);
        yAxis.norm = this.height;

        const xAxis = yAxis.cross(normal);
        xAxis.norm = this.width;

        const data = [
            ...VECTORS.ORIGIN,
            ...yAxis,
            ...xAxis,
            ...xAxis.add(yAxis),
        ];
        this.setAttribute("position", data, 3);
    }
}
