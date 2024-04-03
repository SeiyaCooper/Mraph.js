import Geometry from "./Geometry.js";
import Matrix from "../math/Matrix.js";
import Color from "../math/Color.js";
import * as VECTORS from "../constants/vectors.js";

export default class Segment extends Geometry {
    strokeWidth = 0.1;
    strokeColor = new Color(1, 1, 1, 1);
    normal = VECTORS.OUT.clone();
    indices = { data: [0, 1, 3, 2, 0, 3] };
    attributes = {};
    watchList = ["start", "end", "strokeWidth", "strokeColor", "normal"];

    constructor(start = VECTORS.ORIGIN.clone(), end = VECTORS.RIGHT.clone()) {
        super();
        this.start = start;
        this.end = end;
    }

    update() {
        const start = this.start;
        const end = this.end;
        const vec = this.vector.trans(
            Matrix.rotateOn(this.normal, Math.PI / 2, 3)
        );
        vec.norm = this.strokeWidth / 2;

        const vertices = [
            start.add(vec),
            start.minus(vec),
            end.add(vec),
            end.minus(vec),
        ].flat(2);
        const colors = [
            ...this.strokeColor,
            ...this.strokeColor,
            ...this.strokeColor,
            ...this.strokeColor,
        ];
        this.setAttribute("position", vertices, 3);
        this.setAttribute("color", colors, 4);
    }

    get vector() {
        return this.end.minus(this.start);
    }
}
