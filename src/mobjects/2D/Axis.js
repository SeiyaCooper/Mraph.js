import Line from "./Line.js";
import Point from "./Point.js";
import Vector from "../../math/Vector.js";
import Matrix from "../../math/Matrix.js";

export default class Axis extends Line {
    strokeWidth = 0.03;
    tickLength = 0.08;

    constructor(start, end, { unit = 1 } = {}) {
        super(start, end);
        this.unit = unit;
    }

    update() {
        super.update();

        const len = this.length;
        const tick = this.vector
            .trans(Matrix.rotateOn(this.normal, Math.PI / 2, 3))
            .normal()
            .mult(this.tickLength);

        for (let pos = 0; pos <= len; pos += this.unit) {
            const at = this.at(pos / len);
            this.move(at.minus(tick));
            this.line(at.add(tick));
            this.stroke();
        }

        return this;
    }

    /**
     * Create an Axis from oringin point, direction vector and range
     * @param {Point | Vector} base
     * @param {Vector} dir - direction vector
     * @param {number[]} range - an array to describe range,
     *                           it should be formated like [start, end, unit]
     * @returns
     */
    static fromRange(base, dir, range) {
        dir = dir.normal();

        const pos = Vector.isInstance(base) ? base : base.center;
        const start = new Point(pos.add(dir.mult(range[0])));
        const end = new Point(pos.add(dir.mult(range[1])));

        const axis = new Axis(start, end);
        axis.unit = range[2];
        return axis;
    }
}
