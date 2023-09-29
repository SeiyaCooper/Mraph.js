import Matrix from "../math/Matrix.js";
import Line from "./Line.js";
import Point from "./Point.js";
import Vector from "../math/Vector.js";

export default class Axis extends Line {
    strokeWidth = 0.02;

    constructor(start, end, { unit = 1 } = {}) {
        super(start, end);
        this.unit = unit;
    }

    renderByCanvas2d(renderer) {
        super.renderByCanvas2d(renderer);

        const len = this.length;
        const tick = this.vector
            .trans(Matrix.rotateZ(-Math.PI / 2, 3))
            .normal()
            .mult(0.05);

        for (let pos = 0; pos <= len; pos += this.unit) {
            const at = this.at(pos / len);
            renderer.move(at.reduce(tick));
            renderer.line3D(at.add(tick));
        }
        renderer.stroke();

        return this;
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
