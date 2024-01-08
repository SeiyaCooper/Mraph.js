import Vector from "../math/Vector.js";
import Geometry from "./Geometry.js";
import * as VECTORS from "../constants/vectors.js";

export default class Plane extends Geometry {
    indices = { data: [0, 1, 3, 2, 0, 3] };
    attributes = {
        position: { data: [] },
    };
    watchList = ["width", "height", "normal", "color"];

    constructor({
        position = VECTORS.ORIGIN(),
        width = 1,
        height = 1,
        normal = VECTORS.OUT(),
    } = {}) {
        super();
        this.position = position;
        this.width = width;
        this.height = height;
        this.normal = normal;
    }

    update() {
        const normal = this.normal;
        const position = this.position;
        const attrs = this.attributes;

        const yAxis = new Vector(normal[1], normal[2], normal[0]);
        yAxis.norm = this.height;

        const xAxis = yAxis.cross(normal);
        xAxis.norm = this.width;

        attrs.position.data = [];
        attrs.position.data.push(
            ...position,
            ...position.add(xAxis),
            ...position.add(yAxis),
            ...position.add(xAxis).add(yAxis)
        );
        attrs.position.needsUpdate = true;
    }
}
