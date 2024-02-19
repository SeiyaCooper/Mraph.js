import Graph2D from "./Graph2D.js";
import Point from "./Point.js";
import Color from "../core/Color.js";
import Matrix from "../math/Matrix.js";

export default class Line extends Graph2D {
    strokeWidth = 0.05;
    strokeColor = new Color(1, 1, 1, 1);
    indices = { data: [0, 1, 3, 2, 0, 3] };
    tips = [];
    tipWidth = 0.06;
    tipLength = 0.12;

    constructor(start = new Point(-1, 0), end = new Point(1, 0)) {
        super();
        this.start = start;
        this.end = end;
    }

    update() {
        this.clear();
        this.move(this.start.center);
        this.line(this.end.center);
        this.stroke();

        // draw tips
        if (!this.tips.length) return this;
        const start = this.start.center;
        for (let [at, reverse] of this.tips) {
            const vec = start
                .add(this.vector.mult(at))
                .add(this.vector.normal().mult(0.05));

            this.move(vec);

            const h = this.vector;
            h.norm = this.tipLength;

            const w = h.clone();
            w.norm = this.tipWidth;

            if (reverse) {
                this.line(
                    vec.add(h).add(w.trans(Matrix.rotateZ(Math.PI / 2, 3)))
                );
                this.line(
                    vec.add(h).add(w.trans(Matrix.rotateZ(-Math.PI / 2, 3)))
                );
            } else {
                this.line(
                    vec.reduce(h).add(w.trans(Matrix.rotateZ(Math.PI / 2, 3)))
                );
                this.line(
                    vec.reduce(h).add(w.trans(Matrix.rotateZ(-Math.PI / 2, 3)))
                );
            }
        }
        this.fill();
        return this;
    }

    at(p) {
        return this.start.center.add(this.vector.mult(p));
    }

    addTip(at, reverse = false) {
        this.tips.push([at, reverse]);
    }

    set vector(vec) {
        this.end = new Point(this.start.center.add(vec));
    }

    get vector() {
        return this.end.center.reduce(this.start.center);
    }

    set length(val) {
        const vec = this.vector;
        vec.norm = val;
        this.vector = vec;
    }

    get length() {
        return this.vector.norm;
    }

    get slope() {
        const s = this.start.center;
        const e = this.end.center;

        return (s[1] - s[0]) / (e[1] - e[0]);
    }
}
