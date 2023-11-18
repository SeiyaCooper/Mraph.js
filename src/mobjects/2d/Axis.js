import Line from "./Line.js";
import Point from "./Point.js";
import Vector from "../../math/Vector.js";

export default class Axis extends Line {
    strokeWidth = 0.02;
    tickLength = 0.08;

    constructor(start, end, { unit = 1 } = {}) {
        super(start, end);
        this.unit = unit;
    }

    static fromRange(base, dir, range) {
        dir = dir.normal();

        const pos = Vector.isVector(base) ? base : base.center;
        const start = new Point(pos.add(dir.mult(range[0])));
        const end = new Point(pos.add(dir.mult(range[1])));

        const axis = new Axis(start, end);
        axis.unit = range[2];
        return axis;
    }
}
